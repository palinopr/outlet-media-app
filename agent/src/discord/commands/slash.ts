/**
 * discord-slash.ts -- Discord slash command registration.
 *
 * Registers native Discord slash commands alongside ! commands.
 * Guild-scoped (instant availability, no 1hr cache).
 *
 * Interaction handler is separate from the button handler in discord-buttons.ts.
 * Both listen on "interactionCreate" but filter by interaction type.
 */

import {
  REST,
  Routes,
  SlashCommandBuilder,
  type Client,
  type ChatInputCommandInteraction,
  type TextChannel,
} from "discord.js";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

// --- Command Definitions --------------------------------------------------

const commands = [
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Check if the agent is idle or busy"),
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all available commands and channels"),
  new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Clear conversation context in this channel"),
  new SlashCommandBuilder()
    .setName("supervise")
    .setDescription("Run Boss supervision cycle over all agent activity"),
  new SlashCommandBuilder()
    .setName("dashboard")
    .setDescription("Update the campaign status dashboard panel"),
  new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Show scheduled jobs status panel"),
  new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Ensure all server roles are configured"),
  new SlashCommandBuilder()
    .setName("threads")
    .setDescription("List active threads in client channels"),
];

// --- Registration ---------------------------------------------------------

/**
 * Register slash commands with Discord API.
 * Guild-scoped for instant availability (no 1-hour global cache).
 */
export async function registerSlashCommands(token: string): Promise<void> {
  if (!CLIENT_ID || !GUILD_ID) {
    console.warn("[slash] DISCORD_CLIENT_ID or DISCORD_GUILD_ID not set -- skipping slash command registration");
    return;
  }

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log("[slash] Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands.map(c => c.toJSON()) },
    );
    console.log(`[slash] Registered ${commands.length} commands`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[slash] Failed to register commands:", msg);
  }
}

// --- Interaction Handler --------------------------------------------------

/**
 * Register the slash command interaction handler.
 * Call once during bot startup (alongside button handler).
 */
export function registerSlashHandler(client: Client): void {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = interaction as ChatInputCommandInteraction;

    try {
      switch (cmd.commandName) {
        case "status": {
          const { state } = await import("../../state.js");
          const busy = state.jobRunning || state.thinkRunning || state.discordAdminRunning;
          await cmd.reply({
            content: busy ? "Agent is busy running a task." : "Agent is idle and ready.",
            ephemeral: true,
          });
          break;
        }

        case "help": {
          await cmd.reply({ content: buildHelpText(), ephemeral: true });
          break;
        }

        case "reset": {
          const { channelSessions } = await import("../core/entry.js");
          channelSessions.delete(cmd.channelId);
          await cmd.reply({ content: "Conversation reset. Starting fresh.", ephemeral: true });
          break;
        }

        case "supervise": {
          await cmd.deferReply();
          const { handleSuperviseCommand } = await import("./supervisor.js");
          const result = await handleSuperviseCommand(client);
          const opts: Record<string, unknown> = { embeds: [result.embed] };
          if (result.text) opts.content = result.text;
          await cmd.editReply(opts);
          break;
        }

        case "dashboard": {
          await cmd.deferReply();
          const { handleDashboardCommand } = await import("./dashboard.js");
          const result = await handleDashboardCommand(client);
          const opts: Record<string, unknown> = {};
          if (result.text) opts.content = result.text;
          if (result.embed) opts.embeds = [result.embed];
          await cmd.editReply(Object.keys(opts).length > 0 ? opts : { content: "Dashboard updated." });
          break;
        }

        case "schedule": {
          await cmd.deferReply();
          const { handleScheduleCommand } = await import("./schedule.js");
          const result = await handleScheduleCommand("!schedule list", client, "schedule");
          if (result?.embed) {
            const { scheduleButtons } = await import("../features/buttons.js");
            await cmd.editReply({ embeds: [result.embed], components: [scheduleButtons()] });
          } else {
            await cmd.editReply("No schedule data available.");
          }
          break;
        }

        case "roles": {
          await cmd.deferReply();
          const guild = client.guilds.cache.first();
          if (!guild) { await cmd.editReply("No guild found."); break; }
          const { ensureRoles } = await import("../features/restructure.js");
          const result = await ensureRoles(guild);
          await cmd.editReply(result);
          break;
        }

        case "threads": {
          const ch = cmd.channel;
          if (ch && "threads" in ch) {
            const { listThreads } = await import("../features/threads.js");
            const result = await listThreads(ch as TextChannel);
            await cmd.reply({ content: result, ephemeral: true });
          } else {
            await cmd.reply({ content: "Threads are only available in client channels.", ephemeral: true });
          }
          break;
        }

        default:
          await cmd.reply({ content: "Unknown command.", ephemeral: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (cmd.deferred || cmd.replied) {
        await cmd.editReply(`Error: ${msg}`).catch(() => {});
      } else {
        await cmd.reply({ content: `Error: ${msg}`, ephemeral: true }).catch(() => {});
      }
    }
  });
}

function buildHelpText(): string {
  return [
    "**META AGENT Commands** (use `/` or `!`)",
    "",
    "`/status` -- check if the agent is idle or busy",
    "`/help` -- this message",
    "`/reset` -- clear conversation context in this channel",
    "`/supervise` -- Boss reviews all agent activity",
    "`/dashboard` -- update campaign status panel",
    "`/schedule` -- show scheduled jobs panel",
    "`/roles` -- ensure Admin/Team/Bot/Viewer roles",
    "`/threads` -- list active threads (client channels only)",
    "",
    "**Agent channels** -- just type naturally:",
    "  #boss -- orchestrator, delegation, supervision",
    "  #media-buyer -- Meta Ads, budgets, ROAS",
    "  #tm-data -- Ticketmaster events, demographics",
    "  #creative -- ad creative, copy, images",
    "  #dashboard -- reporting, analytics, trends",
    "  #zamora / #kybba -- client conversations",
    "  #general -- team chat",
    "",
    "**Manual triggers:**",
    "  `run meta sync` (in #media-buyer)",
    "  `run tm sync` (in #tm-data)",
    "  `run think` (any channel)",
    "",
    "**Threads** (in #zamora, #kybba):",
    "  `thread: Event Name` -- create a thread",
    "  `/threads` -- list active threads",
    "",
    "**Agent-to-agent:** agents can delegate tasks with `@agent-name task`",
    "**Memory:** agents auto-learn from conversations and persist to memory files.",
    "**Skills:** agents create reusable procedure files when they discover patterns.",
  ].join("\n");
}
