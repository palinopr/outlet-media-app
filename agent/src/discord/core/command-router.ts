/**
 * command-router.ts -- Routes incoming Discord messages to the correct handler.
 *
 * Contains the messageCreate handler body, built-in commands, and handoff helpers.
 * Extracted from entry.ts to keep the entry point focused on client init and notifications.
 */

import type { Client, Message, TextChannel } from "discord.js";
import { isAnyAgentBusy } from "../../state.js";
import { matchManualTrigger, isConfigChannel, isInternalChannel } from "./router.js";
import {
  canRunCommand,
  canUseChannel,
  getAccessDeniedMessage,
  isReadOnlyChannel,
} from "./access.js";
import { handleScheduleCommand } from "../commands/schedule.js";
import { handleSuperviseCommand } from "../commands/supervisor.js";
import { handleDashboardCommand } from "../commands/dashboard.js";
import {
  handleMessage,
  isChannelLocked,
  acquireChannelLock,
  releaseChannelLock,
  chunkText,
} from "../../events/message-handler.js";
import { sendAsAgent } from "../../services/webhook-service.js";
import {
  extractScheduledCopySwapParams,
  formatScheduledTimeLabel,
  looksLikeScheduledBudgetRequest,
  looksLikeScheduledCopySwapRequest,
  parseScheduledDispatchTime,
  scheduleCopySwapHandoff,
  scheduleBudgetUpdateHandoff,
} from "../../services/scheduled-handoff-service.js";
import { buildPromptFromDiscordMessage } from "./message-prompt.js";
import {
  channelSessions,
  markChannelLockAcquired,
  markChannelLockReleased,
  checkAndReleaseStaleLock,
  notifyChannel,
} from "./entry.js";
import { OWNER_USER_IDS } from "../../services/owner-discord-service.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MEETING_HANDOFF_CHANNELS = new Set([
  "dashboard",
  "general",
  "media-buyer",
  "tm-data",
  "creative",
  "zamora",
  "kybba",
  "don-omar-tickets",
]);

const SCHEDULED_MEDIA_BUYER_HANDOFF_CHANNELS = new Set([
  ...MEETING_HANDOFF_CHANNELS,
  "boss",
]);

// ---------------------------------------------------------------------------
// Dedup guard
// ---------------------------------------------------------------------------

const processedMessages = new Set<string>();
const MAX_PROCESSED = 500;

function markProcessed(msgId: string): boolean {
  if (processedMessages.has(msgId)) return false;
  processedMessages.add(msgId);
  if (processedMessages.size > MAX_PROCESSED) {
    const first = processedMessages.values().next().value;
    if (first) processedMessages.delete(first);
  }
  return true;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function looksLikeMeetingRequest(content: string): boolean {
  const lower = content.toLowerCase();
  const mentionsMeeting = /\bgoogle meet\b|\bmeeting\b|\breunion\b|\breunión\b|\bzoom\b/.test(lower);
  if (!mentionsMeeting) return false;

  const hasAction = /\bpuedes\b|\bpodrias\b|\bpodrías\b|\bcreate\b|\bcrear\b|\bschedule\b|\bagendar\b|\binvite\b|\binvitar\b|\bquiere\b|\bwants\b|\bhacer\b/.test(lower);
  const hasTime = /\b\d{1,2}(:\d{2})?\s?(am|pm)\b/.test(lower) ||
    /\bhoy\b|\btoday\b|\bmañana\b|\btomorrow\b|\blunes\b|\bmartes\b|\bmiércoles\b|\bmiercoles\b|\bjueves\b|\bviernes\b|\bsábado\b|\bsabado\b|\bdomingo\b|\bmonday\b|\btuesday\b|\bwednesday\b|\bthursday\b|\bfriday\b|\bsaturday\b|\bsunday\b/.test(lower);
  const hasAttendees = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(content) ||
    lower.includes("@jaime") ||
    lower.includes("jaime");

  return hasAction || hasTime || hasAttendees;
}

function feedTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOwnerMentions(msg: Message): string {
  const ids = new Set<string>();
  if (msg.guild?.ownerId) ids.add(msg.guild.ownerId);
  for (const id of OWNER_USER_IDS) ids.add(id);
  return [...ids].map((id) => `<@${id}>`).join(" ").trim();
}

async function handoffMeetingRequestToBoss(
  msg: Message,
  channelName: string,
  content: string,
): Promise<void> {
  const requester = msg.member?.displayName || msg.author.globalName || msg.author.username;
  const ownerMentions = getOwnerMentions(msg);
  const sourceChannelRef = `#${channelName}`;

  await sendAsAgent(
    "boss",
    channelName,
    "Boss got it. I'm checking with Jaime in #boss and will bring the scheduling answer back here.",
  );

  const bossBrief = [
    ownerMentions,
    `${requester} in ${sourceChannelRef} requested a Google Meet / meeting.`,
    `Original request: "${content}"`,
    `Handle this in #boss: confirm Jaime's availability or approval, then delegate to meeting-agent.`,
    `When you delegate, report the result back to ${sourceChannelRef}.`,
  ]
    .filter(Boolean)
    .join("\n");

  await sendAsAgent("boss", "boss", bossBrief);

  await notifyChannel(
    "agent-feed",
    `\`${feedTimestamp()}\` **#${channelName}** (boss-intake) -- ${requester}: "${content.slice(0, 120)}"`,
  ).catch(() => {});
}

async function handoffScheduledBudgetRequestToBoss(
  msg: Message,
  channelName: string,
  content: string,
): Promise<boolean> {
  const deliverAt = parseScheduledDispatchTime(content);
  if (!deliverAt) return false;

  const requester = msg.member?.displayName || msg.author.globalName || msg.author.username;
  const sourceChannelRef = `#${channelName}`;
  const scheduledLabel = formatScheduledTimeLabel(deliverAt);

  const scheduledTask = await scheduleBudgetUpdateHandoff({
    deliverAt,
    originalRequest: content,
    requester,
    sourceChannel: channelName,
  });

  await sendAsAgent(
    "boss",
    channelName,
    `Boss got it. I scheduled this budget handoff for ${scheduledLabel}. Scheduler will send it to #media-buyer then and bring the result back here.`,
  );

  const scheduleBrief = [
    `Queued by Boss: ${scheduledTask.id}`,
    `Dispatch time: ${scheduledLabel}`,
    `Requester: ${requester}`,
    `Source: ${sourceChannelRef}`,
    `Original request: "${content}"`,
  ].join("\n");

  if (channelName !== "boss") {
    const bossBrief = [
      `${requester} in ${sourceChannelRef} requested a scheduled budget update handoff.`,
      `Original request: "${content}"`,
      `Scheduler task: ${scheduledTask.id}`,
      `Dispatch time: ${scheduledLabel}`,
      `The scheduler will hand this to #media-buyer at the due time and reply back in ${sourceChannelRef}.`,
    ].join("\n");

    await sendAsAgent("boss", "boss", bossBrief);
  }
  await sendAsAgent("boss", "schedule", scheduleBrief);

  await notifyChannel(
    "agent-feed",
    `\`${feedTimestamp()}\` **#${channelName}** (scheduled-budget) -- ${requester}: "${content.slice(0, 120)}"`,
  ).catch(() => {});

  return true;
}

async function handoffScheduledCopySwapRequestToBoss(
  msg: Message,
  channelName: string,
  content: string,
): Promise<boolean> {
  const deliverAt = parseScheduledDispatchTime(content);
  if (!deliverAt) return false;

  const requester = msg.member?.displayName || msg.author.globalName || msg.author.username;
  const sourceChannelRef = `#${channelName}`;
  const scheduledLabel = formatScheduledTimeLabel(deliverAt);
  const swapParams = extractScheduledCopySwapParams(content);

  if (!swapParams) {
    await sendAsAgent(
      "boss",
      channelName,
      "Boss can schedule this copy swap, but I need the exact ad IDs to activate and pause. Use `/schedule-copy-swap` or say `activate ad <new_id> and pause ad <old_id> at 12am`.",
    );
    return true;
  }

  const scheduledTask = await scheduleCopySwapHandoff({
    ...swapParams,
    deliverAt,
    originalRequest: content,
    requester,
    sourceChannel: channelName,
  });

  await sendAsAgent(
    "boss",
    channelName,
    `Boss got it. I scheduled this copy swap handoff for ${scheduledLabel}. Scheduler will send it to #media-buyer then and bring the result back here.`,
  );

  const scheduleBrief = [
    `Queued by Boss: ${scheduledTask.id}`,
    `Dispatch time: ${scheduledLabel}`,
    `Requester: ${requester}`,
    `Source: ${sourceChannelRef}`,
    `Original request: "${content}"`,
  ].join("\n");

  if (channelName !== "boss") {
    const bossBrief = [
      `${requester} in ${sourceChannelRef} requested a scheduled copy swap handoff.`,
      `Original request: "${content}"`,
      `Scheduler task: ${scheduledTask.id}`,
      `Dispatch time: ${scheduledLabel}`,
      `The scheduler will hand this to #media-buyer at the due time and reply back in ${sourceChannelRef}.`,
    ].join("\n");

    await sendAsAgent("boss", "boss", bossBrief);
  }
  await sendAsAgent("boss", "schedule", scheduleBrief);

  await notifyChannel(
    "agent-feed",
    `\`${feedTimestamp()}\` **#${channelName}** (scheduled-copy-swap) -- ${requester}: "${content.slice(0, 120)}"`,
  ).catch(() => {});

  return true;
}

async function handleWhatsAppCommand(msg: Message, content: string): Promise<boolean> {
  const normalized = content.trim();
  if (!/^(!|\/)whatsapp\b/i.test(normalized)) {
    return false;
  }

  if (!canRunCommand("whatsapp", msg.member, msg.author.id)) {
    await msg.reply("Access denied. WhatsApp controls are owner-only.");
    return true;
  }

  const parts = normalized.split(/\s+/);
  const action = parts[1]?.toLowerCase();
  const explicitConversationId = parts[2];

  const {
    actorNameForApproval,
    formatConversationApprovalSummary,
    loadConversationRecord,
    resolveConversationIdForMessage,
    setConversationAccessStatus,
  } = await import("../../services/whatsapp-policy-service.js");

  if (!action || !["allow", "deny", "status"].includes(action)) {
    await msg.reply("Usage: `!whatsapp allow <conversationId>`, `!whatsapp deny <conversationId>`, or `!whatsapp status <conversationId>`. If you're inside a WhatsApp thread, the id is optional.");
    return true;
  }

  const conversationId = await resolveConversationIdForMessage(msg, explicitConversationId);
  if (!conversationId) {
    await msg.reply("Could not resolve a WhatsApp conversation here. Provide the conversation id or run the command inside the linked WhatsApp thread.");
    return true;
  }

  if (action === "status") {
    const record = await loadConversationRecord(conversationId);
    const policyLine =
      record.policy.chatKind === "group"
        ? `Group policy: ${record.policy.groupPolicy}`
        : "Direct chat";
    await msg.reply([
      `WhatsApp ${formatConversationApprovalSummary(record)}`,
      `Access: ${record.policy.accessStatus}`,
      `Mode: ${record.mode ?? "unknown"}`,
      policyLine,
      `Conversation: ${record.id}`,
    ].join("\n"));
    return true;
  }

  const status = action === "allow" ? "approved" : "denied";
  const actorName = actorNameForApproval(msg);
  const record = await setConversationAccessStatus(conversationId, status, actorName);
  const summary = formatConversationApprovalSummary(record);
  const updateText =
    status === "approved"
      ? `Jaime approved this WhatsApp ${record.policy.chatKind}. ${record.policy.chatKind === "group" ? "Group policy is mention_only." : "The liaison can work this chat now."} Conversation mode is now ${record.mode ?? "live"}.`
      : "Jaime denied this WhatsApp chat. The liaison will stay blocked.";

  await msg.reply(`${status === "approved" ? "Allowed" : "Denied"} ${summary}.`);

  const targetChannel = record.discordChannelName ?? "dashboard";
  await sendAsAgent(
    "boss",
    targetChannel,
    record.discordThreadId
      ? {
          content: `**Owner decision**\n${updateText}`,
          threadId: record.discordThreadId,
        }
      : `**Owner decision**\n${updateText}`,
  ).catch(() => {});

  return true;
}

// ---------------------------------------------------------------------------
// Main message router
// ---------------------------------------------------------------------------

export async function routeMessage(msg: Message, discordClient: Client | null): Promise<void> {
  if (msg.author.bot) return;

  const content = msg.content.trim();
  if (!content && msg.attachments.size === 0) return;

  // Dedup
  if (!markProcessed(msg.id)) {
    console.log(`[discord] DEDUP blocked msg ${msg.id} from ${msg.author.username}`);
    return;
  }
  const logPreview = content || `[${msg.attachments.size} attachment(s)]`;
  console.log(`[discord] Processing msg ${msg.id} from ${msg.author.username}: ${logPreview.slice(0, 60)}`);

  // Run auto-moderation first (fast path, no Claude)
  const { checkAutoMod } = await import("../commands/admin.js");
  const blocked = await checkAutoMod(msg);
  if (blocked) return;

  // Resolve channel name for routing
  const channelName = "name" in msg.channel
    ? ("isThread" in msg.channel && msg.channel.isThread()
        ? (msg.channel.parent?.name ?? msg.channel.name)
        : (msg.channel as TextChannel).name)
    : "";

  if (!canUseChannel(channelName, msg.member, msg.author.id)) {
    await msg.reply(getAccessDeniedMessage(channelName)).catch(() => {});
    return;
  }

  // Simple built-in commands
  if (content === "!status" || content === "/status") {
    const busy = isAnyAgentBusy();
    await msg.reply(busy ? "Agent is busy running a task." : "Agent is idle and ready.");
    return;
  }

  if (content === "!help" || content === "/help") {
    const helpText = [
      "**META AGENT Commands** (use `/` or `!`)",
      "",
      "`!help` -- this message",
      "`!status` -- check if the agent is idle or busy",
      "`!reset` -- clear conversation context in this channel",
      "",
      "**Agent channels** -- just type naturally:",
      "  #general -- team chat",
      "  #media-buyer -- Meta Ads, budgets, ROAS",
      "  #tm-data -- Ticketmaster events, demographics",
      "  #creative -- ad creative, copy, images",
      "  #dashboard -- reporting, analytics, trends",
      "  #whatsapp-control -- customer WhatsApp liaison tasks",
      "  #zamora / #kybba -- client forums",
      "  #whatsapp-boss -- owner-only WhatsApp approvals and supervision",
      "  #boss / #email / #meetings / #email-log / #schedule -- owner-only",
      "",
      "**Manual triggers:**",
      "  `run meta sync` (in #media-buyer)",
      "  `run tm sync` (in #tm-data)",
      "  `run think` (any channel)",
      "",
      "**Inspect** (in #agent-internals):",
      "  `inspect all` -- list all agents",
      "  `inspect <agent> memory|skills|prompt` -- view agent internals",
      "",
      "**Admin:**",
      "  `!supervise` -- Boss reviews all agent activity",
      "  `!dashboard` -- update campaign status panel",
      "  `!whatsapp allow|deny|status <conversationId>` -- owner WhatsApp access control",
      "  `/schedule-copy-swap` -- explicitly schedule an activate/pause ad swap with exact IDs",
      "  `!roles` -- ensure Owner/Admin/Team/Bot/Viewer roles",
      "  `!restructure` -- enforce full server layout",
      "",
      "**Schedule** (in #schedule):",
      "  `!schedule list` -- show runtime-managed and optional jobs with status + buttons",
      "  `!enable <job>` / `!disable <job>` -- toggle optional jobs only",
      "",
      "**Agents respond via webhooks with unique identities.**",
      "**Three-tier approval: Green (auto), Yellow (Boss checks), Red (you approve).**",
    ].join("\n");
    await msg.reply(helpText);
    return;
  }

  if (content === "!reset" || content === "/reset") {
    channelSessions.delete(msg.channelId);
    await msg.reply("Conversation reset. Starting fresh.");
    return;
  }

  if (await handleWhatsAppCommand(msg, content)) {
    return;
  }

  if (content === "!restructure" || content === "/restructure") {
    if (!canRunCommand("restructure", msg.member, msg.author.id)) {
      await msg.reply("Access denied. Server restructure is owner-only.");
      return;
    }
    const guild = discordClient?.guilds.cache.first();
    if (!guild) { await msg.reply("No guild found."); return; }
    await msg.reply("Running server restructure...");
    const { runServerRestructure } = await import("../features/restructure.js");
    const result = await runServerRestructure(guild);
    const chunks2 = chunkText(result, 1900);
    for (const chunk of chunks2) {
      if ("send" in msg.channel) await (msg.channel as TextChannel).send(chunk);
    }
    return;
  }

  if (content === "!roles" || content === "/roles") {
    if (!canRunCommand("roles", msg.member, msg.author.id)) {
      await msg.reply("Access denied. Role management is owner-only.");
      return;
    }
    const guild = discordClient?.guilds.cache.first();
    if (!guild) { await msg.reply("No guild found."); return; }
    const { ensureRoles } = await import("../features/restructure.js");
    const result = await ensureRoles(guild);
    await msg.reply(result);
    return;
  }

  if (content === "!supervise" || content === "/supervise") {
    if (!canRunCommand("supervise", msg.member, msg.author.id)) {
      await msg.reply("Access denied. Supervision is owner-only.");
      return;
    }
    if (!discordClient) { await msg.reply("Bot not connected."); return; }
    await msg.reply("Running Boss supervision cycle...");
    const result = await handleSuperviseCommand(discordClient);
    if (result.text) await (msg.channel as TextChannel).send(result.text);
    await (msg.channel as TextChannel).send({ embeds: [result.embed] });
    return;
  }

  if (content === "!dashboard" || content === "/dashboard") {
    if (!canRunCommand("dashboard", msg.member, msg.author.id)) {
      await msg.reply("Access denied. Dashboard refresh is owner-only.");
      return;
    }
    if (!discordClient) { await msg.reply("Bot not connected."); return; }
    await msg.reply("Updating dashboard...");
    const result = await handleDashboardCommand(discordClient);
    if (result.text) await (msg.channel as TextChannel).send(result.text);
    if (result.embed) await (msg.channel as TextChannel).send({ embeds: [result.embed] });
    return;
  }

  // Schedule channel
  if (channelName === "schedule") {
    if (!canRunCommand("schedule", msg.member, msg.author.id)) {
      await msg.reply("Access denied. Schedule controls are owner-only.");
      return;
    }
    const schedResult = await handleScheduleCommand(content, discordClient!, channelName);
    if (schedResult) {
      if (schedResult.text) await msg.reply(schedResult.text);
      if (schedResult.embed) {
        const sendOpts: Record<string, unknown> = { embeds: [schedResult.embed] };
        if (schedResult.buttons) {
          const { scheduleButtons } = await import("../features/buttons.js");
          sendOpts.components = [scheduleButtons()];
        }
        await (msg.channel as TextChannel).send(sendOpts);
      }
    }
    return;
  }

  // Agent internals channel: inspect commands
  if (channelName === "agent-internals") {
    if (!canRunCommand("inspect", msg.member, msg.author.id)) {
      await msg.reply("Access denied. Agent internals are owner-only.");
      return;
    }
    const { handleInspectCommand } = await import("../../events/inspect-handler.js");
    const handled = await handleInspectCommand(msg, content);
    if (handled) return;
  }

  // Internal channels (memory/skills): bot-managed, skip
  if (isInternalChannel(channelName)) return;
  if (isConfigChannel(channelName)) return;

  // Thread commands
  if (content === "!threads" || content === "/threads") {
    if ("threads" in msg.channel) {
      const { listThreads } = await import("../features/threads.js");
      const result = await listThreads(msg.channel as TextChannel);
      await msg.reply(result);
    } else {
      await msg.reply("Threads are only available in client channels (#zamora, #kybba).");
    }
    return;
  }

  if (isReadOnlyChannel(channelName)) {
    await msg.reply(`This channel is read-only. Use a work channel instead of #${channelName}.`).catch(() => {});
    return;
  }

  if (MEETING_HANDOFF_CHANNELS.has(channelName) && looksLikeMeetingRequest(content)) {
    await handoffMeetingRequestToBoss(msg, channelName, content);
    return;
  }

  if (SCHEDULED_MEDIA_BUYER_HANDOFF_CHANNELS.has(channelName) && looksLikeScheduledBudgetRequest(content)) {
    const handled = await handoffScheduledBudgetRequestToBoss(msg, channelName, content);
    if (handled) return;
  }

  if (SCHEDULED_MEDIA_BUYER_HANDOFF_CHANNELS.has(channelName) && looksLikeScheduledCopySwapRequest(content)) {
    const handled = await handoffScheduledCopySwapRequestToBoss(msg, channelName, content);
    if (handled) return;
  }

  if (content.toLowerCase().startsWith("thread:") || content.toLowerCase().startsWith("new thread:")) {
    const { maybeCreateThread } = await import("../features/threads.js");
    const thread = await maybeCreateThread(msg, channelName);
    if (thread) {
      await msg.reply(`Thread created: **${thread.threadName}** -- continue the conversation there.`);
      return;
    }
  }

  // Manual job triggers
  const trigger = matchManualTrigger(channelName, content);
  if (trigger) {
    const { triggerManualJob } = await import("../../scheduler.js");
    await msg.reply(`Triggering ${trigger}...`);
    triggerManualJob(trigger);
    return;
  }

  // Per-channel lock with stale lock detection
  if (isChannelLocked(msg.channelId)) {
    const wasStale = checkAndReleaseStaleLock(msg.channelId);
    if (!wasStale) {
      console.log(`[discord] Channel ${channelName} already processing, skipping msg ${msg.id}`);
      return;
    }
  }

  // Acquire lock atomically before async work to prevent TOCTOU race
  if (!acquireChannelLock(msg.channelId)) {
    console.log(`[discord] Channel ${channelName} lock race, skipping msg ${msg.id}`);
    return;
  }
  markChannelLockAcquired(msg.channelId);

  try {
    const promptResult = await buildPromptFromDiscordMessage(content, msg.attachments.values());
    if (!promptResult.prompt) {
      if (promptResult.fallbackMessage) {
        await msg.reply(promptResult.fallbackMessage).catch(() => {});
      }
      return;
    }

    await handleMessage(msg, promptResult.prompt, channelName, discordClient);
  } finally {
    releaseChannelLock(msg.channelId);
    markChannelLockReleased(msg.channelId);
  }
}
