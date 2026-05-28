#!/usr/bin/env node
import { createServer as createHttpServer } from "node:http";
import { mkdir, readdir, readFile, realpath, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const DEFAULT_VAULT_PATH = "/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory";
const DEFAULT_PORT = 8777;
const DEFAULT_ALLOWED_ROOTS = [
  "AGENTS.md",
  "00 Start Here.md",
  "01 Indexes",
  "10 Doctrine",
  "30 Clients",
  "60 Claims",
  "70 Triples",
  "80 Logs",
  "85 Snapshots",
  "90 System",
];
const DEFAULT_EXCLUDED_ROOTS = [
  ".git",
  ".obsidian",
  ".trash",
  "_archive",
  "50 Sources/Raw Inbox",
  "node_modules",
];
const NOTE_EXTENSIONS = new Set([".md", ".markdown", ".txt"]);
const MAX_SEARCH_FILE_BYTES = 250_000;
const MAX_FETCH_BYTES = Number(process.env.OUTLET_OBSIDIAN_MCP_MAX_FETCH_BYTES || 250_000);
const MAX_WRITE_BYTES = 40_000;

function splitEnvList(value, fallback) {
  if (!value) return [...fallback];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getConfig(overrides = {}) {
  const pathToken = String(overrides.pathToken ?? process.env.OUTLET_OBSIDIAN_MCP_PATH_TOKEN ?? "").trim();
  return {
    vaultPath: resolve(overrides.vaultPath || process.env.OUTLET_MEMORY_VAULT || DEFAULT_VAULT_PATH),
    port: Number(overrides.port || process.env.OUTLET_OBSIDIAN_MCP_PORT || DEFAULT_PORT),
    allowedRoots: splitEnvList(process.env.OUTLET_OBSIDIAN_MCP_ALLOWED_ROOTS, DEFAULT_ALLOWED_ROOTS),
    excludedRoots: splitEnvList(process.env.OUTLET_OBSIDIAN_MCP_EXCLUDED_ROOTS, DEFAULT_EXCLUDED_ROOTS),
    enableWrites: Boolean(overrides.enableWrites ?? /^true$/i.test(process.env.OUTLET_OBSIDIAN_MCP_ENABLE_WRITES || "")),
    pathToken,
  };
}

function mcpPathForConfig(config) {
  if (!config.pathToken) return "/mcp";
  if (!/^[A-Za-z0-9_-]{16,256}$/.test(config.pathToken)) {
    throw new Error("OUTLET_OBSIDIAN_MCP_PATH_TOKEN must be 16-256 URL-safe characters.");
  }
  return `/mcp/${config.pathToken}`;
}

function normalizeSlashes(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\/+/, "");
}

function isAllowedByRoots(relativePath, roots) {
  const normalized = normalizeSlashes(relativePath);
  return roots.some((root) => {
    const normalizedRoot = normalizeSlashes(root).replace(/\/+$/, "");
    return normalized === normalizedRoot || normalized.startsWith(`${normalizedRoot}/`);
  });
}

function isExcludedByRoots(relativePath, roots) {
  const normalized = normalizeSlashes(relativePath);
  return roots.some((root) => {
    const normalizedRoot = normalizeSlashes(root).replace(/\/+$/, "");
    return normalized === normalizedRoot || normalized.startsWith(`${normalizedRoot}/`);
  });
}

function hasNoteExtension(relativePath) {
  const lower = relativePath.toLowerCase();
  return [...NOTE_EXTENSIONS].some((extension) => lower.endsWith(extension));
}

function normalizeVaultRelativePath(input) {
  let value = String(input || "").trim();
  if (!value) throw new Error("A vault-relative note path is required.");

  if (value.startsWith("obsidian://")) {
    const uri = new URL(value);
    value = uri.searchParams.get("file") || "";
  }

  value = decodeURIComponent(value).replace(/\0/g, "").replace(/\\/g, "/").replace(/^\/+/, "");
  const parts = value.split("/").filter(Boolean);
  if (!parts.length || parts.some((part) => part === ".." || part === ".")) {
    throw new Error("Only vault-relative note paths are allowed.");
  }

  return parts.join("/");
}

function safeJoin(vaultPath, relativePath) {
  const normalized = normalizeVaultRelativePath(relativePath);
  return resolve(vaultPath, normalized);
}

async function assertInsideVault(vaultPath, targetPath) {
  const [vaultRealPath, targetRealPath] = await Promise.all([realpath(vaultPath), realpath(targetPath)]);
  if (targetRealPath !== vaultRealPath && !targetRealPath.startsWith(`${vaultRealPath}${sep}`)) {
    throw new Error("Resolved path is outside the configured vault.");
  }
  return { vaultRealPath, targetRealPath };
}

function obsidianUri(vaultName, relativePath) {
  const params = new URLSearchParams({ vault: vaultName, file: relativePath });
  return `obsidian://open?${params.toString()}`;
}

function makeJsonToolResult(structuredContent) {
  return {
    structuredContent,
    content: [{ type: "text", text: JSON.stringify(structuredContent) }],
  };
}

async function walkNotes(config, currentRelative = "") {
  const currentPath = resolve(config.vaultPath, currentRelative);
  const entries = await readdir(currentPath, { withFileTypes: true });
  const notes = [];

  for (const entry of entries) {
    const relativePath = normalizeSlashes(join(currentRelative, entry.name));
    if (isExcludedByRoots(relativePath, config.excludedRoots)) continue;
    if (!isAllowedByRoots(relativePath, config.allowedRoots)) continue;

    if (entry.isDirectory()) {
      notes.push(...(await walkNotes(config, relativePath)));
      continue;
    }

    if (entry.isFile() && hasNoteExtension(relativePath)) {
      notes.push(relativePath);
    }
  }

  return notes;
}

async function readAllowedNote(config, inputPath, { maxBytes = MAX_FETCH_BYTES } = {}) {
  let relativePath = normalizeVaultRelativePath(inputPath);
  let fullPath = safeJoin(config.vaultPath, relativePath);

  if (!existsSync(fullPath) && !hasNoteExtension(relativePath)) {
    relativePath = `${relativePath}.md`;
    fullPath = safeJoin(config.vaultPath, relativePath);
  }

  if (!isAllowedByRoots(relativePath, config.allowedRoots) || isExcludedByRoots(relativePath, config.excludedRoots)) {
    throw new Error(`Path is not exposed by this MCP server: ${relativePath}`);
  }
  if (!hasNoteExtension(relativePath)) {
    throw new Error("Only markdown/text note files can be fetched.");
  }

  const fileStat = await stat(fullPath);
  if (!fileStat.isFile()) throw new Error("Requested path is not a note file.");
  await assertInsideVault(config.vaultPath, fullPath);

  const content = await readFile(fullPath, "utf8");
  const truncated = Buffer.byteLength(content, "utf8") > maxBytes;
  return {
    relativePath,
    fullPath,
    content: truncated ? content.slice(0, maxBytes) : content,
    truncated,
    size: fileStat.size,
    modifiedAt: fileStat.mtime.toISOString(),
  };
}

function titleFromNote(relativePath, content) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || basename(relativePath).replace(/\.(md|markdown|txt)$/i, "");
}

function tokenize(query) {
  return String(query || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);
}

function scoreNote(relativePath, title, content, terms, query) {
  const haystack = `${relativePath}\n${title}\n${content}`.toLowerCase();
  const titleHaystack = `${relativePath}\n${title}`.toLowerCase();
  const phrase = query.trim().toLowerCase();
  let score = phrase && haystack.includes(phrase) ? 12 : 0;
  let firstIndex = Number.POSITIVE_INFINITY;
  let matchedTerms = 0;

  for (const term of terms) {
    const termMatches = haystack.split(term).length - 1;
    if (!termMatches) continue;
    matchedTerms += 1;
    score += Math.min(termMatches, 10);
    if (titleHaystack.includes(term)) score += 4;
    const index = haystack.indexOf(term);
    if (index >= 0) firstIndex = Math.min(firstIndex, index);
  }

  const requiredTerms = terms.length <= 3 ? terms.length : Math.ceil(terms.length * 0.6);
  if (!score || ((!phrase || !haystack.includes(phrase)) && matchedTerms < requiredTerms)) return null;
  if (score <= 0) return null;
  const excerptStart = Number.isFinite(firstIndex) ? Math.max(0, firstIndex - 120) : 0;
  const excerpt = content
    .slice(excerptStart, excerptStart + 320)
    .replace(/\s+/g, " ")
    .trim();

  return { score, excerpt };
}

export async function searchNotes(query, options = {}) {
  const config = { ...getConfig(options), ...options };
  const terms = tokenize(query);
  if (!terms.length) return { results: [] };

  const vaultName = basename(config.vaultPath);
  const notePaths = await walkNotes(config);
  const results = [];
  const limit = Math.min(Math.max(Number(options.limit || 8), 1), 20);

  for (const relativePath of notePaths) {
    const fileStat = await stat(resolve(config.vaultPath, relativePath));
    if (fileStat.size > MAX_SEARCH_FILE_BYTES) continue;

    const note = await readAllowedNote(config, relativePath, { maxBytes: MAX_SEARCH_FILE_BYTES });
    const title = titleFromNote(relativePath, note.content);
    const score = scoreNote(relativePath, title, note.content, terms, String(query || ""));
    if (!score) continue;

    results.push({
      id: relativePath,
      title,
      url: obsidianUri(vaultName, relativePath),
      metadata: {
        path: relativePath,
        modifiedAt: note.modifiedAt,
        score: score.score,
        excerpt: score.excerpt,
      },
    });
  }

  results.sort((a, b) => b.metadata.score - a.metadata.score || a.id.localeCompare(b.id));
  return { results: results.slice(0, limit) };
}

export async function fetchNote(id, options = {}) {
  const config = { ...getConfig(options), ...options };
  const note = await readAllowedNote(config, id);
  const vaultName = basename(config.vaultPath);
  return {
    id: note.relativePath,
    title: titleFromNote(note.relativePath, note.content),
    text: note.content,
    url: obsidianUri(vaultName, note.relativePath),
    metadata: {
      path: note.relativePath,
      modifiedAt: note.modifiedAt,
      size: note.size,
      truncated: note.truncated,
    },
  };
}

function sanitizeFilename(value, fallback = "raw-inbox-note") {
  const normalized = String(value || fallback)
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return normalized || fallback;
}

function assertNoObviousSecrets(text) {
  const patterns = [
    /sk-[A-Za-z0-9_-]{20,}/,
    /(?:api[_-]?key|token|secret|password)\s*[:=]\s*\S+/i,
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  ];
  if (patterns.some((pattern) => pattern.test(text))) {
    throw new Error("Refusing to write content that looks like a secret or credential.");
  }
}

export async function createRawInboxNote(input, options = {}) {
  const config = { ...getConfig(options), ...options };
  if (!config.enableWrites) {
    throw new Error("Write tools are disabled. Set OUTLET_OBSIDIAN_MCP_ENABLE_WRITES=true to expose Raw Inbox writes.");
  }

  const title = String(input.title || "").trim();
  const body = String(input.body || "").trim();
  if (!title) throw new Error("A title is required.");
  if (!body) throw new Error("A body is required.");
  if (Buffer.byteLength(body, "utf8") > MAX_WRITE_BYTES) {
    throw new Error(`Raw Inbox body exceeds ${MAX_WRITE_BYTES} bytes.`);
  }
  assertNoObviousSecrets(`${title}\n${body}`);

  const rawInboxDir = resolve(config.vaultPath, "50 Sources", "Raw Inbox");
  await mkdir(rawInboxDir, { recursive: true });
  await assertInsideVault(config.vaultPath, rawInboxDir);

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${stamp}-${sanitizeFilename(title)}.md`;
  const targetPath = resolve(rawInboxDir, filename);
  await assertInsideVault(config.vaultPath, rawInboxDir);

  const tags = Array.isArray(input.tags) ? input.tags.map((tag) => String(tag).trim()).filter(Boolean) : [];
  const note = [
    "---",
    "type: raw-inbox",
    "status: pending-ingestion",
    `source_type: ${String(input.sourceType || "chatgpt-mcp").replace(/[^a-z0-9_-]/gi, "-")}`,
    `created: ${new Date().toISOString()}`,
    "tags:",
    "  - raw-inbox",
    "  - chatgpt-mcp",
    ...tags.map((tag) => `  - ${tag.replace(/[^a-z0-9_-]/gi, "-")}`),
    "---",
    "",
    `# ${title}`,
    "",
    body,
    "",
  ].join("\n");

  await writeFile(targetPath, note, { flag: "wx" });
  const relativePath = normalizeSlashes(relative(config.vaultPath, targetPath));
  return {
    id: relativePath,
    title,
    text: `Created Raw Inbox note: ${relativePath}`,
    url: obsidianUri(basename(config.vaultPath), relativePath),
    metadata: { path: relativePath },
  };
}

export function createOutletMemoryMcpServer(options = {}) {
  const config = { ...getConfig(options), ...options };
  const server = new McpServer(
    {
      name: "outlet-media-memory",
      version: "0.1.0",
    },
    {
      instructions: [
        "Use this server to search and fetch Outlet Media Memory Obsidian notes.",
        "Default access is read-only and intentionally excludes Raw Inbox, .obsidian, .git, and archive paths.",
        "Prefer compiled doctrine, indexes, client pages, snapshots, logs, claims, and triples over raw source material.",
        "Do not request or store secrets, credentials, private keys, private client PII, or raw customer lists.",
      ].join("\n"),
    }
  );

  const searchOutputSchema = z.object({
    results: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        url: z.string(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    ),
  });
  const fetchOutputSchema = z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    url: z.string(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  });

  server.registerTool(
    "search",
    {
      title: "Search Outlet Media Memory",
      description:
        "Search the allowed Outlet Media Memory Obsidian notes. Returns note IDs for the fetch tool.",
      inputSchema: z.object({
        query: z.string().min(1).describe("Natural language or keyword query."),
        limit: z.number().int().min(1).max(20).optional().describe("Maximum results to return."),
      }),
      outputSchema: searchOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async ({ query, limit }) => makeJsonToolResult(await searchNotes(query, { ...config, limit }))
  );

  server.registerTool(
    "fetch",
    {
      title: "Fetch Outlet Media Memory Note",
      description:
        "Fetch the full text of one allowed Outlet Media Memory note by ID/path returned from search.",
      inputSchema: z.object({
        id: z.string().min(1).describe("Vault-relative note path or Obsidian URI."),
      }),
      outputSchema: fetchOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async ({ id }) => makeJsonToolResult(await fetchNote(id, config))
  );

  server.registerTool(
    "open_note_uri",
    {
      title: "Get Obsidian Note URI",
      description: "Return an obsidian:// URI for an allowed note. This does not open the local app.",
      inputSchema: z.object({
        id: z.string().min(1).describe("Vault-relative note path or Obsidian URI."),
      }),
      outputSchema: fetchOutputSchema.pick({ id: true, title: true, text: true, url: true, metadata: true }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async ({ id }) => {
      const note = await fetchNote(id, config);
      return makeJsonToolResult({
        id: note.id,
        title: note.title,
        text: note.url,
        url: note.url,
        metadata: note.metadata,
      });
    }
  );

  if (config.enableWrites) {
    server.registerTool(
      "create_raw_inbox_note",
      {
        title: "Create Raw Inbox Note",
        description:
          "Create a pending Raw Inbox note in Outlet Media Memory. Writes are disabled unless explicitly enabled by environment.",
        inputSchema: z.object({
          title: z.string().min(1).max(160),
          body: z.string().min(1).max(MAX_WRITE_BYTES),
          sourceType: z.string().min(1).max(80).optional(),
          tags: z.array(z.string().min(1).max(60)).max(8).optional(),
        }),
        outputSchema: fetchOutputSchema,
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: false,
        },
      },
      async (input) => makeJsonToolResult(await createRawInboxNote(input, config))
    );
  }

  return server;
}

async function readJsonBody(req, maxBytes = 2 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("Request body is too large.");
    chunks.push(chunk);
  }
  if (!chunks.length) return undefined;
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function createHttpMcpServer(options = {}) {
  const config = { ...getConfig(options), ...options };
  const mcpServer = createOutletMemoryMcpServer(config);
  const mcpPath = mcpPathForConfig(config);

  return createHttpServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://127.0.0.1");

      if (req.method === "GET" && requestUrl.pathname === "/health") {
        res.writeHead(200, { "content-type": "application/json" });
        const health = { ok: true, name: "outlet-media-memory", pathTokenRequired: Boolean(config.pathToken) };
        if (!config.pathToken) {
          health.mcpPath = mcpPath;
          health.vaultPath = config.vaultPath;
        }
        res.end(JSON.stringify(health));
        return;
      }

      if (req.method === "OPTIONS" && requestUrl.pathname === mcpPath) {
        res.writeHead(204, {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type, mcp-session-id",
        });
        res.end();
        return;
      }

      if (req.method !== "POST" || requestUrl.pathname !== mcpPath) {
        res.writeHead(404, { "content-type": "application/json" });
        const error = config.pathToken ? "Use the configured MCP path or GET /health." : `Use POST ${mcpPath} or GET /health.`;
        res.end(JSON.stringify({ ok: false, error }));
        return;
      }

      const parsedBody = await readJsonBody(req);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on("close", () => transport.close());
      await mcpServer.connect(transport);
      await transport.handleRequest(req, res, parsedBody);
    } catch (error) {
      if (!res.headersSent) {
        res.writeHead(500, { "content-type": "application/json" });
      }
      res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
    }
  });
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const config = getConfig();

  if (args.has("--stdio")) {
    const server = createOutletMemoryMcpServer(config);
    await server.connect(new StdioServerTransport());
    return;
  }

  if (args.has("--http") || args.size === 0) {
    const httpServer = createHttpMcpServer(config);
    httpServer.listen(config.port, "127.0.0.1", () => {
      process.stderr.write(`Outlet Media Memory MCP listening on http://127.0.0.1:${config.port}${mcpPathForConfig(config)}\n`);
    });
    return;
  }

  process.stderr.write("Usage: node tools/obsidian-memory-mcp/server.mjs [--http|--stdio]\n");
  process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
    process.exit(1);
  });
}
