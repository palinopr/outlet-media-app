/**
 * slash.ts -- Discord slash command registration.
 *
 * Three commands: /status, /help, /reset
 */

import {
  REST,
  Routes,
  SlashCommandBuilder,
  type Client,
  type ChatInputCommandInteraction,
  type TextChannel,
} from "discord.js";
import { toErrorMessage } from "../../utils/error-helpers.js";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

// --- Command Definitions --------------------------------------------------

const commands = [
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Check if the agent is idle or busy"),
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available commands"),
  new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Clear conversation context in this channel"),
];

// --- Registration ---------------------------------------------------------

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
    const msg = toErrorMessage(err);
    console.error("[slash] Failed to register commands:", msg);
  }
}

// --- Interaction Handler --------------------------------------------------

export function registerSlashHandler(client: Client): void {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = interaction as ChatInputCommandInteraction;

    try {
      switch (cmd.commandName) {
        case "status": {
          const { isChannelLocked } = await import("../../events/message-handler.js");
          const busy = isChannelLocked(cmd.channelId);
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

        default:
          await cmd.reply({ content: "Unknown command.", ephemeral: true });
      }
    } catch (err) {
      const msg = toErrorMessage(err);
      if (cmd.deferred || cmd.replied) {
        await cmd.editReply(`Error: ${msg}`).catch((e) => console.warn("[slash] reply failed:", toErrorMessage(e)));
      } else {
        await cmd.reply({ content: `Error: ${msg}`, ephemeral: true }).catch((e) => console.warn("[slash] reply failed:", toErrorMessage(e)));
      }
    }
  });
}

function buildHelpText(): string {
  return [
    "**Outlet Agent Commands**",
    "",
    "`/status` — check if the agent is idle or busy",
    "`/help` — this message",
    "`/reset` — clear conversation context in this channel",
    "",
    "**Just type naturally in any channel** — the agent handles Meta Ads, email, calendar, database queries, and general ops.",
  ].join("\n");
}
