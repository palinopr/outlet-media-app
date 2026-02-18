import "dotenv/config";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { SYSTEM_PROMPT } from "./system-prompt.js";
import type { AgentRunOptions, AgentRunResult } from "./types.js";

const CLAUDE_PATH =
  process.env.CLAUDE_PATH ?? "/Users/jaimeortiz/.local/bin/claude";

/**
 * Run the agent with a given prompt.
 * Spawns the local claude CLI (your subscription - no Anthropic API key needed).
 * Streams results and calls onChunk for live Telegram updates.
 */
export async function runAgent(opts: AgentRunOptions): Promise<AgentRunResult> {
  const { prompt, onChunk } = opts;
  let fullText = "";

  try {
    const agentQuery = query({
      prompt,
      options: {
        // Use your local claude CLI instead of calling the API directly
        pathToClaudeCodeExecutable: CLAUDE_PATH,
        systemPrompt: SYSTEM_PROMPT,

        // Real Chrome browser via Playwright MCP - Claude uses it like a human
        mcpServers: {
          playwright: {
            command: "npx",
            args: ["@playwright/mcp@latest", "--headless"],
          },
        },

        // Run fully autonomously - no permission prompts mid-task
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,

        // Tools the agent can use
        allowedTools: [
          // Playwright browser (all tools from the MCP server)
          "mcp__playwright__*",
          // For saving data (curl to ingest) and reading the session cache
          "Bash",
          "Read",
          "Write",
        ],

        // Working directory - agent reads/writes session cache here
        cwd: new URL("../", import.meta.url).pathname,

        // TM One navigation takes many steps
        maxTurns: 50,
      },
    });

    for await (const message of agentQuery) {
      if (message.type === "assistant") {
        // Stream text chunks for live Telegram updates
        for (const block of message.message.content) {
          if (block.type === "text" && block.text) {
            fullText += block.text;
            onChunk?.(block.text);
          }
        }
      } else if (message.type === "result") {
        if (message.subtype === "success" && message.result) {
          // Use result field as final text if we didn't accumulate any
          if (!fullText.trim()) fullText = message.result;
        } else if (message.subtype === "error") {
          return {
            text: fullText || "Agent encountered an error.",
            success: false,
            error: "execution_error",
          };
        }
      }
    }

    return { text: fullText.trim() || "Done.", success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[agent] Error:", msg);
    return { text: `Agent error: ${msg}`, success: false, error: msg };
  }
}
