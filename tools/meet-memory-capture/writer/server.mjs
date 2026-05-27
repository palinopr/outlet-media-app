import { createServer } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const DEFAULT_PORT = 7766;
const DEFAULT_VAULT = "/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory";
const DEFAULT_CAPTURE_DIR = join(homedir(), "Documents", "Outlet Meet Captures");
const MAX_BODY_BYTES = 8 * 1024 * 1024;
const CHROME_EXTENSION_ORIGIN_RE = /^chrome-extension:\/\/[a-p]{32}$/;

export function sanitizeFilename(value, fallback = "meeting") {
  const normalized = String(value || fallback)
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return normalized || fallback;
}

export function formatOffset(ms = 0) {
  const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatTranscriptMarkdown(session) {
  const meeting = session.meeting || {};
  const notes = session.notes || {};
  const transcript = Array.isArray(session.transcript) ? session.transcript : [];

  return [
    `# ${meeting.title || "Google Meet"} Transcript`,
    "",
    `- Captured: ${new Date().toISOString()}`,
    `- Meeting URL: ${meeting.url || ""}`,
    `- Meet code: ${meeting.meetCode || ""}`,
    `- Started: ${meeting.startedAt || ""}`,
    `- Ended: ${meeting.endedAt || ""}`,
    `- Timezone: ${meeting.timezone || ""}`,
    `- Participants notified: ${session.consentConfirmed ? "yes" : "no"}`,
    "",
    "## Reviewed Notes",
    "",
    "### Summary",
    notes.summary || "_Not reviewed yet._",
    "",
    "### Decisions",
    notes.decisions || "_Not reviewed yet._",
    "",
    "### Action Items",
    notes.actions || "_Not reviewed yet._",
    "",
    "### Follow-up Agenda",
    notes.followUp || "_Not reviewed yet._",
    "",
    "## Transcript",
    "",
    ...transcript.map((entry) => {
      const speaker = entry.speaker || "Unknown";
      const text = String(entry.text || "").trim();
      return `- [${formatOffset(entry.offsetMs)}] **${speaker}:** ${text}`;
    }),
    "",
  ].join("\n");
}

export function buildMemoryNote(session, artifactPaths) {
  const meeting = session.meeting || {};
  const notes = session.notes || {};
  const transcript = Array.isArray(session.transcript) ? session.transcript : [];
  const title = meeting.title || "Google Meet";

  return [
    "---",
    "type: raw-inbox",
    "status: pending-ingestion",
    "source_type: meeting-caption-capture",
    `created: ${new Date().toISOString()}`,
    "tags:",
    "  - raw-inbox",
    "  - meeting-memory",
    "  - google-meet",
    "---",
    "",
    `# Meeting Memory Capture - ${title}`,
    "",
    "## Source",
    "",
    `- Meeting title: ${title}`,
    `- Meeting URL: ${meeting.url || ""}`,
    `- Meet code: ${meeting.meetCode || ""}`,
    `- Started: ${meeting.startedAt || ""}`,
    `- Ended: ${meeting.endedAt || ""}`,
    `- Timezone: ${meeting.timezone || ""}`,
    `- Participants notified: ${session.consentConfirmed ? "yes" : "no"}`,
    `- Caption lines captured: ${transcript.length}`,
    `- Raw transcript Markdown: ${artifactPaths.transcriptMarkdownPath}`,
    `- Raw transcript JSON: ${artifactPaths.transcriptJsonPath}`,
    "",
    "## Reviewed Summary",
    "",
    notes.summary || "_Pending review._",
    "",
    "## Decisions",
    "",
    notes.decisions || "_Pending review._",
    "",
    "## Action Items",
    "",
    notes.actions || "_Pending review._",
    "",
    "## Follow-up Agenda",
    "",
    notes.followUp || "_Pending review._",
    "",
    "## Ingestion Notes",
    "",
    "- Full transcript text is stored as a local artifact and intentionally not copied into durable memory by default.",
    "- Promote only durable decisions, actions, client/campaign facts, doctrine changes, or snapshots after review.",
    "",
  ].join("\n");
}

export function validateSession(session) {
  if (!session || typeof session !== "object") {
    throw new Error("Expected a JSON meeting session object.");
  }
  if (!session.consentConfirmed) {
    throw new Error("Participants-notified confirmation is required before writing meeting memory.");
  }
  if (!session.meeting || typeof session.meeting !== "object") {
    throw new Error("Missing meeting metadata.");
  }
  const transcript = Array.isArray(session.transcript) ? session.transcript : [];
  const notes = session.notes || {};
  const hasNotes = ["summary", "decisions", "actions", "followUp"].some((key) => String(notes[key] || "").trim());
  if (!transcript.length && !hasNotes) {
    throw new Error("Nothing to write: no transcript lines or reviewed notes.");
  }
}

export async function persistSession(session, options = {}) {
  validateSession(session);

  const vaultPath = resolve(options.vaultPath || process.env.OUTLET_MEMORY_VAULT || DEFAULT_VAULT);
  const captureDir = resolve(options.captureDir || process.env.OUTLET_MEET_CAPTURE_DIR || DEFAULT_CAPTURE_DIR);
  const rawInboxDir = join(vaultPath, "50 Sources", "Raw Inbox");
  const meeting = session.meeting || {};
  const titleSlug = sanitizeFilename(meeting.title || meeting.meetCode || "google-meet");
  const stamp = new Date(meeting.startedAt || Date.now())
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);
  const baseName = `${stamp}-${titleSlug}`;

  await mkdir(captureDir, { recursive: true });
  await mkdir(rawInboxDir, { recursive: true });

  const transcriptMarkdownPath = join(captureDir, `${baseName}.transcript.md`);
  const transcriptJsonPath = join(captureDir, `${baseName}.json`);
  const memoryNotePath = join(rawInboxDir, `${baseName}.meeting-memory.md`);

  await writeFile(transcriptMarkdownPath, formatTranscriptMarkdown(session), "utf8");
  await writeFile(transcriptJsonPath, `${JSON.stringify(session, null, 2)}\n`, "utf8");
  await writeFile(memoryNotePath, buildMemoryNote(session, {
    transcriptMarkdownPath,
    transcriptJsonPath,
  }), "utf8");

  return {
    transcriptMarkdownPath,
    transcriptJsonPath,
    memoryNotePath,
  };
}

function readJsonBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    const chunks = [];
    let size = 0;

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        rejectBody(new Error("Request body too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (_error) {
        rejectBody(new Error("Invalid JSON body."));
      }
    });

    request.on("error", rejectBody);
  });
}

function sendJson(response, status, body) {
  response.writeHead(status, jsonHeaders());
  response.end(`${JSON.stringify(body)}\n`);
}

function parseAllowedOrigins(options = {}) {
  const configured = options.allowedOrigins ?? process.env.OUTLET_MEET_CAPTURE_ALLOWED_ORIGINS ?? "";
  const values = Array.isArray(configured) ? configured : String(configured).split(",");
  return values.map((origin) => String(origin).trim()).filter(Boolean);
}

export function isAllowedWriterOrigin(origin, options = {}) {
  if (!origin) return true;

  const allowedOrigins = parseAllowedOrigins(options);
  if (allowedOrigins.length) {
    return allowedOrigins.includes(origin);
  }

  return CHROME_EXTENSION_ORIGIN_RE.test(origin);
}

function jsonHeaders(extra = {}) {
  return {
    "Content-Type": "application/json; charset=utf-8",
    ...extra,
  };
}

function sendCorsJson(request, response, status, body, options = {}) {
  const origin = request.headers.origin || "";
  const corsHeaders = origin && isAllowedWriterOrigin(origin, options)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin",
      }
    : {};

  response.writeHead(status, jsonHeaders(corsHeaders));
  response.end(`${JSON.stringify(body)}\n`);
}

function rejectBlockedOrigin(request, response, options = {}) {
  const origin = request.headers.origin || "";
  if (isAllowedWriterOrigin(origin, options)) return false;

  sendJson(response, 403, {
    ok: false,
    error: "Origin is not allowed to write meeting memory.",
  });
  return true;
}

export function createWriterServer(options = {}) {
  return createServer(async (request, response) => {
    if (rejectBlockedOrigin(request, response, options)) {
      return;
    }

    if (request.method === "OPTIONS") {
      sendCorsJson(request, response, 200, { ok: true }, options);
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      sendCorsJson(request, response, 200, {
        ok: true,
        service: "outlet-meet-memory-writer",
        vaultPath: resolve(options.vaultPath || process.env.OUTLET_MEMORY_VAULT || DEFAULT_VAULT),
        captureDir: resolve(options.captureDir || process.env.OUTLET_MEET_CAPTURE_DIR || DEFAULT_CAPTURE_DIR),
      }, options);
      return;
    }

    if (request.method === "POST" && request.url === "/captures") {
      try {
        const session = await readJsonBody(request);
        const paths = await persistSession(session, options);
        sendCorsJson(request, response, 200, { ok: true, ...paths }, options);
      } catch (error) {
        sendCorsJson(request, response, 400, { ok: false, error: error.message || String(error) }, options);
      }
      return;
    }

    sendCorsJson(request, response, 404, { ok: false, error: "Not found." }, options);
  });
}

function shouldStartServer() {
  const entryPath = process.argv[1] ? resolve(process.argv[1]) : "";
  return entryPath === fileURLToPath(import.meta.url);
}

if (shouldStartServer()) {
  const port = Number.parseInt(process.env.PORT || String(DEFAULT_PORT), 10);
  const server = createWriterServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`Outlet Meet Memory writer listening on http://127.0.0.1:${port}`);
  });
}
