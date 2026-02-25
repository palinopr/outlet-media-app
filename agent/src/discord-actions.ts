/**
 * discord-actions.ts -- Action dispatch for conversational Discord management.
 *
 * Claude outputs action blocks in its response text. This module parses them
 * and executes the corresponding Discord API calls.
 *
 * Format: [ACTION:command key="value" key2="value2"]
 *
 * Supported actions:
 *   create_channel   name="x" category="y" topic="z"
 *   archive_channel  name="x"
 *   rename_channel   from="x" to="y"
 *   move_channel     name="x" category="y"
 *   create_category  name="x"
 *   delete_category  name="x"  (only if empty)
 *   create_role      name="x" color="hex"
 *   rename_category  from="x" to="y"
 *   restructure      (no params -- runs full server restructure)
 *   restart          (restarts the bot process)
 */

import {
  type Guild,
  type TextChannel,
  type CategoryChannel,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ParsedAction {
  command: string;
  params: Record<string, string>;
}

interface ActionResult {
  action: string;
  success: boolean;
  message: string;
}

// ─── Parser ─────────────────────────────────────────────────────────────────

/**
 * Extract action blocks from Claude's response text.
 * Format: [ACTION:command key="value" key2="value2"]
 */
export function parseActions(text: string): ParsedAction[] {
  const actions: ParsedAction[] = [];
  const pattern = /\[ACTION:(\w+)((?:\s+\w+="[^"]*")*)\]/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const command = match[1];
    const paramStr = match[2].trim();
    const params: Record<string, string> = {};

    const paramPattern = /(\w+)="([^"]*)"/g;
    let pm: RegExpExecArray | null;
    while ((pm = paramPattern.exec(paramStr)) !== null) {
      params[pm[1]] = pm[2];
    }

    actions.push({ command, params });
  }

  return actions;
}

/**
 * Strip action blocks from text so users see clean messages.
 */
export function stripActions(text: string): string {
  return text.replace(/\[ACTION:\w+(?:\s+\w+="[^"]*")*\]/g, "").trim();
}

// ─── Executor ───────────────────────────────────────────────────────────────

/**
 * Execute a list of parsed actions against the Discord guild.
 * Returns results for each action.
 */
export async function executeActions(
  actions: ParsedAction[],
  guild: Guild,
): Promise<ActionResult[]> {
  const results: ActionResult[] = [];

  for (const action of actions) {
    try {
      const result = await executeSingle(action, guild);
      results.push(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ action: action.command, success: false, message: msg });
    }
  }

  return results;
}

async function executeSingle(
  action: ParsedAction,
  g: Guild,
): Promise<ActionResult> {
  const { command, params } = action;

  switch (command) {
    case "create_channel": {
      const { name, category, topic } = params;
      if (!name) return fail(command, "Missing name parameter");

      // Check if channel already exists
      if (g.channels.cache.find(c => c.name === name)) {
        return ok(command, `#${name} already exists`);
      }

      let parentId: string | undefined;
      if (category) {
        const cat = g.channels.cache.find(
          c => c.name === category && c.type === ChannelType.GuildCategory
        );
        parentId = cat?.id;
      }

      await g.channels.create({
        name,
        type: ChannelType.GuildText,
        parent: parentId,
        topic,
      });
      return ok(command, `Created #${name}${category ? ` in ${category}` : ""}`);
    }

    case "archive_channel": {
      const { name } = params;
      if (!name) return fail(command, "Missing name parameter");

      const ch = g.channels.cache.find(
        c => c.name === name && c.type === ChannelType.GuildText
      );
      if (!ch) return fail(command, `#${name} not found`);

      // Find or create Archive category
      let archiveCat = g.channels.cache.find(
        c => c.name === "Archive" && c.type === ChannelType.GuildCategory
      ) as CategoryChannel | undefined;
      if (!archiveCat) {
        archiveCat = (await g.channels.create({
          name: "Archive",
          type: ChannelType.GuildCategory,
        })) as CategoryChannel;
      }

      await (ch as TextChannel).setParent(archiveCat.id);
      await (ch as TextChannel).permissionOverwrites.create(g.roles.everyone, {
        SendMessages: false,
      });
      return ok(command, `Archived #${name}`);
    }

    case "rename_channel": {
      const { from, to } = params;
      if (!from || !to) return fail(command, "Missing from/to parameters");

      const ch = g.channels.cache.find(
        c => c.name === from && c.type === ChannelType.GuildText
      );
      if (!ch) return fail(command, `#${from} not found`);

      await (ch as TextChannel).setName(to);
      return ok(command, `Renamed #${from} -> #${to}`);
    }

    case "move_channel": {
      const { name, category } = params;
      if (!name || !category) return fail(command, "Missing name/category parameters");

      const ch = g.channels.cache.find(
        c => c.name === name && c.type === ChannelType.GuildText
      );
      if (!ch) return fail(command, `#${name} not found`);

      const cat = g.channels.cache.find(
        c => c.name === category && c.type === ChannelType.GuildCategory
      );
      if (!cat) return fail(command, `Category "${category}" not found`);

      await (ch as TextChannel).setParent(cat.id);
      return ok(command, `Moved #${name} to ${category}`);
    }

    case "create_category": {
      const { name } = params;
      if (!name) return fail(command, "Missing name parameter");

      if (g.channels.cache.find(c => c.name === name && c.type === ChannelType.GuildCategory)) {
        return ok(command, `Category "${name}" already exists`);
      }

      await g.channels.create({ name, type: ChannelType.GuildCategory });
      return ok(command, `Created category: ${name}`);
    }

    case "delete_category": {
      const { name } = params;
      if (!name) return fail(command, "Missing name parameter");

      const cat = g.channels.cache.find(
        c => c.name === name && c.type === ChannelType.GuildCategory
      );
      if (!cat) return fail(command, `Category "${name}" not found`);

      const children = g.channels.cache.filter(c => c.parentId === cat.id);
      if (children.size > 0) {
        return fail(command, `Category "${name}" has ${children.size} channels -- move them first`);
      }

      await cat.delete();
      return ok(command, `Deleted empty category: ${name}`);
    }

    case "rename_category": {
      const { from, to } = params;
      if (!from || !to) return fail(command, "Missing from/to parameters");

      const cat = g.channels.cache.find(
        c => c.name === from && c.type === ChannelType.GuildCategory
      );
      if (!cat) return fail(command, `Category "${from}" not found`);

      await (cat as CategoryChannel).setName(to);
      return ok(command, `Renamed category "${from}" -> "${to}"`);
    }

    case "create_role": {
      const { name, color } = params;
      if (!name) return fail(command, "Missing name parameter");

      if (g.roles.cache.find(r => r.name === name)) {
        return ok(command, `Role "${name}" already exists`);
      }

      const parsedColor = color ? parseInt(color.replace("#", ""), 16) : 0x5865f2;
      await g.roles.create({
        name,
        color: parsedColor,
        reason: "Created via conversational admin",
        permissions: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      });
      return ok(command, `Created role: ${name}`);
    }

    case "restructure": {
      const { runServerRestructure } = await import("./discord-admin.js");
      const result = await runServerRestructure();
      return ok(command, result);
    }

    case "restart": {
      // Spawn new process, then exit current one after a short delay
      const { spawn } = await import("node:child_process");
      const cwd = process.cwd();
      spawn("node", ["--import", "tsx/esm", "src/index.ts"], {
        cwd,
        detached: true,
        stdio: ["ignore", "ignore", "ignore"],
      }).unref();

      // Give the new process time to start before killing this one
      setTimeout(() => process.exit(0), 2000);
      return ok(command, "Restarting bot... back in a few seconds.");
    }

    default:
      return fail(command, `Unknown action: ${command}`);
  }
}

function ok(action: string, message: string): ActionResult {
  return { action, success: true, message };
}

function fail(action: string, message: string): ActionResult {
  return { action, success: false, message };
}

/**
 * Format action results for Discord display.
 */
export function formatResults(results: ActionResult[]): string {
  if (results.length === 0) return "";
  return results
    .map(r => `${r.success ? "+" : "x"} **${r.action}**: ${r.message}`)
    .join("\n");
}
