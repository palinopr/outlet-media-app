/**
 * runner.ts — spawns the claude CLI as a subprocess.
 *
 * Passes the system prompt inline: claude -p "systemPrompt\n---\ntask"
 * Claude reads CLAUDE.md from the working directory automatically for extra context.
 */

import "dotenv/config";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const AGENT_DIR = join(__dirname, "..");
const PROMPTS_DIR = join(AGENT_DIR, "prompts");

const CLAUDE_PATH =
  process.env.CLAUDE_PATH ?? (() => { throw new Error("CLAUDE_PATH env var is required"); })();

/**
 * Track all spawned Claude child processes so we can kill them on shutdown.
 * Without this, pkill on the Node process leaves orphaned Claude processes
 * that continue running and produce ghost responses.
 */
import type { ChildProcess } from "node:child_process";
const activeProcs = new Set<ChildProcess>();

/** Kill all active Claude child processes. Call on SIGTERM/SIGINT. */
export function killAllClaude(): void {
  for (const proc of activeProcs) {
    try {
      proc.kill("SIGTERM");
    } catch {
      // Already dead -- ignore
    }
  }
  activeProcs.clear();
}

export interface RunnerOptions {
  prompt: string;
  /** Which prompts/*.txt file to use as system prompt. Default: "command" */
  systemPromptName?: string;
  /** Direct system prompt text. Takes precedence over systemPromptName. */
  systemPrompt?: string;
  /** Overrides the per-agent maxTurns lookup */
  maxTurns?: number;
  /** Called with each stdout chunk — use for live streaming to Supabase */
  onChunk?: (text: string) => void;
  /** Resume an existing session by ID (for multi-turn chat context) */
  resumeSessionId?: string;
}

export interface RunnerResult {
  text: string;
  success: boolean;
  error?: string;
  /** Session ID emitted by claude — pass back as resumeSessionId to continue the conversation */
  sessionId?: string;
}

function loadPrompt(name: string): string {
  const path = join(PROMPTS_DIR, `${name}.txt`);
  return readFileSync(path, "utf-8");
}

const SUBPROCESS_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export async function runClaude(opts: RunnerOptions): Promise<RunnerResult> {
  const {
    prompt,
    systemPromptName = "command",
    systemPrompt: directSystemPrompt,
    maxTurns = 20,
    onChunk,
    resumeSessionId,
  } = opts;

  // When resuming, the system prompt is already baked into the session
  let systemPrompt = "";
  if (!resumeSessionId) {
    if (directSystemPrompt) {
      // Caller provided the full system prompt text (e.g. with injected data)
      systemPrompt = directSystemPrompt;
    } else {
      try {
        systemPrompt = loadPrompt(systemPromptName);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[runner] Prompt file not found: prompts/${systemPromptName}.txt`);
        return {
          text: `Error: prompt file '${systemPromptName}.txt' not found.`,
          success: false,
          error: msg,
        };
      }
    }
  }

  console.log(
    `[runner] Spawning claude (${resumeSessionId ? `resume:${resumeSessionId.slice(0, 8)}` : systemPromptName}, max-turns=${maxTurns}): ${prompt.slice(0, 80)}`
  );

  return new Promise((resolve) => {
    const baseArgs = [
      "--output-format", "stream-json",
      "--verbose",
      "--max-turns", String(maxTurns),
      "--dangerously-skip-permissions",
      // Block global project memory — prevents context bleed from
      // ~/.claude/projects/ which references arjona-tour, insurance, etc.
      "--setting-sources", "local",
    ];

    const args = resumeSessionId
      ? ["--resume", resumeSessionId, "-p", prompt, ...baseArgs]
      : ["-p", prompt, "--system-prompt", systemPrompt, ...baseArgs];

    const proc = spawn(
      CLAUDE_PATH,
      args,
      {
        // Run from agent/ so Claude auto-reads agent/CLAUDE.md
        cwd: AGENT_DIR,
        env: { ...process.env, CLAUDECODE: undefined } as NodeJS.ProcessEnv,
        stdio: ["ignore", "pipe", "pipe"],
      }
    );

    activeProcs.add(proc);

    // Kill subprocess if it exceeds the timeout
    const timeoutHandle = setTimeout(() => {
      console.error(`[runner] Subprocess timed out after ${SUBPROCESS_TIMEOUT_MS / 1000}s -- killing`);
      try {
        proc.kill("SIGTERM");
      } catch {
        // Already dead
      }
      // Give SIGTERM 3s to take effect, then SIGKILL
      setTimeout(() => {
        try { proc.kill("SIGKILL"); } catch { /* already dead */ }
      }, 3000);
    }, SUBPROCESS_TIMEOUT_MS);

    let timedOut = false;

    let assembledText = "";  // built from assistant events
    let fallbackResult = ""; // from type=result event if no assistant text
    let capturedSessionId: string | undefined;
    let lineBuffer = "";
    let errorText = "";

    proc.stdout.on("data", (chunk: Buffer) => {
      lineBuffer += chunk.toString();
      const lines = lineBuffer.split("\n");
      // Last element is incomplete — keep in buffer
      lineBuffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const event = JSON.parse(trimmed) as Record<string, unknown>;

          // Capture session ID from init or result events
          if (typeof event.session_id === "string") {
            capturedSessionId = event.session_id;
          }

          if (event.type === "assistant") {
            // Extract text from content blocks and stream character by character
            const msg = event.message as Record<string, unknown> | undefined;
            const content = msg?.content as Array<Record<string, unknown>> | undefined;
            if (Array.isArray(content)) {
              for (const block of content) {
                if (block.type === "text" && typeof block.text === "string") {
                  assembledText += block.text;
                  onChunk?.(block.text);
                }
              }
            }
          } else if (event.type === "result") {
            // Final event — use result field as fallback if we got no assistant text
            const result = event.result as string | undefined;
            if (result) fallbackResult = result;
          }
        } catch {
          // Non-JSON line (unlikely with stream-json but possible) — ignore
        }
      }
    });

    proc.stderr.on("data", (chunk: Buffer) => {
      errorText += chunk.toString();
    });

    proc.on("close", (code, signal) => {
      clearTimeout(timeoutHandle);
      activeProcs.delete(proc);

      // Detect timeout: SIGTERM from our timeout handler
      if (signal === "SIGTERM" || signal === "SIGKILL") {
        timedOut = true;
      }

      // Flush any remaining buffer content
      if (lineBuffer.trim()) {
        try {
          const event = JSON.parse(lineBuffer.trim()) as Record<string, unknown>;
          if (event.type === "result" && typeof event.result === "string") {
            fallbackResult = event.result;
          }
        } catch { /* ignore */ }
      }

      const text = (assembledText.trim() || fallbackResult.trim() || "Done.").trim();

      if (timedOut) {
        console.error(`[runner] claude killed after ${SUBPROCESS_TIMEOUT_MS / 1000}s timeout`);
        resolve({
          text: text || "Subprocess timed out",
          success: false,
          error: `Subprocess timed out after ${SUBPROCESS_TIMEOUT_MS / 1000}s`,
          sessionId: capturedSessionId,
        });
      } else if (code === 0) {
        console.log(`[runner] Done (${text.length} chars, session=${capturedSessionId?.slice(0, 8) ?? "none"})`);
        resolve({ text, success: true, sessionId: capturedSessionId });
      } else {
        console.error(
          `[runner] claude exited ${code}: ${errorText.slice(0, 200)}`
        );
        resolve({
          text: text || errorText.slice(0, 200) || `Exit code ${code}`,
          success: false,
          error: errorText.slice(0, 200),
          sessionId: capturedSessionId,
        });
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timeoutHandle);
      activeProcs.delete(proc);
      console.error("[runner] Failed to spawn claude:", err.message);
      resolve({
        text: `Failed to start claude: ${err.message}`,
        success: false,
        error: err.message,
      });
    });
  });
}
