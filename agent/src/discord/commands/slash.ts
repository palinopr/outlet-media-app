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
import { canRunCommand, canUseChannel, getAccessDeniedMessage, isReadOnlyChannel } from "../core/access.js";

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
    .setName("schedule-budget")
    .setDescription("Create a timed Boss -> Scheduler -> Media Buyer budget handoff")
    .addStringOption((option) =>
      option
        .setName("request")
        .setDescription("Free-form request, e.g. raise Salt Lake City to $800/day")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("when")
        .setDescription("Time like 12am, 00:00, or tomorrow 9am")
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("schedule-copy-swap")
    .setDescription("Schedule a timed Media Buyer ad swap with exact ad IDs")
    .addStringOption((option) =>
      option
        .setName("activate_ad_id")
        .setDescription("Ad ID to activate at the scheduled time")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("pause_ad_id")
        .setDescription("Ad ID to pause at the scheduled time")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("when")
        .setDescription("Time like 12am, 00:00, or tomorrow 9am")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("campaign")
        .setDescription("Optional campaign label for the task summary")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("Optional city or market label")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("activate_label")
        .setDescription("Optional label for the ad being activated, e.g. Hoy")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("pause_label")
        .setDescription("Optional label for the ad being paused, e.g. Mañana")
        .setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Ensure all server roles are configured"),
  new SlashCommandBuilder()
    .setName("threads")
    .setDescription("List active threads in client channels"),
  new SlashCommandBuilder()
    .setName("publish-confirm")
    .setDescription("Mark a manual TikTok publish attempt as live")
    .addStringOption((option) =>
      option
        .setName("attempt")
        .setDescription("Publish attempt id or known attempt reference")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("publish_url")
        .setDescription("Final TikTok post URL")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("platform_post_id")
        .setDescription("Optional platform post id")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("note")
        .setDescription("Optional operator note")
        .setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("publish-fail")
    .setDescription("Mark a manual TikTok publish attempt as failed")
    .addStringOption((option) =>
      option
        .setName("attempt")
        .setDescription("Publish attempt id or known attempt reference")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("error")
        .setDescription("What failed during manual posting")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("note")
        .setDescription("Optional operator note")
        .setRequired(false),
    ),
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
    const guildMember = cmd.guild
      ? (cmd.guild.members.cache.get(cmd.user.id) ?? await cmd.guild.members.fetch(cmd.user.id).catch(() => null))
      : null;

    try {
      const channelName = "name" in (cmd.channel ?? {}) ? ((cmd.channel as TextChannel).name ?? "") : "";
      if (!canUseChannel(channelName, guildMember, cmd.user.id)) {
        await cmd.reply({ content: getAccessDeniedMessage(channelName), ephemeral: true });
        return;
      }

      switch (cmd.commandName) {
        case "status": {
          const { isAnyAgentBusy } = await import("../../state.js");
          const busy = isAnyAgentBusy();
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
          if (!canRunCommand("supervise", guildMember, cmd.user.id)) {
            await cmd.reply({ content: "Access denied. Supervision is owner-only.", ephemeral: true });
            break;
          }
          await cmd.deferReply();
          const { handleSuperviseCommand } = await import("./supervisor.js");
          const result = await handleSuperviseCommand(client);
          const opts: Record<string, unknown> = { embeds: [result.embed] };
          if (result.text) opts.content = result.text;
          await cmd.editReply(opts);
          break;
        }

        case "dashboard": {
          if (!canRunCommand("dashboard", guildMember, cmd.user.id)) {
            await cmd.reply({ content: "Access denied. Dashboard refresh is owner-only.", ephemeral: true });
            break;
          }
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
          if (!canRunCommand("schedule", guildMember, cmd.user.id)) {
            await cmd.reply({ content: "Access denied. Schedule controls are owner-only.", ephemeral: true });
            break;
          }
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

        case "schedule-budget": {
          if (!channelName || isReadOnlyChannel(channelName)) {
            await cmd.reply({ content: "Use `/schedule-budget` in a team work channel like #general or #media-buyer.", ephemeral: true });
            break;
          }

          const request = cmd.options.getString("request", true).trim();
          const when = cmd.options.getString("when", true).trim();

          const { formatScheduledTimeLabel, parseScheduledDispatchTime, scheduleBudgetUpdateHandoff } =
            await import("../../services/scheduled-handoff-service.js");
          const { sendAsAgent } = await import("../../services/webhook-service.js");
          const { notifyChannel } = await import("../core/entry.js");

          const combinedRequest = `${request} at ${when}`;
          const deliverAt = parseScheduledDispatchTime(combinedRequest);
          if (!deliverAt) {
            await cmd.reply({
              content: "I couldn't parse that time. Use something like `12am`, `00:00`, or `tomorrow 9am`.",
              ephemeral: true,
            });
            break;
          }

          const requester = guildMember?.displayName ?? cmd.user.globalName ?? cmd.user.username;
          const scheduledLabel = formatScheduledTimeLabel(deliverAt);
          const scheduledTask = await scheduleBudgetUpdateHandoff({
            deliverAt,
            originalRequest: request,
            requester,
            sourceChannel: channelName,
          });

          const sourceChannelRef = `#${channelName}`;
          await sendAsAgent(
            "boss",
            channelName,
            `Boss got it. I scheduled this budget handoff for ${scheduledLabel}. Scheduler will send it to #media-buyer then and bring the result back here.`,
          );
          await sendAsAgent(
            "boss",
            "boss",
            [
              `${requester} in ${sourceChannelRef} created a scheduled budget update handoff via /schedule-budget.`,
              `Original request: "${request}"`,
              `Requested time: ${when}`,
              `Scheduler task: ${scheduledTask.id}`,
              `Dispatch time: ${scheduledLabel}`,
            ].join("\n"),
          );
          await sendAsAgent(
            "boss",
            "schedule",
            [
              `Queued by Boss: ${scheduledTask.id}`,
              `Dispatch time: ${scheduledLabel}`,
              `Requester: ${requester}`,
              `Source: ${sourceChannelRef}`,
              `Original request: "${request}"`,
            ].join("\n"),
          );
          await notifyChannel("agent-feed", `**#${channelName}** (scheduled-budget-slash) -- ${requester}: "${request.slice(0, 120)}"`).catch((e) => console.warn("[slash] notify failed:", e));

          await cmd.reply({
            content: `Created scheduler task \`${scheduledTask.id}\` for ${scheduledLabel}.`,
            ephemeral: true,
          });
          break;
        }

        case "schedule-copy-swap": {
          if (!channelName || isReadOnlyChannel(channelName)) {
            await cmd.reply({ content: "Use `/schedule-copy-swap` in a team work channel like #boss or #media-buyer.", ephemeral: true });
            break;
          }

          const activateAdId = cmd.options.getString("activate_ad_id", true).trim();
          const pauseAdId = cmd.options.getString("pause_ad_id", true).trim();
          const when = cmd.options.getString("when", true).trim();
          const campaignName = cmd.options.getString("campaign")?.trim();
          const city = cmd.options.getString("city")?.trim();
          const activateLabel = cmd.options.getString("activate_label")?.trim();
          const pauseLabel = cmd.options.getString("pause_label")?.trim();

          const { formatScheduledTimeLabel, parseScheduledDispatchTime, scheduleCopySwapHandoff } =
            await import("../../services/scheduled-handoff-service.js");
          const { sendAsAgent } = await import("../../services/webhook-service.js");
          const { notifyChannel } = await import("../core/entry.js");

          const deliverAt = parseScheduledDispatchTime(when);
          if (!deliverAt) {
            await cmd.reply({
              content: "I couldn't parse that time. Use something like `12am`, `00:00`, or `tomorrow 9am`.",
              ephemeral: true,
            });
            break;
          }

          if (activateAdId === pauseAdId) {
            await cmd.reply({
              content: "Use two different ad IDs. The activate and pause IDs cannot match.",
              ephemeral: true,
            });
            break;
          }

          const requester = guildMember?.displayName ?? cmd.user.globalName ?? cmd.user.username;
          const scheduledLabel = formatScheduledTimeLabel(deliverAt);
          const originalRequest = [
            campaignName ? `${campaignName}` : "Scheduled copy swap",
            city ? `for ${city}` : null,
            `activate ad ${activateAdId}`,
            `pause ad ${pauseAdId}`,
            `at ${when}`,
          ]
            .filter(Boolean)
            .join(" | ");

          const scheduledTask = await scheduleCopySwapHandoff({
            activateAdId,
            activateLabel,
            campaignName,
            city,
            deliverAt,
            originalRequest,
            pauseAdId,
            pauseLabel,
            requester,
            sourceChannel: channelName,
          });

          const sourceChannelRef = `#${channelName}`;
          await sendAsAgent(
            "boss",
            channelName,
            `Boss got it. I scheduled this copy swap handoff for ${scheduledLabel}. Scheduler will send it to #media-buyer then and bring the result back here.`,
          );
          await sendAsAgent(
            "boss",
            "boss",
            [
              `${requester} in ${sourceChannelRef} created a scheduled copy swap via /schedule-copy-swap.`,
              `Activate: ${activateLabel ?? activateAdId}`,
              `Pause: ${pauseLabel ?? pauseAdId}`,
              `Requested time: ${when}`,
              `Scheduler task: ${scheduledTask.id}`,
              `Dispatch time: ${scheduledLabel}`,
            ].join("\n"),
          );
          await sendAsAgent(
            "boss",
            "schedule",
            [
              `Queued by Boss: ${scheduledTask.id}`,
              `Dispatch time: ${scheduledLabel}`,
              `Requester: ${requester}`,
              `Source: ${sourceChannelRef}`,
              `Activate: ${activateLabel ?? activateAdId}`,
              `Pause: ${pauseLabel ?? pauseAdId}`,
              campaignName ? `Campaign: ${campaignName}` : null,
              city ? `City: ${city}` : null,
            ]
              .filter(Boolean)
              .join("\n"),
          );
          await notifyChannel(
            "agent-feed",
            `**#${channelName}** (scheduled-copy-swap-slash) -- ${requester}: activate ${activateAdId}, pause ${pauseAdId}`,
          ).catch((e) => console.warn("[slash] notify failed:", e));

          await cmd.reply({
            content: `Created copy-swap task \`${scheduledTask.id}\` for ${scheduledLabel}.`,
            ephemeral: true,
          });
          break;
        }

        case "roles": {
          if (!canRunCommand("roles", guildMember, cmd.user.id)) {
            await cmd.reply({ content: "Access denied. Role management is owner-only.", ephemeral: true });
            break;
          }
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

        case "publish-confirm": {
          const { canConfirmGrowthPublishInChannel, confirmGrowthPublish, TIKTOK_PUBLISH_CHANNEL } =
            await import("./growth-publish.js");

          if (!canConfirmGrowthPublishInChannel(channelName)) {
            await cmd.reply({
              content: `Use \`/publish-confirm\` in #${TIKTOK_PUBLISH_CHANNEL}.`,
              ephemeral: true,
            });
            break;
          }

          const actorName = guildMember?.displayName ?? cmd.user.globalName ?? cmd.user.username;
          const result = await confirmGrowthPublish({
            actorName,
            attemptRef: cmd.options.getString("attempt", true).trim(),
            channelName,
            note: cmd.options.getString("note"),
            platformPostId: cmd.options.getString("platform_post_id"),
            publishUrl: cmd.options.getString("publish_url", true).trim(),
          });

          await cmd.reply({ content: result.reply, ephemeral: true });
          break;
        }

        case "publish-fail": {
          const { canConfirmGrowthPublishInChannel, failGrowthPublish, TIKTOK_PUBLISH_CHANNEL } =
            await import("./growth-publish.js");

          if (!canConfirmGrowthPublishInChannel(channelName)) {
            await cmd.reply({
              content: `Use \`/publish-fail\` in #${TIKTOK_PUBLISH_CHANNEL}.`,
              ephemeral: true,
            });
            break;
          }

          const actorName = guildMember?.displayName ?? cmd.user.globalName ?? cmd.user.username;
          const result = await failGrowthPublish({
            actorName,
            attemptRef: cmd.options.getString("attempt", true).trim(),
            channelName,
            errorMessage: cmd.options.getString("error", true).trim(),
            note: cmd.options.getString("note"),
          });

          await cmd.reply({ content: result.reply, ephemeral: true });
          break;
        }

        default:
          await cmd.reply({ content: "Unknown command.", ephemeral: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (cmd.deferred || cmd.replied) {
        await cmd.editReply(`Error: ${msg}`).catch((e) => console.warn("[slash] reply failed:", e));
      } else {
        await cmd.reply({ content: `Error: ${msg}`, ephemeral: true }).catch((e) => console.warn("[slash] reply failed:", e));
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
    "`/schedule-budget` -- explicitly schedule a budget handoff",
    "`/schedule-copy-swap` -- schedule an ad-status copy swap with exact IDs",
    "`/roles` -- ensure Owner/Admin/Team/Bot/Viewer roles",
    "`/threads` -- list active threads (client channels only)",
    "`/publish-confirm` -- mark a manual TikTok publish attempt live",
    "`/publish-fail` -- mark a manual TikTok publish attempt failed",
    "",
    "**Agent channels** -- just type naturally:",
    "  #general -- team chat",
    "  #media-buyer -- Meta Ads, budgets, ROAS",
    "  #tm-data -- Ticketmaster events, demographics",
    "  #creative -- ad creative, copy, images",
    "  #dashboard -- reporting, analytics, trends",
    "  #growth / #tiktok-ops / #content-lab / #lead-inbox -- growth pod",
    "  #tiktok-publish -- assisted publish packets and operator confirmations",
    "  #zamora / #kybba -- client conversations",
    "  #boss / #email / #meetings / #schedule -- owner-only",
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
    "**Agent-to-agent:** agents can hand work to each other through the runtime task system.",
    "**Memory:** agents auto-learn from conversations and persist to memory files.",
    "**Skills:** agents create reusable procedure files when they discover patterns.",
  ].join("\n");
}
