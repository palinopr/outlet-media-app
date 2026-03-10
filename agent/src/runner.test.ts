import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:stream";

// ---------------------------------------------------------------------------
// Mock child_process.spawn to return a controllable fake process
// ---------------------------------------------------------------------------

const spawnMock = vi.fn<(...args: unknown[]) => ChildProcess>();

vi.mock("node:child_process", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:child_process")>();
  return { ...actual, default: { ...actual, spawn: spawnMock }, spawn: spawnMock };
});

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  const readFileSync = vi.fn((path: string, _encoding?: string) => {
    if (typeof path === "string" && path.includes("command.txt")) return "You are a command agent.";
    if (typeof path === "string" && path.includes("think.txt")) return "You are the think loop.";
    throw Object.assign(new Error(`ENOENT: no such file: ${path}`), { code: "ENOENT" });
  });
  return { ...actual, default: { ...actual, readFileSync }, readFileSync };
});

// Mock fileURLToPath so import.meta.url (which may not be file://) resolves safely
vi.mock("node:url", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:url")>();
  const fileURLToPath = (url: string | URL) => {
    const str = typeof url === "string" ? url : url.href;
    if (str.startsWith("file://")) return actual.fileURLToPath(url);
    // Return a stable fake path for non-file:// URLs
    return "/mock/agent/src";
  };
  return { ...actual, default: { ...actual, fileURLToPath }, fileURLToPath };
});

// Stub dotenv so it doesn't try to read .env
vi.mock("dotenv/config", () => ({ default: {} } as never));

// Provide CLAUDE_PATH in env before importing
process.env.CLAUDE_PATH = "/usr/local/bin/claude";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFakeProc(): ChildProcess {
  const proc = new EventEmitter() as ChildProcess;
  // Use plain EventEmitters as stdout/stderr so data events fire synchronously
  proc.stdout = new EventEmitter() as ChildProcess["stdout"];
  proc.stderr = new EventEmitter() as ChildProcess["stderr"];
  proc.kill = vi.fn(() => true);
  Object.defineProperty(proc, "pid", { value: 12345 });
  return proc;
}

function emitStreamJson(proc: ChildProcess, event: Record<string, unknown>) {
  proc.stdout!.emit("data", Buffer.from(`${JSON.stringify(event)}\n`));
}

function emitStderr(proc: ChildProcess, text: string) {
  proc.stderr!.emit("data", Buffer.from(text));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("runner", () => {
  let runClaude: typeof import("./runner.js").runClaude;
  let killAllClaude: typeof import("./runner.js").killAllClaude;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.CLAUDE_PATH = "/usr/local/bin/claude";
    const mod = await import("./runner.js");
    runClaude = mod.runClaude;
    killAllClaude = mod.killAllClaude;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns error when prompt file is missing", async () => {
    const result = await runClaude({
      prompt: "do something",
      systemPromptName: "nonexistent",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("ENOENT");
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it("spawns claude with correct args for a new session", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);

    const promise = runClaude({ prompt: "sync meta", maxTurns: 10 });

    expect(spawnMock).toHaveBeenCalledOnce();
    const args = spawnMock.mock.calls[0][1] as string[];
    expect(args).toContain("-p");
    expect(args).toContain("sync meta");
    expect(args).toContain("--system-prompt");
    expect(args).toContain("--max-turns");
    expect(args).toContain("10");
    expect(args).toContain("--dangerously-skip-permissions");

    emitStreamJson(proc, { type: "assistant", message: { content: [{ type: "text", text: "Done syncing." }] } });
    emitStreamJson(proc, { type: "result", result: "Done syncing.", session_id: "sess_abc" });
    proc.emit("close", 0, null);

    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.text).toBe("Done syncing.");
    expect(result.sessionId).toBe("sess_abc");
  });

  it("uses --resume flag when resumeSessionId is provided", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);

    const promise = runClaude({ prompt: "continue", resumeSessionId: "sess_existing" });

    const args = spawnMock.mock.calls[0][1] as string[];
    expect(args).toContain("--resume");
    expect(args).toContain("sess_existing");
    expect(args).not.toContain("--system-prompt");

    emitStreamJson(proc, { type: "result", result: "Resumed.", session_id: "sess_existing" });
    proc.emit("close", 0, null);

    const result = await promise;
    expect(result.success).toBe(true);
  });

  it("uses direct system prompt when provided", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);

    const promise = runClaude({
      prompt: "task",
      systemPrompt: "Custom system prompt text",
    });

    const args = spawnMock.mock.calls[0][1] as string[];
    expect(args).toContain("--system-prompt");
    expect(args).toContain("Custom system prompt text");

    proc.emit("close", 0, null);

    const result = await promise;
    expect(result.success).toBe(true);
  });

  it("calls onChunk for each text block", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);
    const chunks: string[] = [];

    const promise = runClaude({
      prompt: "stream test",
      onChunk: (text) => chunks.push(text),
    });

    emitStreamJson(proc, { type: "assistant", message: { content: [{ type: "text", text: "chunk1" }] } });
    emitStreamJson(proc, { type: "assistant", message: { content: [{ type: "text", text: "chunk2" }] } });
    proc.emit("close", 0, null);

    await promise;
    expect(chunks).toEqual(["chunk1", "chunk2"]);
  });

  it("returns success=false on non-zero exit code", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);

    const promise = runClaude({ prompt: "fail" });

    emitStderr(proc, "Something went wrong");
    proc.emit("close", 1, null);

    const result = await promise;
    expect(result.success).toBe(false);
    expect(result.error).toContain("Something went wrong");
  });

  it("returns success=false on spawn error", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);

    const promise = runClaude({ prompt: "nope" });

    proc.emit("error", new Error("spawn ENOENT"));

    const result = await promise;
    expect(result.success).toBe(false);
    expect(result.error).toBe("spawn ENOENT");
    expect(result.text).toContain("Failed to start claude");
  });

  it("captures error events from stream-json", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);

    const promise = runClaude({ prompt: "error test" });

    emitStreamJson(proc, { type: "error", error: { message: "rate limited" } });
    proc.emit("close", 0, null);

    const result = await promise;
    expect(result.text).toContain("rate limited");
  });

  it("uses fallbackResult when no assistant text is assembled", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);

    const promise = runClaude({ prompt: "fallback test" });

    emitStreamJson(proc, { type: "result", result: "Fallback text here." });
    proc.emit("close", 0, null);

    const result = await promise;
    expect(result.text).toBe("Fallback text here.");
  });

  it("killAllClaude sends SIGTERM to all tracked processes", async () => {
    const proc = makeFakeProc();
    spawnMock.mockReturnValue(proc);

    const promise = runClaude({ prompt: "will be killed" });

    killAllClaude();
    expect(proc.kill).toHaveBeenCalledWith("SIGTERM");

    // Clean up: let the process close
    proc.emit("close", null, "SIGTERM");
    await promise;
  });
});
