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
  process.env.CLAUDE_PATH ?? "/Users/jaimeortiz/.local/bin/claude";

// Turns per job type — TM One needs many browser steps, chat needs few
const MAX_TURNS: Record<string, number> = {
  "assistant":        5,
  "meta-ads":         20,
  "campaign-monitor": 15,
  "tm-monitor":       50,
  "think":            15,
};

export interface RunnerOptions {
  prompt: string;
  /** Which prompts/*.txt file to use as system prompt. Default: "command" */
  systemPromptName?: string;
  /** Overrides the per-agent maxTurns lookup */
  maxTurns?: number;
  /** Called with each stdout chunk — use for live streaming to Supabase */
  onChunk?: (text: string) => void;
}

export interface RunnerResult {
  text: string;
  success: boolean;
  error?: string;
}

function loadPrompt(name: string): string {
  const path = join(PROMPTS_DIR, `${name}.txt`);
  return readFileSync(path, "utf-8");
}

export function turnsForAgent(agentId: string): number {
  return MAX_TURNS[agentId] ?? 20;
}

export async function runClaude(opts: RunnerOptions): Promise<RunnerResult> {
  const {
    prompt,
    systemPromptName = "command",
    maxTurns = 20,
    onChunk,
  } = opts;

  let systemPrompt: string;
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

  // Prepend system prompt to task — same pattern as the Arjona agent
  const fullPrompt = `${systemPrompt}\n\n---\n\nCurrent task:\n${prompt}`;

  console.log(
    `[runner] Spawning claude (${systemPromptName}, max-turns=${maxTurns}): ${prompt.slice(0, 80)}`
  );

  return new Promise((resolve) => {
    const proc = spawn(
      CLAUDE_PATH,
      [
        "-p", fullPrompt,
        "--output-format", "stream-json",
        "--verbose",
        "--max-turns", String(maxTurns),
        "--dangerously-skip-permissions",
      ],
      {
        // Run from agent/ so Claude auto-reads CLAUDE.md and MEMORY.md
        cwd: AGENT_DIR,
        env: { ...process.env, CLAUDECODE: undefined } as NodeJS.ProcessEnv,
        // stdin: ignore — claude -p doesn't need interactive input
        stdio: ["ignore", "pipe", "pipe"],
      }
    );

    let assembledText = "";  // built from assistant events
    let fallbackResult = ""; // from type=result event if no assistant text
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

    proc.on("close", (code) => {
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

      if (code === 0) {
        console.log(`[runner] Done (${text.length} chars)`);
        resolve({ text, success: true });
      } else {
        console.error(
          `[runner] claude exited ${code}: ${errorText.slice(0, 200)}`
        );
        resolve({
          text: text || errorText.slice(0, 200) || `Exit code ${code}`,
          success: false,
          error: errorText.slice(0, 200),
        });
      }
    });

    proc.on("error", (err) => {
      console.error("[runner] Failed to spawn claude:", err.message);
      resolve({
        text: `Failed to start claude: ${err.message}`,
        success: false,
        error: err.message,
      });
    });
  });
}
