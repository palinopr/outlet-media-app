/**
 * discord-memory.ts -- Agent memory self-update.
 *
 * After every agent conversation, check if the response contains
 * learnings worth persisting. If the agent used a tool, discovered
 * a pattern, resolved an error, or made a decision, append it to
 * that agent's memory/*.md file.
 *
 * Uses a lightweight Claude call to extract the memory-worthy bits.
 * Fire-and-forget -- never blocks the main response flow.
 */

import { readFile, writeFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { AGENT_INTERNALS } from "./discord-router.js";
import { runClaude } from "./runner.js";

/** Map promptFile names to AGENT_INTERNALS keys */
const PROMPT_TO_AGENT: Record<string, string> = {
  "boss": "boss",
  "media-buyer": "media-buyer",
  "tm-agent": "tm-agent",
  "creative-agent": "creative",
  "client-manager": "client-manager",
  "reporting-agent": "reporting",
};

const EXTRACT_PROMPT = [
  "You are a memory extraction filter. Given a conversation between a user and an agent,",
  "extract ONLY facts worth remembering for future sessions. Output ONLY bullet points.",
  "",
  "Worth remembering:",
  "- New API patterns, endpoints, or parameter discoveries",
  "- Client preferences, budget changes, campaign decisions",
  "- Error resolutions (what failed and what fixed it)",
  "- Business rules or constraints learned",
  "- Credential updates or configuration changes",
  "",
  "NOT worth remembering:",
  "- Greetings, small talk, status checks",
  "- Information already in the agent's memory file",
  "- Temporary states (agent is busy, retry later)",
  "- Raw data dumps (campaign JSON, event lists)",
  "",
  "If nothing is worth remembering, respond with exactly: NOTHING_NEW",
  "Otherwise, respond with bullet points starting with '- ' (one per line).",
  "Keep each bullet under 100 characters. Max 5 bullets.",
].join("\n");

/**
 * Check if a conversation produced memory-worthy content and persist it.
 * Called fire-and-forget after every agent response.
 */
export async function maybeUpdateMemory(
  promptFile: string,
  userMessage: string,
  agentResponse: string,
): Promise<void> {
  const agentKey = PROMPT_TO_AGENT[promptFile];
  if (!agentKey) return; // no memory file for this agent (e.g. chat.txt)

  const internals = AGENT_INTERNALS[agentKey];
  if (!internals) return;

  // Skip short or error responses
  if (agentResponse.length < 100) return;
  if (agentResponse.startsWith("Something went wrong")) return;
  if (agentResponse.startsWith("Agent is busy")) return;

  const extractPrompt = [
    EXTRACT_PROMPT,
    "",
    "--- EXISTING MEMORY (do not duplicate) ---",
    await loadExistingMemory(internals.memoryFile),
    "--- END EXISTING MEMORY ---",
    "",
    `--- CONVERSATION ---`,
    `User: ${userMessage.slice(0, 500)}`,
    `Agent: ${agentResponse.slice(0, 1500)}`,
    `--- END CONVERSATION ---`,
  ].join("\n");

  try {
    const result = await runClaude({
      prompt: extractPrompt,
      systemPromptName: "chat",
      maxTurns: 1,
    });

    const text = result.text?.trim() ?? "";
    if (!text || text === "NOTHING_NEW" || text.includes("NOTHING_NEW")) return;

    // Extract only bullet lines
    const bullets = text
      .split("\n")
      .filter(l => l.trim().startsWith("- "))
      .map(l => l.trim())
      .slice(0, 5);

    if (bullets.length === 0) return;

    const timestamp = new Date().toISOString().slice(0, 10);
    const block = `\n\n<!-- auto-learned ${timestamp} -->\n${bullets.join("\n")}`;

    await appendFile(internals.memoryFile, block);

    // Lazy import to avoid circular dependency
    const { notifyChannel } = await import("./discord.js");
    await notifyChannel(
      "agent-feed",
      `Memory updated for **${internals.name}**: ${bullets.length} new item(s)`,
    );
  } catch {
    // Memory update is best-effort -- never fail the main flow
  }
}

async function loadExistingMemory(path: string): Promise<string> {
  try {
    if (!existsSync(path)) return "(empty)";
    const content = await readFile(path, "utf-8");
    // Return last 2000 chars to keep context reasonable
    return content.slice(-2000);
  } catch {
    return "(could not read)";
  }
}
