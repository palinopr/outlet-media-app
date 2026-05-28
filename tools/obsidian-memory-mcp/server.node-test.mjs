import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import {
  createHttpMcpServer,
  createOutletMemoryMcpServer,
  createRawInboxNote,
  fetchNote,
  searchNotes,
} from "./server.mjs";

async function withVault(callback) {
  const root = await mkdtemp(join(tmpdir(), "outlet-memory-mcp-"));
  const vaultPath = join(root, "Outlet Media Memory");

  try {
    await mkdir(join(vaultPath, "10 Doctrine"), { recursive: true });
    await mkdir(join(vaultPath, "50 Sources", "Raw Inbox"), { recursive: true });
    await mkdir(join(vaultPath, ".obsidian"), { recursive: true });

    await writeFile(
      join(vaultPath, "00 Start Here.md"),
      "# 00 Start Here\n\nThis is Outlet Media Memory.\n"
    );
    await writeFile(
      join(vaultPath, "10 Doctrine", "Agent Memory Protocol.md"),
      "# Agent Memory Protocol\n\nAgents search compiled memory before raw sources.\n"
    );
    await writeFile(
      join(vaultPath, "50 Sources", "Raw Inbox", "private.md"),
      "# Private Draft\n\nDo not expose this pending raw inbox note.\n"
    );
    await writeFile(join(vaultPath, ".obsidian", "workspace.json"), "{}");

    return await callback(vaultPath);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("search returns allowed note IDs and Obsidian URIs", async () => {
  await withVault(async (vaultPath) => {
    const result = await searchNotes("compiled memory", { vaultPath });

    assert.equal(result.results.length, 1);
    assert.equal(result.results[0].id, "10 Doctrine/Agent Memory Protocol.md");
    assert.match(result.results[0].url, /^obsidian:\/\/open\?/);
    assert.match(result.results[0].metadata.excerpt, /compiled memory/);
  });
});

test("search excludes Raw Inbox and .obsidian paths by default", async () => {
  await withVault(async (vaultPath) => {
    const rawInboxResult = await searchNotes("pending raw inbox", { vaultPath });
    const obsidianResult = await searchNotes("workspace", { vaultPath });

    assert.deepEqual(rawInboxResult.results, []);
    assert.deepEqual(obsidianResult.results, []);
  });
});

test("fetch returns full note text for allowed paths", async () => {
  await withVault(async (vaultPath) => {
    const result = await fetchNote("10 Doctrine/Agent Memory Protocol.md", { vaultPath });

    assert.equal(result.id, "10 Doctrine/Agent Memory Protocol.md");
    assert.equal(result.title, "Agent Memory Protocol");
    assert.match(result.text, /compiled memory/);
    assert.equal(result.metadata.truncated, false);
  });
});

test("fetch rejects traversal and excluded paths", async () => {
  await withVault(async (vaultPath) => {
    await assert.rejects(() => fetchNote("../outside.md", { vaultPath }), /vault-relative/);
    await assert.rejects(
      () => fetchNote("50 Sources/Raw Inbox/private.md", { vaultPath }),
      /not exposed/
    );
  });
});

test("Raw Inbox write tool is disabled by default", async () => {
  await withVault(async (vaultPath) => {
    await assert.rejects(
      () => createRawInboxNote({ title: "Draft", body: "A safe pending note." }, { vaultPath }),
      /Write tools are disabled/
    );
  });
});

test("Raw Inbox write tool writes only when explicitly enabled", async () => {
  await withVault(async (vaultPath) => {
    const result = await createRawInboxNote(
      { title: "Follow Up", body: "Review durable lesson before ingestion.", tags: ["test"] },
      { vaultPath, enableWrites: true }
    );
    const note = await readFile(join(vaultPath, result.metadata.path), "utf8");

    assert.match(result.id, /^50 Sources\/Raw Inbox\//);
    assert.match(note, /status: pending-ingestion/);
    assert.match(note, /Review durable lesson/);
  });
});

test("server registers safe read tools by default", () => {
  const server = createOutletMemoryMcpServer({ vaultPath: "/tmp/example-vault" });
  const toolNames = Object.keys(server._registeredTools || {});

  assert.deepEqual(toolNames.sort(), ["fetch", "open_note_uri", "search"]);
});

test("HTTP server exposes a health check", async () => {
  await withVault(async (vaultPath) => {
    const server = createHttpMcpServer({ vaultPath });

    await new Promise((resolve, reject) => {
      server.listen(0, "127.0.0.1", async () => {
        try {
          const address = server.address();
          const response = await fetch(`http://127.0.0.1:${address.port}/health`);
          const json = await response.json();
          assert.equal(response.status, 200);
          assert.equal(json.ok, true);
          assert.equal(json.vaultPath, vaultPath);
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          server.close();
        }
      });
    });
  });
});

test("HTTP MCP endpoint supports listTools and callTool", async () => {
  await withVault(async (vaultPath) => {
    const server = createHttpMcpServer({ vaultPath });

    await new Promise((resolve, reject) => {
      server.listen(0, "127.0.0.1", async () => {
        const address = server.address();
        const client = new Client({ name: "outlet-memory-mcp-test", version: "0.0.0" });
        const transport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${address.port}/mcp`));

        try {
          await client.connect(transport);
          const tools = await client.listTools();
          assert.deepEqual(
            tools.tools.map((tool) => tool.name).sort(),
            ["fetch", "open_note_uri", "search"]
          );

          const result = await client.callTool({
            name: "search",
            arguments: { query: "compiled memory", limit: 3 },
          });
          assert.equal(result.structuredContent.results[0].id, "10 Doctrine/Agent Memory Protocol.md");
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          await client.close().catch(() => {});
          server.close();
        }
      });
    });
  });
});

test("HTTP MCP endpoint can require an unguessable path token", async () => {
  await withVault(async (vaultPath) => {
    const pathToken = "test_token_1234567890";
    const server = createHttpMcpServer({ vaultPath, pathToken });

    await new Promise((resolve, reject) => {
      server.listen(0, "127.0.0.1", async () => {
        const address = server.address();
        const client = new Client({ name: "outlet-memory-mcp-token-test", version: "0.0.0" });
        const transport = new StreamableHTTPClientTransport(
          new URL(`http://127.0.0.1:${address.port}/mcp/${pathToken}`)
        );

        try {
          const health = await fetch(`http://127.0.0.1:${address.port}/health`).then((response) =>
            response.json()
          );
          assert.equal(health.pathTokenRequired, true);
          assert.equal("mcpPath" in health, false);
          assert.equal("vaultPath" in health, false);

          const wrongPathResponse = await fetch(`http://127.0.0.1:${address.port}/mcp`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
          });
          assert.equal(wrongPathResponse.status, 404);
          const wrongPathJson = await wrongPathResponse.json();
          assert.doesNotMatch(wrongPathJson.error, new RegExp(pathToken));

          await client.connect(transport);
          const tools = await client.listTools();
          assert.deepEqual(
            tools.tools.map((tool) => tool.name).sort(),
            ["fetch", "open_note_uri", "search"]
          );
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          await client.close().catch(() => {});
          server.close();
        }
      });
    });
  });
});
