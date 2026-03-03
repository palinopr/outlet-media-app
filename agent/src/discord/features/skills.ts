/**
 * discord-skills.ts -- Agent skill self-creation.
 *
 * After successful multi-step agent responses, check if a reusable
 * pattern or procedure was demonstrated. If so, create a skill file
 * in skills/<agent>/ for future reference.
 *
 * Skills differ from memory:
 * - Memory = facts, decisions, states (what happened)
 * - Skills = procedures, patterns, templates (how to do things)
 *
 * Fire-and-forget -- never blocks the main response flow.
 */

import { writeFile, readdir, stat, unlink } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { AGENT_INTERNALS, PROMPT_TO_AGENT } from "../core/router.js";
import { runClaude } from "../../runner.js";

/** Per-agent cooldown -- skill checks are expensive, limit frequency */
const lastSkillCheck = new Map<string, number>();
const SKILL_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SKILLS_PER_AGENT = 20;

const SKILL_EXTRACT_PROMPT = [
  "You are a skill extraction filter. Given a conversation between a user and an agent,",
  "determine if the agent demonstrated a REUSABLE PROCEDURE worth saving as a skill file.",
  "",
  "A skill is worth saving if:",
  "- The agent performed a multi-step workflow (3+ steps) that could be reused",
  "- A specific API call pattern with parameters was discovered and could be templated",
  "- A debugging or troubleshooting procedure was established",
  "- A data transformation or analysis workflow was demonstrated",
  "",
  "NOT worth saving as a skill:",
  "- Simple one-off queries or status checks",
  "- Information lookups without a reusable procedure",
  "- Conversations that are just Q&A",
  "- Things already covered in existing skills",
  "",
  "If nothing qualifies as a skill, respond with exactly: NO_SKILL",
  "",
  "If a skill should be created, respond with EXACTLY this format (nothing else):",
  "SKILL: kebab-case-filename",
  "# Skill Title",
  "",
  "(markdown content: steps, commands, parameters, examples)",
].join("\n");

async function safeReaddir(path: string): Promise<string[]> {
  try {
    const entries = await readdir(path);
    return entries.filter(f => f !== ".gitkeep");
  } catch (err) {
    console.error("[skills] failed to read skills directory:", err);
    return [];
  }
}

/**
 * Check if a conversation produced a reusable skill and persist it.
 * Called fire-and-forget after substantial agent responses.
 */
export async function maybeCreateSkill(
  promptFile: string,
  userMessage: string,
  agentResponse: string,
): Promise<void> {
  const agentKey = PROMPT_TO_AGENT[promptFile];
  if (!agentKey) return;

  const internals = AGENT_INTERNALS[agentKey];
  if (!internals) return;

  // Per-agent cooldown
  const now = Date.now();
  const last = lastSkillCheck.get(agentKey) ?? 0;
  if (now - last < SKILL_COOLDOWN_MS) return;
  lastSkillCheck.set(agentKey, now);

  // Only check substantial responses (likely multi-step work)
  if (agentResponse.length < 500) return;
  if (agentResponse.startsWith("Something went wrong")) return;

  // Cap skills per agent
  const skillsDir = join(process.cwd(), internals.skillsDir);
  if (!existsSync(skillsDir)) mkdirSync(skillsDir, { recursive: true });

  let existingSkills = await safeReaddir(skillsDir);

  // LRU eviction: when at capacity, remove the oldest skill file (by mtime)
  if (existingSkills.length >= MAX_SKILLS_PER_AGENT) {
    try {
      const withMtime = await Promise.all(
        existingSkills.map(async (f) => {
          const filePath = join(skillsDir, f);
          const s = await stat(filePath);
          return { file: f, mtime: s.mtimeMs };
        })
      );
      withMtime.sort((a, b) => a.mtime - b.mtime);
      const oldest = withMtime[0];
      await unlink(join(skillsDir, oldest.file));
      existingSkills = existingSkills.filter(f => f !== oldest.file);
    } catch (err) {
      console.error("[skills] LRU eviction failed:", err);
      return;
    }
  }

  const existingList = existingSkills.length > 0
    ? `Existing skills: ${existingSkills.join(", ")}`
    : "No existing skills yet.";

  const extractPrompt = [
    SKILL_EXTRACT_PROMPT,
    "",
    `--- EXISTING SKILLS (do not duplicate) ---`,
    existingList,
    `--- END EXISTING SKILLS ---`,
    "",
    `--- CONVERSATION ---`,
    `User: ${userMessage.slice(0, 500)}`,
    `Agent: ${agentResponse.slice(0, 2000)}`,
    `--- END CONVERSATION ---`,
  ].join("\n");

  try {
    const result = await runClaude({
      prompt: extractPrompt,
      systemPrompt: "You are a concise skill extraction filter. Follow the instructions exactly.",
      maxTurns: 1,
    });

    const text = result.text?.trim() ?? "";
    if (!text || text.includes("NO_SKILL")) return;

    // Parse: first line is "SKILL: name", rest is content
    const nameMatch = text.match(/^SKILL:\s*(.+)/m);
    if (!nameMatch) return;

    const skillName = nameMatch[1].trim().replace(/[^a-z0-9-]/g, "");
    if (!skillName || skillName.length < 3) return;

    // Everything after the SKILL: line is the file content
    const skillLineEnd = text.indexOf("\n", text.indexOf("SKILL:"));
    if (skillLineEnd === -1) return;
    const content = text.slice(skillLineEnd + 1).trim();
    if (content.length < 50) return;

    // Don't overwrite existing skills
    const skillPath = join(skillsDir, `${skillName}.md`);
    if (existsSync(skillPath)) return;

    // Write the skill file with metadata header
    const date = new Date().toISOString().slice(0, 10);
    const fileContent = `> Auto-created by ${internals.name} on ${date}\n\n${content}`;

    await writeFile(skillPath, fileContent, "utf-8");

    // Notify agent-feed
    const { notifyChannel } = await import("../core/entry.js");
    await notifyChannel(
      "agent-feed",
      `New skill for **${internals.name}**: \`${skillName}.md\``,
    );
  } catch (err) {
    console.error("[skills] skill creation failed:", err);
  }
}
