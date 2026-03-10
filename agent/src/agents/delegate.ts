/**
 * delegate.ts -- Structured task delegation via JSON blocks.
 *
 * Replaces the regex-based @agent-name delegation system.
 * Agents output JSON blocks to delegate tasks:
 *
 * ```json
 * {"delegate": "media-buyer", "action": "check-roas", "params": {"threshold": 2.0}}
 * ```
 *
 * These blocks are parsed, stripped from display text, and enqueued
 * via queue-service for concurrent execution.
 */

import { type Client, EmbedBuilder, type TextChannel, ChannelType } from "discord.js";
import { enqueueTask, escalateTask, completeTask, failTask, setTaskExecutor, type AgentTask } from "../services/queue-service.js";
import { evaluateTier } from "../services/approval-service.js";
import { sendAsAgent } from "../services/webhook-service.js";
import { sendWhatsAppMessage } from "../services/whatsapp-runtime-service.js";
import { runClaude } from "../runner.js";
import { getAgentForChannel } from "../discord/core/router.js";
import { notifyChannel } from "../discord/core/entry.js";
import { toErrorMessage } from "../utils/error-helpers.js";
import { WHITELISTED_CHANNELS } from "../discord/features/restructure.js";

/** Max delegations per response to prevent runaway chains */
const MAX_DELEGATIONS_PER_RESPONSE = 5;

/** Max depth for cascading delegations (A -> B -> C) */
const MAX_DELEGATION_DEPTH = 2;

interface DelegationBlock {
  delegate: string;
  action: string;
  params?: Record<string, unknown>;
  tier?: "green" | "yellow" | "red";
}

interface ChannelMessageBlock {
  channel: string;
  message: string;
  handoff?: boolean;
  tier?: "green" | "yellow" | "red";
}

interface WhatsAppSendDirective {
  approved?: boolean;
  conversationId?: string;
  message: string;
  phoneNumberId?: string;
  replyToMessageId?: string;
  toWaId?: string;
}

interface WhatsAppSendBlock {
  whatsapp: WhatsAppSendDirective;
}

interface DelegationProcessingOptions {
  inheritedParams?: Record<string, unknown>;
}

interface CustomerFacingContext {
  audience?: string;
  delivery?: string;
  disclosure?: string;
}

interface RoutingContext {
  clientSlug?: string;
  conversationId?: string;
  messageId?: string;
  phoneNumberId?: string;
  replyToMessageId?: string;
  toWaId?: string;
}

const CHANNEL_ALIASES: Record<string, string> = {
  "calendar": "meetings",
  "meeting": "meetings",
  "meeting-agent": "meetings",
  "hq-dashboard": "dashboard",
  "performance": "dashboard",
  "alerts": "agent-feed",
  "logs": "agent-feed",
  "email-logs": "email-log",
  "active-jobs": "agent-feed",
  "agent-alerts": "agent-feed",
  "agent-logs": "agent-feed",
  "bot-logs": "agent-feed",
  "meta-api": "media-buyer",
};

/** Agent names that can receive delegations, mapped to channel names */
const DELEGATE_TARGETS: Record<string, string> = {
  "boss": "boss",
  "growth-supervisor": "growth",
  "growth": "growth",
  "tiktok-supervisor": "tiktok-ops",
  "tiktok-ops": "tiktok-ops",
  "content-finder": "content-lab",
  "content-lab": "content-lab",
  "lead-qualifier": "lead-inbox",
  "lead-inbox": "lead-inbox",
  "publisher-tiktok": "tiktok-publish",
  "tiktok-publish": "tiktok-publish",
  "media-buyer": "media-buyer",
  "tm-agent": "tm-data",
  "tm-data": "tm-data",
  "don-omar-agent": "don-omar-tickets",
  "don-omar-tickets": "don-omar-tickets",
  "creative": "creative",
  "creative-agent": "creative",
  "reporting": "dashboard",
  "reporting-agent": "dashboard",
  "client-manager": "zamora",
  "email-agent": "email",
  "email": "email",
  "meeting-agent": "meetings",
  "meetings": "meetings",
  "calendar": "meetings",
  "customer-whatsapp-agent": "clients",
  "clients": "clients",
  "zamora": "zamora",
  "kybba": "kybba",
};

const CHANNEL_HANDOFF_TARGETS: Record<string, string> = {
  "boss": "boss",
  "growth": "growth-supervisor",
  "tiktok-ops": "tiktok-supervisor",
  "content-lab": "content-finder",
  "lead-inbox": "lead-qualifier",
  "tiktok-publish": "publisher-tiktok",
  "media-buyer": "media-buyer",
  "tm-data": "tm-agent",
  "don-omar-tickets": "don-omar-agent",
  "creative": "creative",
  "dashboard": "reporting",
  "clients": "customer-whatsapp-agent",
  "zamora": "client-manager",
  "kybba": "client-manager",
  "email": "email-agent",
  "meetings": "meeting-agent",
};

const CUSTOMER_FACING_SOURCE_CHANNELS = new Set(["clients"]);
const TASK_RUNTIME_SOURCE_CHANNEL_KEY = "_queueSourceChannel";
const TASK_RUNTIME_DEPTH_KEY = "_queueDepth";
const TASK_RUNTIME_NOTIFY_SOURCE_KEY = "_queueNotifySource";

function stripTaskRuntimeParams(params: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([key]) =>
        key !== TASK_RUNTIME_SOURCE_CHANNEL_KEY &&
        key !== TASK_RUNTIME_DEPTH_KEY &&
        key !== TASK_RUNTIME_NOTIFY_SOURCE_KEY,
    ),
  );
}

function attachTaskRuntimeParams(
  params: Record<string, unknown>,
  sourceChannel: string,
  depth: number,
  notifySource = true,
): Record<string, unknown> {
  return {
    ...params,
    [TASK_RUNTIME_SOURCE_CHANNEL_KEY]: sourceChannel,
    [TASK_RUNTIME_DEPTH_KEY]: depth,
    [TASK_RUNTIME_NOTIFY_SOURCE_KEY]: notifySource,
  };
}

function getTaskSourceChannel(params: Record<string, unknown>): string {
  return typeof params[TASK_RUNTIME_SOURCE_CHANNEL_KEY] === "string"
    ? (params[TASK_RUNTIME_SOURCE_CHANNEL_KEY] as string)
    : "boss";
}

function getTaskDepth(params: Record<string, unknown>): number {
  const value = params[TASK_RUNTIME_DEPTH_KEY];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function shouldNotifyTaskSource(params: Record<string, unknown>): boolean {
  const value = params[TASK_RUNTIME_NOTIFY_SOURCE_KEY];
  return typeof value === "boolean" ? value : true;
}

/**
 * Find inline JSON objects containing "delegate" and "action" keys using
 * balanced-braces walking. Handles nested objects that a flat regex cannot.
 */
function findInlineJsonBlocks(text: string): { match: string; index: number }[] {
  const results: { match: string; index: number }[] = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "{") {
      let depth = 1;
      let j = i + 1;
      while (j < text.length && depth > 0) {
        if (text[j] === "{") depth++;
        else if (text[j] === "}") depth--;
        j++;
      }
      if (depth === 0) {
        results.push({ match: text.slice(i, j), index: i });
        i = j;
        continue;
      }
    }
    i++;
  }
  return results;
}

function normalizeChannelName(value: string): string {
  const normalized = value.trim().replace(/^#/, "").toLowerCase();
  return CHANNEL_ALIASES[normalized] ?? normalized;
}

function getReplyChannel(params: Record<string, unknown>): string | null {
  const raw = typeof params.replyChannel === "string"
    ? params.replyChannel
    : typeof params.reply_channel === "string"
    ? params.reply_channel
    : null;

  if (!raw) return null;
  const normalized = normalizeChannelName(raw);
  return WHITELISTED_CHANNELS.has(normalized) ? normalized : null;
}

function extractCustomerFacingContext(
  params?: Record<string, unknown> | null,
): CustomerFacingContext | null {
  if (!params) return null;

  const audience = typeof params.audience === "string" ? params.audience : undefined;
  const delivery = typeof params.delivery === "string" ? params.delivery : undefined;
  const disclosure = typeof params.disclosure === "string" ? params.disclosure : undefined;

  if (!audience && !delivery && !disclosure) return null;
  return { audience, delivery, disclosure };
}

function isCustomerFacingFlow(
  sourceChannel: string,
  params?: Record<string, unknown> | null,
  inheritedParams?: Record<string, unknown> | null,
): boolean {
  return (
    CUSTOMER_FACING_SOURCE_CHANNELS.has(sourceChannel) ||
    extractCustomerFacingContext(params) !== null ||
    extractCustomerFacingContext(inheritedParams) !== null
  );
}

function applyCustomerFacingContext(
  sourceChannel: string,
  params: Record<string, unknown>,
  inheritedParams?: Record<string, unknown> | null,
): Record<string, unknown> {
  const mergedParams = applyInheritedRoutingContext(params, inheritedParams);

  if (!isCustomerFacingFlow(sourceChannel, params, inheritedParams)) {
    return mergedParams;
  }

  const inheritedContext = extractCustomerFacingContext(inheritedParams);
  const currentContext = extractCustomerFacingContext(params);

  return {
    ...mergedParams,
    audience: currentContext?.audience ?? inheritedContext?.audience ?? "customer",
    delivery: currentContext?.delivery ?? inheritedContext?.delivery ?? "whatsapp",
    disclosure: currentContext?.disclosure ?? inheritedContext?.disclosure ?? "safe",
  };
}

function extractRoutingContext(
  params?: Record<string, unknown> | null,
): RoutingContext | null {
  if (!params) return null;

  const context: RoutingContext = {};

  const conversationId = stringParam(params.conversationId);
  if (conversationId) context.conversationId = conversationId;

  const messageId = stringParam(params.messageId);
  if (messageId) context.messageId = messageId;

  const replyToMessageId = stringParam(params.replyToMessageId);
  if (replyToMessageId) context.replyToMessageId = replyToMessageId;

  const toWaId = stringParam(params.toWaId);
  if (toWaId) context.toWaId = toWaId;

  const phoneNumberId = stringParam(params.phoneNumberId);
  if (phoneNumberId) context.phoneNumberId = phoneNumberId;

  const clientSlug = stringParam(params.clientSlug);
  if (clientSlug) context.clientSlug = clientSlug;

  return Object.keys(context).length > 0 ? context : null;
}

function applyInheritedRoutingContext(
  params: Record<string, unknown>,
  inheritedParams?: Record<string, unknown> | null,
): Record<string, unknown> {
  const inheritedContext = extractRoutingContext(inheritedParams);
  if (!inheritedContext) return params;

  return {
    ...inheritedContext,
    ...params,
  };
}

function buildDelegatedTaskPrompt(task: AgentTask): string {
  const visibleParams = stripTaskRuntimeParams(task.params);
  const lines = [
    `[DELEGATED TASK from ${task.from}]`,
    `Action: ${task.action}`,
    `Parameters: ${JSON.stringify(visibleParams)}`,
  ];

  const context = extractCustomerFacingContext(visibleParams);
  if (context?.audience === "customer" || context?.delivery === "whatsapp") {
    lines.push(
      "Delivery context: this work feeds a client-facing WhatsApp response. Return only the customer-safe slice and avoid internal campaign structure, targeting, bid strategy, thresholds, or operator-only reasoning.",
    );
  }

  return lines.join("\n");
}

/**
 * Parse JSON delegation blocks from Claude output.
 * Looks for ```json blocks containing a "delegate" key.
 */
export function parseDelegationBlocks(text: string): { blocks: DelegationBlock[]; cleanText: string } {
  const blocks: DelegationBlock[] = [];
  let cleanText = text;

  // Match fenced JSON code blocks
  const fencedPattern = /```json\s*\n?\s*(\{[^`]*?"delegate"[^`]*?\})\s*\n?\s*```/g;
  let match: RegExpExecArray | null;

  while ((match = fencedPattern.exec(text)) !== null) {
    try {
      const raw: unknown = JSON.parse(match[1]);
      if (raw && typeof raw === "object" && "delegate" in raw && "action" in raw) {
        const parsed = raw as DelegationBlock;
        blocks.push(parsed);
        cleanText = cleanText.replace(match[0], "").trim();
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Also match inline JSON (no fences) as fallback, using balanced-braces walker
  for (const hit of findInlineJsonBlocks(cleanText)) {
    try {
      const raw: unknown = JSON.parse(hit.match);
      if (raw && typeof raw === "object" && "delegate" in raw && "action" in raw) {
        const parsed = raw as DelegationBlock;
        if (!blocks.some(b => b.delegate === parsed.delegate && b.action === parsed.action)) {
          blocks.push(parsed);
          cleanText = cleanText.replace(hit.match, "").trim();
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Clean up extra newlines left by removal
  cleanText = cleanText.replace(/\n{3,}/g, "\n\n").trim();

  return { blocks: blocks.slice(0, MAX_DELEGATIONS_PER_RESPONSE), cleanText };
}

/**
 * Parse fenced or inline JSON channel-message blocks from Claude output.
 */
export function parseChannelMessageBlocks(text: string): {
  blocks: ChannelMessageBlock[];
  cleanText: string;
} {
  const blocks: ChannelMessageBlock[] = [];
  let cleanText = text;

  const fencedPattern = /```json\s*\n?\s*(\{[^`]*?"channel"[^`]*?"message"[^`]*?\})\s*\n?\s*```/g;
  let match: RegExpExecArray | null;

  while ((match = fencedPattern.exec(text)) !== null) {
    try {
      const raw: unknown = JSON.parse(match[1]);
      if (raw && typeof raw === "object" && "channel" in raw && "message" in raw) {
        const parsed = raw as ChannelMessageBlock;
        blocks.push(parsed);
        cleanText = cleanText.replace(match[0], "").trim();
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  for (const hit of findInlineJsonBlocks(cleanText)) {
    try {
      const raw: unknown = JSON.parse(hit.match);
      if (raw && typeof raw === "object" && "channel" in raw && "message" in raw) {
        const parsed = raw as ChannelMessageBlock;
        if (!blocks.some((block) => block.channel === parsed.channel && block.message === parsed.message)) {
          blocks.push(parsed);
          cleanText = cleanText.replace(hit.match, "").trim();
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  cleanText = cleanText.replace(/\n{3,}/g, "\n\n").trim();

  return { blocks: blocks.slice(0, MAX_DELEGATIONS_PER_RESPONSE), cleanText };
}

export function parseWhatsAppSendBlocks(text: string): {
  blocks: WhatsAppSendBlock[];
  cleanText: string;
} {
  const blocks: WhatsAppSendBlock[] = [];
  let cleanText = text;

  const fencedPattern = /```json\s*\n?\s*(\{[^`]*?"whatsapp"[^`]*?\})\s*\n?\s*```/g;
  let match: RegExpExecArray | null;

  while ((match = fencedPattern.exec(text)) !== null) {
    try {
      const raw: unknown = JSON.parse(match[1]);
      if (raw && typeof raw === "object" && "whatsapp" in raw) {
        const parsed = raw as WhatsAppSendBlock;
        blocks.push(parsed);
        cleanText = cleanText.replace(match[0], "").trim();
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  for (const hit of findInlineJsonBlocks(cleanText)) {
    try {
      const raw: unknown = JSON.parse(hit.match);
      if (raw && typeof raw === "object" && "whatsapp" in raw) {
        const parsed = raw as WhatsAppSendBlock;
        const signature = JSON.stringify(parsed.whatsapp);
        if (!blocks.some((block) => JSON.stringify(block.whatsapp) === signature)) {
          blocks.push(parsed);
          cleanText = cleanText.replace(hit.match, "").trim();
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  cleanText = cleanText.replace(/\n{3,}/g, "\n\n").trim();

  return { blocks: blocks.slice(0, MAX_DELEGATIONS_PER_RESPONSE), cleanText };
}

function stringParam(
  value: unknown,
): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function resolveWhatsAppDirective(
  block: WhatsAppSendBlock,
  inheritedParams?: Record<string, unknown> | null,
): WhatsAppSendDirective {
  const payload = block.whatsapp ?? ({} as WhatsAppSendDirective);

  return {
    approved:
      typeof payload.approved === "boolean"
        ? payload.approved
        : typeof inheritedParams?.approved === "boolean"
        ? inheritedParams.approved
        : undefined,
    conversationId:
      stringParam(payload.conversationId) ??
      stringParam(inheritedParams?.conversationId),
    message: payload.message,
    phoneNumberId:
      stringParam(payload.phoneNumberId) ??
      stringParam(inheritedParams?.phoneNumberId),
    replyToMessageId:
      stringParam(payload.replyToMessageId) ??
      stringParam(inheritedParams?.replyToMessageId) ??
      stringParam(inheritedParams?.messageId),
    toWaId:
      stringParam(payload.toWaId) ??
      stringParam(inheritedParams?.toWaId),
  };
}

export async function processWhatsAppSends(
  agentResponse: string,
  sourceChannel: string = "clients",
  options?: DelegationProcessingOptions,
): Promise<{
  cleanText: string;
  errors: string[];
  sent: number;
}> {
  const { blocks, cleanText } = parseWhatsAppSendBlocks(agentResponse);
  if (blocks.length === 0) {
    return { cleanText: agentResponse, errors: [], sent: 0 };
  }

  const errors: string[] = [];
  let sent = 0;

  for (const block of blocks) {
    try {
      const resolved = resolveWhatsAppDirective(block, options?.inheritedParams);
      const message = resolved.message?.trim();
      if (!message) {
        throw new Error("WhatsApp send block is missing a message.");
      }

      if (!resolved.conversationId && !(resolved.phoneNumberId && resolved.toWaId)) {
        throw new Error(
          "WhatsApp send block requires conversationId or both phoneNumberId and toWaId.",
        );
      }

      await sendWhatsAppMessage({
        approved: resolved.approved,
        body: message,
        conversationId: resolved.conversationId,
        phoneNumberId: resolved.phoneNumberId,
        replyToMessageId: resolved.replyToMessageId,
        toWaId: resolved.toWaId,
      });
      sent += 1;
    } catch (error) {
      const message = toErrorMessage(error);
      errors.push(message);
      console.error(`[whatsapp-send] ${sourceChannel}:`, message);
    }
  }

  return { cleanText, errors, sent };
}

/**
 * Process delegation blocks from an agent response.
 * Enqueues tasks via queue-service, posts notifications.
 */
export async function processDelegations(
  client: Client,
  agentResponse: string,
  sourceChannel: string = "boss",
  depth: number = 0,
  options?: DelegationProcessingOptions,
): Promise<{ cleanText: string; delegated: number; targets: string[] }> {
  if (depth >= MAX_DELEGATION_DEPTH) {
    return { cleanText: agentResponse, delegated: 0, targets: [] };
  }

  const { blocks, cleanText } = parseDelegationBlocks(agentResponse);
  if (blocks.length === 0) {
    return { cleanText: agentResponse, delegated: 0, targets: [] };
  }

  // Determine source agent from channel
  const sourceAgent = getAgentForChannel(sourceChannel);
  const fromAgent = sourceAgent.promptFile;

  const guild = client.guilds.cache.first();

  const delegatedTargets: string[] = [];

  for (const block of blocks) {
    const targetChannel = DELEGATE_TARGETS[block.delegate];
    if (!targetChannel) {
      console.warn(`[delegate] Unknown target: ${block.delegate}`);
      continue;
    }

    // Don't delegate to self
    if (targetChannel === sourceChannel) continue;
    delegatedTargets.push(targetChannel);

    const tier = block.tier ?? "green";
    const taskParams = applyCustomerFacingContext(
      sourceChannel,
      block.params ?? {},
      options?.inheritedParams,
    );
    const queuedParams = attachTaskRuntimeParams(taskParams, sourceChannel, depth, true);

    // Evaluate tier BEFORE enqueue to prevent race condition
    const preTask = {
      id: "",
      from: fromAgent,
      to: block.delegate,
      action: block.action,
      params: queuedParams,
      tier,
      status: "pending" as const,
      createdAt: new Date(),
    };
    const decision = evaluateTier(preTask);

    let task: ReturnType<typeof enqueueTask>;
    if (decision === "execute") {
      task = enqueueTask(fromAgent, block.delegate, block.action, queuedParams, "green");
    } else {
      task = enqueueTask(fromAgent, block.delegate, block.action, queuedParams, tier);
      escalateTask(task.id);
    }

    // Post delegation notification to target channel
    if (guild) {
      const channel = guild.channels.cache.find(
        c => c.name === targetChannel && c.type === ChannelType.GuildText
      ) as TextChannel | undefined;

      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle("Delegated Task")
          .setColor(tier === "red" ? 0xf44336 : tier === "yellow" ? 0xffa726 : 0x4caf50)
          .addFields(
            { name: "From", value: fromAgent, inline: true },
            { name: "Action", value: block.action, inline: true },
            { name: "Tier", value: tier.toUpperCase(), inline: true },
          )
          .setDescription(
            JSON.stringify(stripTaskRuntimeParams(queuedParams), null, 2).slice(0, 1000)
          )
          .setFooter({ text: `Task: ${task.id}` })
          .setTimestamp();

        await sendAsAgent(fromAgent, targetChannel, { embeds: [embed] }).catch((e) => {
          console.warn("[delegate] sendAsAgent failed:", toErrorMessage(e));
          channel.send({ embeds: [embed] }).catch((e2) => console.warn("[delegate] channel.send failed:", toErrorMessage(e2)));
        });
      }
    }

  }

  // Notify agent-feed (only if we actually delegated something)
  if (delegatedTargets.length > 0) {
    const targets = delegatedTargets.join(", ");
    await notifyChannel("agent-feed", `**${fromAgent}** delegated ${delegatedTargets.length} task(s) to: ${targets}`);
  }

  return { cleanText, delegated: blocks.length, targets: delegatedTargets };
}

/**
 * Process channel-message blocks from an agent response.
 * Posts the message into the requested Discord channel as the source agent.
 */
export async function processChannelMessages(
  client: Client,
  agentResponse: string,
  sourceChannel: string = "boss",
  depth: number = 0,
  options?: DelegationProcessingOptions,
): Promise<{
  cleanText: string;
  posted: number;
  targets: string[];
  handedOff: number;
  handoffTargets: string[];
}> {
  const { blocks, cleanText } = parseChannelMessageBlocks(agentResponse);
  if (blocks.length === 0) {
    return {
      cleanText: agentResponse,
      posted: 0,
      targets: [],
      handedOff: 0,
      handoffTargets: [],
    };
  }

  if (!client.guilds.cache.first()) {
    return { cleanText, posted: 0, targets: [], handedOff: 0, handoffTargets: [] };
  }

  const sourceAgent = getAgentForChannel(sourceChannel);
  const fromAgent = sourceAgent.promptFile;
  const postedTargets: string[] = [];
  const handoffTargets: string[] = [];

  for (const block of blocks) {
    const targetChannel = normalizeChannelName(block.channel);
    if (!WHITELISTED_CHANNELS.has(targetChannel)) {
      console.warn(`[channel-action] Unknown target channel: ${block.channel}`);
      continue;
    }

    await sendAsAgent(fromAgent, targetChannel, block.message).catch(async () => {
      await notifyChannel(targetChannel, block.message);
    });
    postedTargets.push(targetChannel);

    if (block.handoff) {
      if (depth >= MAX_DELEGATION_DEPTH) {
        console.warn(`[channel-action] Max handoff depth reached for #${targetChannel}`);
        continue;
      }

      const delegateTarget = CHANNEL_HANDOFF_TARGETS[targetChannel];
      if (!delegateTarget) {
        console.warn(`[channel-action] No handoff target for channel: ${targetChannel}`);
        continue;
      }

      if (targetChannel === sourceChannel) {
        console.warn(`[channel-action] Ignoring self-handoff for #${targetChannel}`);
        continue;
      }

      const tier = block.tier ?? "green";
      const handoffParams = applyCustomerFacingContext(
        sourceChannel,
        {
          message: block.message,
          sourceChannel,
          targetChannel,
        },
        options?.inheritedParams,
      );
      const queuedParams = attachTaskRuntimeParams(handoffParams, sourceChannel, depth, false);

      const preTask = {
        id: "",
        from: fromAgent,
        to: delegateTarget,
        action: "channel-handoff",
        params: queuedParams,
        tier,
        status: "pending" as const,
        createdAt: new Date(),
      };
      const decision = evaluateTier(preTask);

      if (decision === "execute") {
        enqueueTask(fromAgent, delegateTarget, "channel-handoff", queuedParams, "green");
      } else {
        const task = enqueueTask(fromAgent, delegateTarget, "channel-handoff", queuedParams, tier);
        escalateTask(task.id);
      }

      handoffTargets.push(targetChannel);
    }
  }

  return {
    cleanText,
    posted: postedTargets.length,
    targets: postedTargets,
    handedOff: handoffTargets.length,
    handoffTargets,
  };
}

/**
 * Execute a delegated task by running Claude with the target agent's prompt.
 */
export async function executeAgentTask(
  client: Client,
  task: AgentTask,
  sourceChannel: string,
  depth: number,
  options?: {
    notifySource?: boolean;
  },
): Promise<string> {
  const targetChannel = DELEGATE_TARGETS[task.to];
  if (!targetChannel) {
    failTask(task.id, `Unknown target agent: ${task.to}`);
    throw new Error(`Unknown target agent: ${task.to}`);
  }

  const agent = getAgentForChannel(targetChannel);

  try {
    if (task.action === "scheduled-copy-swap") {
      const { executeScheduledCopySwap } = await import("../services/meta-copy-swap-service.js");
      const result = await executeScheduledCopySwap(task.id, task.params);
      const deliveredText = result.text;

      completeTask(task.id, result);

      const summary = deliveredText.slice(0, 1900);
      await sendAsAgent(task.to, targetChannel, `**Task ${task.action} completed:**\n${summary}`).catch((e) => console.warn("[delegate] sendAsAgent failed:", toErrorMessage(e)));

      if (options?.notifySource !== false) {
        const shortSummary = deliveredText.slice(0, 500);
        await notifyChannel(sourceChannel, `**${task.to} completed ${task.action}:**\n${shortSummary}`);
      }

      const replyChannel = getReplyChannel(task.params);
      if (
        replyChannel &&
        replyChannel !== targetChannel &&
        (options?.notifySource === false || replyChannel !== sourceChannel)
      ) {
        const shortSummary = deliveredText.slice(0, 500);
        await notifyChannel(replyChannel, `**${task.to} completed ${task.action}:**\n${shortSummary}`);
      }

      return deliveredText;
    }

    const result = await runClaude({
      prompt: buildDelegatedTaskPrompt(task),
      systemPromptName: agent.promptFile,
      maxTurns: agent.maxTurns,
    });

    let responseText = result.text ?? "No response.";
    const actionNotes: string[] = [];

    const whatsappSends = await processWhatsAppSends(responseText, targetChannel, {
      inheritedParams: task.params,
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

    const channelMessages = await processChannelMessages(client, responseText, targetChannel, depth + 1, {
      inheritedParams: task.params,
    });
    responseText = channelMessages.cleanText;
    if (channelMessages.posted > 0) {
      const targets = channelMessages.targets.map((target) => `#${target}`).join(", ");
      actionNotes.push(`Posted to ${targets}.`);
    }
    if (channelMessages.handedOff > 0) {
      const targets = channelMessages.handoffTargets.map((target) => `#${target}`).join(", ");
      actionNotes.push(`Handoff queued for ${targets}.`);
    }

    // Check if the delegated agent also wants to delegate (recursive, depth-limited)
    const delegations = await processDelegations(client, responseText, targetChannel, depth + 1, {
      inheritedParams: task.params,
    });
    responseText = delegations.cleanText;
    if (delegations.delegated > 0) {
      const targets = delegations.targets.map((target) => `#${target}`).join(", ");
      actionNotes.push(`Queued for ${targets}.`);
    }

    const deliveredText = [responseText.trim(), ...actionNotes.map((note) => `_${note}_`)]
      .filter(Boolean)
      .join("\n\n")
      .trim() || "No response.";

    completeTask(task.id, { text: deliveredText });

    // Post result to target channel via webhook
    const summary = deliveredText.slice(0, 1900);
    await sendAsAgent(task.to, targetChannel, `**Task ${task.action} completed:**\n${summary}`).catch((e) => console.warn("[delegate] sendAsAgent failed:", toErrorMessage(e)));

    // Notify source
    if (options?.notifySource !== false) {
      const shortSummary = deliveredText.slice(0, 500);
      await notifyChannel(sourceChannel, `**${task.to} completed ${task.action}:**\n${shortSummary}`);
    }

    const replyChannel = getReplyChannel(task.params);
    if (
      replyChannel &&
      replyChannel !== targetChannel &&
      (options?.notifySource === false || replyChannel !== sourceChannel)
    ) {
      const shortSummary = deliveredText.slice(0, 500);
      await notifyChannel(replyChannel, `**${task.to} completed ${task.action}:**\n${shortSummary}`);
    }

    return deliveredText;
  } catch (err) {
    const errMsg = toErrorMessage(err);
    failTask(task.id, errMsg);
    const failureChannel = options?.notifySource === false ? targetChannel : sourceChannel;
    await notifyChannel(failureChannel, `Delegation to ${task.to} failed: ${errMsg}`);
    throw err;
  }
}

export function bindDelegationTaskExecutor(client: Client): void {
  setTaskExecutor(async (task) => {
    await executeAgentTask(client, task, getTaskSourceChannel(task.params), getTaskDepth(task.params), {
      notifySource: shouldNotifyTaskSource(task.params),
    });
  });
}
