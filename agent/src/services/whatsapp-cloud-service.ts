import { ChannelType, ThreadAutoArchiveDuration, type GuildTextBasedChannel } from "discord.js";
import { discordClient } from "../discord/core/entry.js";
import { processChannelMessages, processDelegations, processWhatsAppSends } from "../agents/delegate.js";
import { runClaude } from "../runner.js";
import { getServiceSupabase } from "./supabase-service.js";
import { sendWhatsAppMessage } from "./whatsapp-runtime-service.js";
import {
  formatConversationApprovalSummary,
  isOwnerWhatsAppNumber,
  parseOwnerControlMessage,
  parseConversationPolicy,
  requestConversationApproval,
  shouldWakeApprovedGroup,
  type WhatsAppAccessStatus,
  type WhatsAppChatKind,
  type WhatsAppGroupPolicy,
} from "./whatsapp-policy-service.js";
import { sendAsAgent } from "./webhook-service.js";
import { withResourceLocks } from "../state.js";
import whatsappClientRouting from "../../../config/whatsapp-client-routing.json";

const DEFAULT_CHANNEL = "dashboard";
const CUSTOMER_AGENT_KEY = "customer-whatsapp-agent";
const WHATSAPP_BOSS_CHANNEL = "whatsapp-boss";
const SIMPLE_DIRECT_TEST_PATTERN = /^test(?:[-\s_]*\d+)?$/i;

interface WhatsAppClientRoute {
  agentKey?: string;
  clientSlug: string;
  discordChannel: string;
  threadPrefix?: string;
}

const ROUTES_BY_CLIENT_SLUG = new Map(
  (whatsappClientRouting as WhatsAppClientRoute[]).map((route) => [route.clientSlug, route]),
);

interface ExternalTaskRow {
  action: string;
  id: string;
  params: Record<string, unknown> | null;
  to_agent: string;
}

interface ConversationContext {
  agentKey: string;
  approvalRequestedAt: string | null;
  accessStatus: WhatsAppAccessStatus;
  chatKind: WhatsAppChatKind;
  clientSlug: string | null;
  contactName: string | null;
  discordChannelName: string | null;
  discordThreadId: string | null;
  displayPhoneNumber: string | null;
  groupPolicy: WhatsAppGroupPolicy;
  id: string;
  mode: string;
  status: string;
  waId: string;
}

interface ConversationMessage {
  direction: string;
  id: string;
  messageId: string;
  messageType: string;
  metadata?: Record<string, unknown> | null;
  mirroredToDiscordAt: string | null;
  sentAt: string | null;
  status: string;
  textBody: string | null;
  triagedAt: string | null;
  receivedAt: string | null;
}

function channelForClientSlug(clientSlug: string | null | undefined): string | null {
  if (!clientSlug) return null;
  return ROUTES_BY_CLIENT_SLUG.get(clientSlug)?.discordChannel ?? null;
}

function getConversationId(task: ExternalTaskRow): string {
  const raw =
    typeof task.params?.conversationId === "string"
      ? task.params.conversationId
      : typeof task.params?.conversation_id === "string"
        ? task.params.conversation_id
        : null;

  if (!raw) {
    throw new Error(`WhatsApp task ${task.id} is missing conversationId.`);
  }

  return raw;
}

function getMessageId(task: ExternalTaskRow): string | null {
  return typeof task.params?.messageId === "string"
    ? task.params.messageId
    : typeof task.params?.message_id === "string"
      ? task.params.message_id
      : null;
}

function buildThreadName(context: ConversationContext): string {
  const baseName = context.contactName?.trim() || context.waId;
  const threadPrefix = context.clientSlug
    ? (ROUTES_BY_CLIENT_SLUG.get(context.clientSlug)?.threadPrefix ?? context.clientSlug)
    : "WhatsApp";
  const prefix = `${threadPrefix} · `;
  return `${prefix}${baseName}`.slice(0, 100);
}

function firstJoinedRow(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    const row = value[0];
    return row && typeof row === "object" ? (row as Record<string, unknown>) : {};
  }

  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function formatMessageTimestamp(message: ConversationMessage): string {
  return message.receivedAt ?? message.sentAt ?? "unknown";
}

function parseRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function inboundSpeakerLabel(message: ConversationMessage): string {
  const metadata = parseRecord(message.metadata);
  const participantName =
    typeof metadata.participantName === "string" && metadata.participantName.trim().length > 0
      ? metadata.participantName.trim()
      : null;
  const participantWaId =
    typeof metadata.participantWaId === "string" && metadata.participantWaId.trim().length > 0
      ? metadata.participantWaId.trim()
      : null;

  return participantName ?? participantWaId ?? "Customer";
}

function formatTranscript(messages: ConversationMessage[]): string {
  return messages
    .map((message) => {
      const speaker = message.direction === "inbound" ? inboundSpeakerLabel(message) : "Outlet";
      return `${speaker} [${formatMessageTimestamp(message)} | ${message.messageType}/${message.status}]: ${message.textBody ?? `[${message.messageType}]`}`;
    })
    .join("\n");
}

async function loadConversationContext(conversationId: string): Promise<ConversationContext> {
  const supabase = getServiceSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured for the agent runtime.");
  }

  const { data, error } = await supabase
    .from("whatsapp_conversations")
    .select(
      `
        id,
        agent_key,
        client_slug,
        discord_channel_name,
        discord_thread_id,
        metadata,
        mode,
        status,
        whatsapp_contacts!inner (
          client_slug,
          profile_name,
          wa_id
        ),
        whatsapp_accounts!inner (
          display_phone_number,
          phone_number_id
        )
      `,
    )
    .eq("id", conversationId)
    .single();

  if (error || !data) {
    throw new Error(`[whatsapp-agent] conversation lookup failed: ${error?.message ?? "not found"}`);
  }

  const contact = firstJoinedRow(data.whatsapp_contacts);
  const account = firstJoinedRow(data.whatsapp_accounts);
  const clientSlug = (data.client_slug as string | null) ?? (contact.client_slug as string | null) ?? null;
  const contactName = (contact.profile_name as string | null) ?? null;
  const policy = parseConversationPolicy(data.metadata, {
    clientSlug,
    contactName,
  });

  return {
    agentKey: (data.agent_key as string | null) ?? CUSTOMER_AGENT_KEY,
    approvalRequestedAt: policy.approvalRequestedAt,
    accessStatus: policy.accessStatus,
    chatKind: policy.chatKind,
    clientSlug,
    contactName,
    discordChannelName: (data.discord_channel_name as string | null) ?? null,
    discordThreadId: (data.discord_thread_id as string | null) ?? null,
    displayPhoneNumber:
      (account.display_phone_number as string | null) ??
      (account.phone_number_id as string | null) ??
      null,
    groupPolicy: policy.groupPolicy,
    id: data.id as string,
    mode: data.mode as string,
    status: data.status as string,
    waId: (contact.wa_id as string | null) ?? "unknown",
  };
}

async function loadConversationMessages(
  conversationId: string,
  messageId: string | null,
): Promise<ConversationMessage[]> {
  const supabase = getServiceSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured for the agent runtime.");
  }

  const { data, error } = await supabase
    .from("whatsapp_messages")
    .select(
      "id, message_id, direction, message_type, metadata, mirrored_to_discord_at, received_at, sent_at, status, text_body, triaged_at",
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    throw new Error(`[whatsapp-agent] message lookup failed: ${error.message}`);
  }

  const rows = ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    direction: (row.direction as string | null) ?? "system",
    id: row.id as string,
    messageId: row.message_id as string,
    messageType: (row.message_type as string | null) ?? "unknown",
    metadata: parseRecord(row.metadata),
    mirroredToDiscordAt: (row.mirrored_to_discord_at as string | null) ?? null,
    receivedAt: (row.received_at as string | null) ?? null,
    sentAt: (row.sent_at as string | null) ?? null,
    status: (row.status as string | null) ?? "received",
    textBody: (row.text_body as string | null) ?? null,
    triagedAt: (row.triaged_at as string | null) ?? null,
  })) satisfies ConversationMessage[];

  const ordered = rows.slice().reverse();

  if (!messageId) return ordered;

  const latestIndex = ordered.findIndex((row) => row.messageId === messageId);
  if (latestIndex === -1) return ordered;

  return ordered.slice(Math.max(0, latestIndex - 7), latestIndex + 1);
}

async function updateConversationThread(
  conversationId: string,
  threadId: string,
  channelName: string,
): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("whatsapp_conversations")
    .update({
      discord_channel_name: channelName,
      discord_thread_id: threadId,
    })
    .eq("id", conversationId);

  if (error) {
    console.error("[whatsapp-agent] conversation thread update failed:", error.message);
  }
}

async function markMessageMirrored(messageRowId: string): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("whatsapp_messages")
    .update({
      mirrored_to_discord_at: new Date().toISOString(),
    })
    .eq("id", messageRowId);

  if (error) {
    console.error("[whatsapp-agent] mirror mark failed:", error.message);
  }
}

async function markMessageTriaged(messageRowId: string): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("whatsapp_messages")
    .update({
      triaged_at: new Date().toISOString(),
    })
    .eq("id", messageRowId);

  if (error) {
    console.error("[whatsapp-agent] triage mark failed:", error.message);
  }
}

async function resolveParentChannel(channelName: string): Promise<GuildTextBasedChannel | null> {
  const guild = discordClient?.guilds.cache.first();
  if (!guild) return null;

  const channel = guild.channels.cache.find(
    (candidate) => candidate.name === channelName && candidate.type === ChannelType.GuildText,
  );

  return channel && channel.isTextBased() ? channel : null;
}

async function ensureDiscordThread(
  context: ConversationContext,
): Promise<{ channelName: string; threadId: string | null }> {
  const channelName =
    context.discordChannelName ??
    channelForClientSlug(context.clientSlug) ??
    DEFAULT_CHANNEL;

  const guild = discordClient?.guilds.cache.first();
  if (!guild) {
    return { channelName, threadId: context.discordThreadId ?? null };
  }

  if (context.discordThreadId) {
    const existingThread = await discordClient?.channels.fetch(context.discordThreadId).catch(() => null);
    if (existingThread?.isThread()) {
      return { channelName, threadId: existingThread.id };
    }
  }

  const parentChannel = await resolveParentChannel(channelName);
  if (!parentChannel || !("threads" in parentChannel)) {
    return { channelName, threadId: null };
  }

  const thread = await parentChannel.threads.create({
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    name: buildThreadName(context),
    reason: `WhatsApp conversation ${context.id}`,
  });

  await updateConversationThread(context.id, thread.id, channelName);

  const intro = [
    "**WhatsApp client thread**",
    `Contact: ${context.contactName ?? context.waId}`,
    `WhatsApp: ${context.waId}`,
    `Client: ${context.clientSlug ?? "unassigned"}`,
    `Mode: ${context.mode}`,
  ].join("\n");

  await sendAsAgent(CUSTOMER_AGENT_KEY, channelName, {
    content: intro,
    threadId: thread.id,
  }).catch(() => {});

  return { channelName, threadId: thread.id };
}

async function mirrorInboundMessage(
  context: ConversationContext,
  latestInbound: ConversationMessage,
  channelName: string,
  threadId: string | null,
): Promise<void> {
  if (latestInbound.mirroredToDiscordAt) return;

  const speaker = inboundSpeakerLabel(latestInbound);
  const heading =
    context.chatKind === "group"
      ? `**Group message in ${context.contactName ?? context.waId} from ${speaker}**`
      : `**Customer message from ${context.contactName ?? context.waId}**`;
  const content = [
    heading,
    latestInbound.textBody ?? `[${latestInbound.messageType}]`,
  ].join("\n");

  await sendAsAgent(CUSTOMER_AGENT_KEY, channelName, threadId ? { content, threadId } : content).catch(() => {});
  await markMessageMirrored(latestInbound.id);
}

async function notifyApprovalBlock(
  context: ConversationContext,
  latestInbound: ConversationMessage,
  channelName: string,
  threadId: string | null,
): Promise<string> {
  const refreshed = await requestConversationApproval(context.id);
  const ownerMentions = (process.env.DISCORD_OWNER_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => `<@${id}>`)
    .join(" ");

  const approvalSummary = formatConversationApprovalSummary(refreshed);
  const instructions = `Use \`!whatsapp allow ${context.id}\` or \`!whatsapp deny ${context.id}\` in #${WHATSAPP_BOSS_CHANNEL}.`;

  if (!context.approvalRequestedAt) {
    const bossText = [
      ownerMentions,
      `WhatsApp ${approvalSummary} needs owner approval before the agent can act.`,
      `Conversation: ${context.id}`,
      `Latest message: "${(latestInbound.textBody ?? `[${latestInbound.messageType}]`).slice(0, 240)}"`,
      instructions,
    ]
      .filter(Boolean)
      .join("\n");

    await sendAsAgent("boss", WHATSAPP_BOSS_CHANNEL, bossText).catch(() => {});
  }

  const statusText =
    refreshed.policy.accessStatus === "denied"
      ? "Blocked. Jaime denied this chat."
      : "Blocked pending Jaime approval.";

  await sendAsAgent(
    CUSTOMER_AGENT_KEY,
    channelName,
    threadId
      ? {
          content: `**Internal triage**\n${statusText}\n${instructions}`,
          threadId,
        }
      : `**Internal triage**\n${statusText}\n${instructions}`,
  ).catch(() => {});

  return `${statusText} ${instructions}`;
}

async function routeOwnerControlMessage(
  context: ConversationContext,
  latestInbound: ConversationMessage,
): Promise<string> {
  const ownerCommand = parseOwnerControlMessage(latestInbound.textBody);
  if (!ownerCommand || !isOwnerWhatsAppNumber(context.waId)) {
    return "";
  }

  const ownerLabel = context.contactName ?? context.waId;
  const bossText = [
    `Owner WhatsApp control message from ${ownerLabel}.`,
    `Owner number: ${context.waId}`,
    `Customer mapping: ${context.clientSlug ?? "unassigned"}`,
    `Conversation: ${context.id}`,
    `Command: ${ownerCommand}`,
    "Treat this as Jaime owner instruction, not as customer-facing client chat.",
  ].join("\n");

  await sendAsAgent("boss", WHATSAPP_BOSS_CHANNEL, bossText).catch(() => {});

  await markMessageTriaged(latestInbound.id);
  return `Owner control message routed to Boss from ${context.waId}.`;
}

function shouldGateConversation(
  context: ConversationContext,
  latestInbound: ConversationMessage,
): { allowed: boolean; reason: string | null } {
  if (context.accessStatus !== "approved") {
    return {
      allowed: false,
      reason: context.accessStatus === "denied" ? "denied" : "pending-approval",
    };
  }

  if (context.chatKind === "group" && !shouldWakeApprovedGroup(
    {
      accessStatus: context.accessStatus,
      approvalRequestedAt: context.approvalRequestedAt,
      chatKind: context.chatKind,
      company: context.clientSlug,
      groupPolicy: context.groupPolicy,
      label: context.contactName,
      metadata: {},
    },
    latestInbound.textBody,
    latestInbound.metadata ?? null,
  )) {
    return {
      allowed: false,
      reason: "group-mention-only",
    };
  }

  return { allowed: true, reason: null };
}

function buildTriagePrompt(
  context: ConversationContext,
  latestInbound: ConversationMessage,
  transcript: string,
): string {
  return [
    "You are handling an internal WhatsApp client-liaison triage task.",
    `Conversation id: ${context.id}`,
    `Client slug: ${context.clientSlug ?? "unassigned"}`,
    `Contact: ${context.contactName ?? context.waId}`,
    `Owner number: ${context.displayPhoneNumber ?? "unknown"}`,
    `Mode: ${context.mode}`,
    `Status: ${context.status}`,
    "",
    "Latest inbound message:",
    latestInbound.textBody ?? `[${latestInbound.messageType}]`,
    "",
    "Recent conversation transcript:",
    transcript || "No prior transcript.",
    "",
    "Decide the safest internal next step.",
    "If another Discord lane should act, emit a structured JSON handoff or channel-message block.",
    "If you already have a final customer-safe reply and the conversation mode allows it, emit a WhatsApp send block:",
    '{"whatsapp":{"conversationId":"<conversation-id>","replyToMessageId":"<latest-message-id>","message":"Final customer-safe reply","approved":true}}',
    "Do not claim anything was sent to the customer unless you emit the real WhatsApp send block or a real internal handoff block.",
  ].join("\n");
}

function isApprovedLiveDirectConversation(context: ConversationContext): boolean {
  return (
    context.chatKind === "direct" &&
    context.accessStatus === "approved" &&
    context.mode === "live"
  );
}

function buildSimpleDirectReply(text: string | null | undefined): string | null {
  const normalized = (text ?? "").trim().toLowerCase();
  if (!normalized) return null;

  if (SIMPLE_DIRECT_TEST_PATTERN.test(normalized)) {
    return "Received your WhatsApp test. The Outlet WhatsApp agent is live on this chat now.";
  }

  if (["hi", "hello", "hey", "hola", "buenas"].includes(normalized)) {
    return "Hi. I got your message. How can I help?";
  }

  return null;
}

async function maybeHandleSimpleDirectMessage(
  context: ConversationContext,
  latestInbound: ConversationMessage,
  channelName: string,
  threadId: string | null,
): Promise<string | null> {
  if (!isApprovedLiveDirectConversation(context)) {
    return null;
  }

  const reply = buildSimpleDirectReply(latestInbound.textBody);
  if (!reply) {
    return null;
  }

  await sendWhatsAppMessage({
    approved: true,
    body: reply,
    conversationId: context.id,
    replyToMessageId: latestInbound.messageId,
  });

  await sendAsAgent(
    CUSTOMER_AGENT_KEY,
    channelName,
    threadId
      ? {
          content: `**Internal triage**\nSent direct WhatsApp reply.\n\n_${reply}_`,
          threadId,
        }
      : `**Internal triage**\nSent direct WhatsApp reply.\n\n_${reply}_`,
  ).catch(() => {});

  await markMessageTriaged(latestInbound.id);
  return reply;
}

export async function processWhatsAppTask(task: ExternalTaskRow): Promise<string> {
  if (task.action !== "triage-conversation") {
    return `Ignored unsupported WhatsApp task action: ${task.action}`;
  }

  const conversationId = getConversationId(task);
  const focusMessageId = getMessageId(task);

  return await withResourceLocks(task.id, [`whatsapp-conversation:${conversationId}`], async () => {
    const context = await loadConversationContext(conversationId);
    const messages = await loadConversationMessages(conversationId, focusMessageId);
    const latestInbound = [...messages]
      .reverse()
      .find((message) => message.direction === "inbound");

    if (!latestInbound) {
      return `No inbound WhatsApp message found for conversation ${conversationId}.`;
    }

    const ownerControlResult = await routeOwnerControlMessage(context, latestInbound);
    if (ownerControlResult) {
      return ownerControlResult;
    }

    const { channelName, threadId } = await ensureDiscordThread(context);
    await mirrorInboundMessage(context, latestInbound, channelName, threadId);

    const simpleDirectResult = await maybeHandleSimpleDirectMessage(
      context,
      latestInbound,
      channelName,
      threadId,
    );
    if (simpleDirectResult) {
      return `Sent direct WhatsApp reply for conversation ${conversationId}.`;
    }

    const gate = shouldGateConversation(context, latestInbound);
    if (!gate.allowed) {
      if (gate.reason === "group-mention-only") {
        await sendAsAgent(
          CUSTOMER_AGENT_KEY,
          channelName,
          threadId
            ? {
                content: "**Internal triage**\nIgnoring group chatter until the agent is explicitly mentioned.",
                threadId,
              }
            : "**Internal triage**\nIgnoring group chatter until the agent is explicitly mentioned.",
        ).catch(() => {});
        await markMessageTriaged(latestInbound.id);
        return `Ignored non-mention chatter in approved group conversation ${conversationId}.`;
      }

      const blocked = await notifyApprovalBlock(context, latestInbound, channelName, threadId);
      await markMessageTriaged(latestInbound.id);
      return blocked;
    }

    if (latestInbound.triagedAt) {
      return `Conversation ${conversationId} was already triaged.`;
    }

    const prompt = buildTriagePrompt(context, latestInbound, formatTranscript(messages));
    const result = await runClaude({
      maxTurns: 15,
      prompt,
      systemPromptName: task.to_agent || CUSTOMER_AGENT_KEY,
    });

    let responseText = result.text || "No triage summary generated.";
    const actionNotes: string[] = [];
    const routingContext = {
      clientSlug: context.clientSlug ?? undefined,
      conversationId,
      messageId: latestInbound.messageId,
      replyToMessageId: latestInbound.messageId,
      toWaId: context.waId,
    };

    const whatsappSends = await processWhatsAppSends(responseText, "clients", {
      inheritedParams: routingContext,
    });
    responseText = whatsappSends.cleanText;
    if (whatsappSends.sent > 0) {
      actionNotes.push(
        `Sent ${whatsappSends.sent} WhatsApp message${whatsappSends.sent === 1 ? "" : "s"}.`,
      );
    }
    if (whatsappSends.errors.length > 0) {
      actionNotes.push(`WhatsApp send failed: ${whatsappSends.errors.join(" | ")}`.slice(0, 500));
    }

    if (discordClient) {
      const channelMessages = await processChannelMessages(discordClient, responseText, "clients", 0, {
        inheritedParams: routingContext,
      });
      responseText = channelMessages.cleanText;
      if (channelMessages.posted > 0) {
        actionNotes.push(
          `Posted to ${channelMessages.targets.map((target) => `#${target}`).join(", ")}.`,
        );
      }
      if (channelMessages.handedOff > 0) {
        actionNotes.push(
          `Handoff queued for ${channelMessages.handoffTargets.map((target) => `#${target}`).join(", ")}.`,
        );
      }

      const delegations = await processDelegations(discordClient, responseText, "clients", 0, {
        inheritedParams: routingContext,
      });
      responseText = delegations.cleanText;
      if (delegations.delegated > 0) {
        actionNotes.push(`Queued for ${delegations.targets.map((target) => `#${target}`).join(", ")}.`);
      }
    }

    const deliveredText = [responseText.trim(), ...actionNotes.map((note) => `_${note}_`)]
      .filter(Boolean)
      .join("\n\n")
      .trim();

    if (deliveredText) {
      await sendAsAgent(CUSTOMER_AGENT_KEY, channelName, threadId
        ? { content: `**Internal triage**\n${deliveredText}`, threadId }
        : `**Internal triage**\n${deliveredText}`,
      ).catch(() => {});
    }

    await markMessageTriaged(latestInbound.id);
    return deliveredText || `Triaged WhatsApp conversation ${conversationId}.`;
  });
}
