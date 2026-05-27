import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMemoryNote,
  createWriterServer,
  formatOffset,
  isAllowedWriterOrigin,
  persistSession,
  sanitizeFilename,
} from "./server.mjs";

function sampleSession(overrides = {}) {
  return {
    schemaVersion: 1,
    consentConfirmed: true,
    meeting: {
      title: "Client Sync / Agenda",
      url: "https://meet.google.com/abc-defg-hij",
      meetCode: "abc-defg-hij",
      startedAt: "2026-05-26T15:00:00.000Z",
      endedAt: "2026-05-26T15:30:00.000Z",
      timezone: "America/Chicago",
    },
    notes: {
      summary: "Reviewed campaign status.",
      decisions: "- Keep budget steady.",
      actions: "- [ ] Jaime - send follow-up",
      followUp: "- Check attribution tomorrow.",
    },
    transcript: [
      {
        speaker: "Jaime",
        text: "Let's review what changed today.",
        capturedAt: "2026-05-26T15:01:00.000Z",
        offsetMs: 60000,
      },
    ],
    ...overrides,
  };
}

test("sanitizeFilename removes path and punctuation risk", () => {
  assert.equal(sanitizeFilename("../Client Sync: Agenda?*"), "..Client-Sync-Agenda");
});

test("formatOffset handles minutes and hours", () => {
  assert.equal(formatOffset(61000), "01:01");
  assert.equal(formatOffset(3661000), "01:01:01");
});

test("buildMemoryNote links artifacts without embedding transcript body", () => {
  const note = buildMemoryNote(sampleSession(), {
    transcriptMarkdownPath: "/tmp/full.md",
    transcriptJsonPath: "/tmp/full.json",
  });

  assert.match(note, /Raw transcript Markdown: \/tmp\/full.md/);
  assert.match(note, /Reviewed campaign status/);
  assert.doesNotMatch(note, /Let's review what changed today/);
});

test("persistSession writes transcript artifacts and Raw Inbox note", async () => {
  const root = await mkdtemp(join(tmpdir(), "meet-memory-"));
  const vaultPath = join(root, "vault");
  const captureDir = join(root, "captures");

  try {
    const paths = await persistSession(sampleSession(), { vaultPath, captureDir });
    const memoryNote = await readFile(paths.memoryNotePath, "utf8");
    const transcript = await readFile(paths.transcriptMarkdownPath, "utf8");

    assert.match(memoryNote, /Meeting Memory Capture - Client Sync \/ Agenda/);
    assert.match(memoryNote, /Raw transcript Markdown:/);
    assert.match(transcript, /Jaime/);
    assert.match(transcript, /Let's review what changed today/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("persistSession requires consent confirmation", async () => {
  await assert.rejects(
    () => persistSession(sampleSession({ consentConfirmed: false })),
    /Participants-notified confirmation/
  );
});

function withServer(options, callback) {
  const server = createWriterServer(options);

  return new Promise((resolveTest, rejectTest) => {
    server.listen(0, "127.0.0.1", async () => {
      const address = server.address();
      const baseUrl = `http://127.0.0.1:${address.port}`;

      try {
        resolveTest(await callback(baseUrl));
      } catch (error) {
        rejectTest(error);
      } finally {
        server.close();
      }
    });
  });
}

test("isAllowedWriterOrigin defaults to Chrome extension origins only", () => {
  assert.equal(isAllowedWriterOrigin(""), true);
  assert.equal(isAllowedWriterOrigin("chrome-extension://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), true);
  assert.equal(isAllowedWriterOrigin("https://example.com"), false);
  assert.equal(isAllowedWriterOrigin("chrome-extension://bad"), false);
});

test("writer rejects capture posts from normal webpages", async () => {
  const root = await mkdtemp(join(tmpdir(), "meet-memory-server-"));

  try {
    await withServer({ vaultPath: join(root, "vault"), captureDir: join(root, "captures") }, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/captures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://example.com",
        },
        body: JSON.stringify(sampleSession()),
      });

      assert.equal(response.status, 403);
      assert.deepEqual(await response.json(), {
        ok: false,
        error: "Origin is not allowed to write meeting memory.",
      });
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("writer allows capture posts from configured extension origin", async () => {
  const root = await mkdtemp(join(tmpdir(), "meet-memory-server-"));
  const extensionOrigin = "chrome-extension://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

  try {
    await withServer({
      vaultPath: join(root, "vault"),
      captureDir: join(root, "captures"),
      allowedOrigins: [extensionOrigin],
    }, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/captures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": extensionOrigin,
        },
        body: JSON.stringify(sampleSession()),
      });

      const payload = await response.json();
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("access-control-allow-origin"), extensionOrigin);
      assert.equal(payload.ok, true);
      assert.match(payload.memoryNotePath, /meeting-memory\.md$/);
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
