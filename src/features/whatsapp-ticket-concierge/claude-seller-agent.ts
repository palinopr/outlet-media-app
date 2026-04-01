import {
  createSdkMcpServer,
  query,
  tool,
  type SDKAssistantMessage,
  type SDKResultMessage,
} from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase";

import {
  createConciergeRun,
  createOptionSet,
  expireOptionSet,
  getActiveOptionSetSelectionSnapshot,
  replaceActiveOptionSet,
  selectConciergeOption,
  updateRunState,
  type ActiveOptionSetSelectionSnapshot,
  type ConciergeRunInput,
  type CreateOptionSetInput,
  type ReplaceActiveOptionSetInput,
  type UpdateRunStateInput,
} from "./option-ledger";
import { resolveTicketConciergeContext } from "./context-resolver";
import { prepareStructuredConciergeSelection, runPreparedConciergeCheckout } from "./runner";
import type {
  TicketConciergeIntent,
  TicketConciergePreparedOption,
} from "./types";

const TICKET_CONCIERGE_PREFERENCE_VALUES = [
  "near_stage",
  "center_view",
  "lower_level",
  "aisle",
] as const;

const PREPARE_OPTIONS_FIELDS = {
  maxTotalCents: z.number().int().positive().nullable().optional(),
  preferences: z
    .array(z.enum(TICKET_CONCIERGE_PREFERENCE_VALUES))
    .default([]),
  quantity: z.number().int().min(1).max(8),
};
const PREPARE_OPTIONS_SCHEMA = z.object(PREPARE_OPTIONS_FIELDS);

const CHOOSE_PREPARED_OPTION_FIELDS = {
  optionOrdinal: z.union([z.literal(1), z.literal(2), z.literal(3)]),
};
const CHOOSE_PREPARED_OPTION_SCHEMA = z.object(CHOOSE_PREPARED_OPTION_FIELDS);

interface TicketConciergeConversation {
  id: string;
  metadata?: Record<string, unknown> | null;
}

interface TicketConciergeContact {
  id: string;
  profile_name: string | null;
  wa_id: string;
}

interface TicketConciergeInboundMessage {
  messageId: string;
  textBody: string | null;
}

interface PreparedOptionsToolResult {
  eventContext: Record<string, unknown>;
  intent: TicketConciergeIntent;
  options: TicketConciergePreparedOption[];
  optionSetId: string;
  runId: string;
  scenarioKey: string;
  status: "options_ready";
}

type ChoosePreparedOptionToolResult =
  | {
      checkoutUrl: string;
      status: "checkout_ready";
    }
  | {
      reason: string;
      status: "expired" | "invalid_option" | "inventory_changed" | "lookup_failed" | "no_active_options";
    };

export type TicketConciergeSellerTurnResult =
  | {
      body: string;
      kind: "text";
    }
  | {
      introText: string;
      kind: "prepared_options";
      options: TicketConciergePreparedOption[];
    };

export interface TicketConciergeSellerToolHandlers {
  choosePreparedOption: (args: z.infer<typeof CHOOSE_PREPARED_OPTION_SCHEMA>) => Promise<ChoosePreparedOptionToolResult>;
  prepareOptions: (args: z.infer<typeof PREPARE_OPTIONS_SCHEMA>) => Promise<PreparedOptionsToolResult | {
    reason: string;
    status: "needs_clarification" | "no_inventory";
  }>;
}

export interface TicketConciergeSellerAgentDeps {
  createOptionSet: (input: CreateOptionSetInput) => Promise<{
    id: string;
    options: TicketConciergePreparedOption[];
    status: string;
  }>;
  createRun: (input: ConciergeRunInput) => Promise<{ id: string } | null>;
  expireOptionSet: (optionSetId: string) => Promise<void>;
  getActiveOptionSetSelectionSnapshot: (
    conversationId: string,
  ) => Promise<ActiveOptionSetSelectionSnapshot | null>;
  prepareStructuredSelection: (input: {
    chromeDebugUrl?: string;
    conversationMetadata: Record<string, unknown>;
    intent: TicketConciergeIntent;
  }) => Promise<
    | {
        eventContext: Record<string, unknown>;
        intent: TicketConciergeIntent;
        options: TicketConciergePreparedOption[];
        scenarioKey: string;
        status: "options_ready";
      }
    | {
        eventContext: Record<string, unknown>;
        intent: TicketConciergeIntent;
        reason: string;
        scenarioKey: string;
        status: "needs_clarification" | "no_inventory";
      }
  >;
  querySellerAgent: (input: {
    prompt: string;
    resumeSessionId: string | null;
    systemPrompt: string;
    toolHandlers: TicketConciergeSellerToolHandlers;
  }) => Promise<{
    sessionId: string | null;
    text: string;
  }>;
  replaceActiveOptionSet: (input: ReplaceActiveOptionSetInput) => Promise<{
    id: string;
    options: TicketConciergePreparedOption[];
    status: string;
  }>;
  runCheckout: (input: {
    option: TicketConciergePreparedOption;
  }) => Promise<
    | {
        checkoutUrl: string;
        status: "checkout_ready";
      }
    | {
        reason: string;
        status: "inventory_changed" | "lookup_failed";
      }
  >;
  selectOption: (input: { optionId: string; optionSetId: string }) => Promise<void>;
  updateConversationMetadata: (
    conversationId: string,
    metadata: Record<string, unknown>,
  ) => Promise<void>;
  updateRunState: (input: UpdateRunStateInput) => Promise<void>;
}

const defaultDeps: TicketConciergeSellerAgentDeps = {
  createOptionSet,
  createRun: async (input) => createConciergeRun(input),
  expireOptionSet,
  getActiveOptionSetSelectionSnapshot,
  prepareStructuredSelection: prepareStructuredConciergeSelection,
  querySellerAgent: queryClaudeSellerAgent,
  replaceActiveOptionSet,
  runCheckout: async (input) => runPreparedConciergeCheckout(input),
  selectOption: selectConciergeOption,
  updateConversationMetadata: persistConversationMetadata,
  updateRunState,
};

function parseMetadataRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function getStoredClaudeSessionId(
  metadata: Record<string, unknown> | null | undefined,
): string | null {
  const seller = parseMetadataRecord(metadata?.ticketConciergeSeller);
  const sessionId = seller.claudeSessionId;
  return typeof sessionId === "string" && sessionId.trim().length > 0 ? sessionId.trim() : null;
}

function applyStoredClaudeSessionId(
  metadata: Record<string, unknown> | null | undefined,
  sessionId: string,
): Record<string, unknown> {
  const parsed = parseMetadataRecord(metadata);
  const seller = parseMetadataRecord(parsed.ticketConciergeSeller);

  return {
    ...parsed,
    ticketConciergeSeller: {
      ...seller,
      claudeSessionId: sessionId,
      updatedAt: new Date().toISOString(),
    },
  };
}

async function persistConversationMetadata(
  conversationId: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { error } = await supabaseAdmin
    .from("whatsapp_conversations")
    .update({ metadata })
    .eq("id", conversationId);

  if (error) {
    throw new Error(`[concierge] seller metadata update failed: ${error.message}`);
  }
}

function describeActiveOptions(snapshot: ActiveOptionSetSelectionSnapshot | null): string {
  if (!snapshot) {
    return "No active prepared options are currently stored for this conversation.";
  }

  return [
    `Active option set expires at ${snapshot.optionSet.expiresAt}.`,
    ...snapshot.options.map((option) => {
      const row = option.row ? `, Row ${option.row}` : "";
      return `Option ${option.ordinal}: ${option.section}${row}, ${option.totalCents} cents total, note: ${option.note}`;
    }),
  ].join("\n");
}

function buildSystemPrompt(input: {
  activeSnapshot: ActiveOptionSetSelectionSnapshot | null;
  contact: TicketConciergeContact;
  eventContext: {
    artist: string;
    city: string;
    date: string;
    eventId: string;
    eventUrl: string;
  };
}): string {
  const contactName = input.contact.profile_name?.trim() || "the customer";
  return [
    "You are Outlet Media's customer-facing WhatsApp ticket concierge.",
    `Today is April 1, 2026.`,
    `The show is ${input.eventContext.artist} in ${input.eventContext.city} on ${input.eventContext.date}.`,
    "The client/account is Zamora, but you must never call this the Zamora show.",
    `You are helping ${contactName}.`,
    "Mirror the customer's language. If they write in Spanish, answer in Spanish. If they write in English, answer in English.",
    "Use tools for any factual claim about inventory, pricing, or checkout. Never invent prices, sections, or links.",
    "Budgets are all-in after fees unless the customer explicitly says it is per person. If they say per person, multiply by the quantity before calling prepare_options.",
    "If the customer is greeting you or has not told you enough yet, ask one short helpful follow-up.",
    "If you call prepare_options, keep your reply short. Do not rewrite all three option cards. The system will attach the options and maps after your message.",
    "If choose_prepared_option reports inventory_changed, immediately call prepare_options again with the customer's latest requirements before you answer.",
    "If choose_prepared_option reports no_active_options or expired, tell the customer you can pull fresh options and then call prepare_options if you have enough information.",
    "Always tell the customer the checkout link is time-sensitive after you have a real link.",
    "Current live option state:",
    describeActiveOptions(input.activeSnapshot),
  ].join("\n");
}

function buildTurnPrompt(input: {
  messageText: string | null;
  resumeSessionId: string | null;
  activeSnapshot: ActiveOptionSetSelectionSnapshot | null;
}): string {
  const messageText = input.messageText?.trim() || "[empty message]";

  if (input.resumeSessionId && !input.activeSnapshot) {
    return [
      "[State refresh for this turn]",
      "There are currently no active prepared options.",
      "Any earlier quoted option, section, or price is expired and invalid unless you call prepare_options again on this turn.",
      "You must call prepare_options on this turn before answering.",
      "[Customer message]",
      messageText,
    ].join("\n");
  }

  return messageText;
}

function extractAssistantText(message: SDKAssistantMessage): string {
  return message.message.content
    .filter((block): block is Extract<typeof block, { type: "text" }> => block.type === "text")
    .map((block) => block.text)
    .join("");
}

function extractResultText(message: SDKResultMessage): string {
  return message.subtype === "success" ? message.result : "";
}

export async function queryClaudeSellerAgent(input: {
  prompt: string;
  resumeSessionId: string | null;
  systemPrompt: string;
  toolHandlers: TicketConciergeSellerToolHandlers;
}): Promise<{
  sessionId: string | null;
  text: string;
}> {
  const sellerTools = createSdkMcpServer({
    name: "ticket-concierge",
    version: "1.0.0",
    tools: [
      tool(
        "prepare_options",
        "Prepare up to three real live ticket options for Ricardo Arjona in Miami using all-in pricing after fees.",
        PREPARE_OPTIONS_FIELDS,
        async (args) => ({
          content: [
            {
              text: JSON.stringify(await input.toolHandlers.prepareOptions(args)),
              type: "text" as const,
            },
          ],
        }),
      ),
      tool(
        "choose_prepared_option",
        "Generate the real Ticketmaster checkout link for one of the currently prepared options by ordinal.",
        CHOOSE_PREPARED_OPTION_FIELDS,
        async (args) => ({
          content: [
            {
              text: JSON.stringify(await input.toolHandlers.choosePreparedOption(args)),
              type: "text" as const,
            },
          ],
        }),
      ),
    ],
  });

  let sessionId: string | null = null;
  let assistantText = "";
  let fallbackText = "";

  const runtime = query({
    prompt: input.prompt.trim() || "[empty message]",
    options: {
      allowDangerouslySkipPermissions: true,
      allowedTools: [
        "mcp__ticket-concierge__prepare_options",
        "mcp__ticket-concierge__choose_prepared_option",
      ],
      cwd: process.cwd(),
      maxTurns: 6,
      mcpServers: {
        "ticket-concierge": sellerTools,
      },
      permissionMode: "bypassPermissions",
      ...(input.resumeSessionId ? { resume: input.resumeSessionId } : {}),
      settingSources: ["local"],
      systemPrompt: input.systemPrompt,
    },
  });

  for await (const message of runtime) {
    sessionId = message.session_id ?? sessionId;

    if (message.type === "assistant") {
      assistantText += extractAssistantText(message);
      continue;
    }

    if (message.type === "result") {
      fallbackText = extractResultText(message);
    }
  }

  return {
    sessionId,
    text: assistantText.trim() || fallbackText.trim(),
  };
}

export async function runTicketConciergeSellerTurn(input: {
  contact: TicketConciergeContact;
  conversation: TicketConciergeConversation;
  latestInboundMessageId: string;
  message: TicketConciergeInboundMessage;
}, deps: Partial<TicketConciergeSellerAgentDeps> = {}): Promise<TicketConciergeSellerTurnResult> {
  const resolvedDeps: TicketConciergeSellerAgentDeps = {
    ...defaultDeps,
    ...deps,
  };
  const conversationMetadata = parseMetadataRecord(input.conversation.metadata);
  const resolvedContext = resolveTicketConciergeContext({
    body: input.message.textBody ?? "",
    conversationMetadata,
  });
  const storedSessionId = getStoredClaudeSessionId(conversationMetadata);
  let activeSnapshot = await resolvedDeps.getActiveOptionSetSelectionSnapshot(input.conversation.id);
  let lastCheckoutUrl: string | null = null;
  let preparedOptions: TicketConciergePreparedOption[] | null = null;

  const toolHandlers: TicketConciergeSellerToolHandlers = {
    choosePreparedOption: async ({ optionOrdinal }) => {
      const snapshot =
        activeSnapshot ??
        (await resolvedDeps.getActiveOptionSetSelectionSnapshot(input.conversation.id));
      activeSnapshot = snapshot;

      if (!snapshot) {
        return {
          reason: "no_active_options",
          status: "no_active_options",
        };
      }

      if (Date.parse(snapshot.optionSet.expiresAt) <= Date.now()) {
        await resolvedDeps.expireOptionSet(snapshot.optionSet.id);
        await resolvedDeps.updateRunState({
          lastError: null,
          latestInboundMessageId: input.latestInboundMessageId,
          runId: snapshot.run.id,
          status: "expired",
        });
        activeSnapshot = null;
        return {
          reason: "expired",
          status: "expired",
        };
      }

      const selectedOption = snapshot.options.find((option) => option.ordinal === optionOrdinal);
      if (!selectedOption) {
        return {
          reason: "invalid_option",
          status: "invalid_option",
        };
      }

      const checkout = await resolvedDeps.runCheckout({ option: selectedOption });
      if (checkout.status === "checkout_ready") {
        lastCheckoutUrl = checkout.checkoutUrl;
        await resolvedDeps.selectOption({
          optionId: selectedOption.id,
          optionSetId: snapshot.optionSet.id,
        });
        await resolvedDeps.updateRunState({
          lastCheckoutUrl: checkout.checkoutUrl,
          lastError: null,
          latestInboundMessageId: input.latestInboundMessageId,
          runId: snapshot.run.id,
          status: "checkout_ready",
        });
        return checkout;
      }

      if (checkout.status === "inventory_changed") {
        await resolvedDeps.expireOptionSet(snapshot.optionSet.id);
        await resolvedDeps.updateRunState({
          lastError: checkout.reason,
          latestInboundMessageId: input.latestInboundMessageId,
          runId: snapshot.run.id,
          status: "inventory_changed",
        });
        activeSnapshot = null;
        return checkout;
      }

      await resolvedDeps.updateRunState({
        lastError: checkout.reason,
        latestInboundMessageId: input.latestInboundMessageId,
        runId: snapshot.run.id,
        status: "lookup_failed",
      });
      return checkout;
    },
    prepareOptions: async ({ maxTotalCents, preferences, quantity }) => {
      const existingSnapshot =
        activeSnapshot ??
        (await resolvedDeps.getActiveOptionSetSelectionSnapshot(input.conversation.id));

      if (existingSnapshot) {
        await resolvedDeps.expireOptionSet(existingSnapshot.optionSet.id);
        await resolvedDeps.updateRunState({
          lastError: null,
          latestInboundMessageId: input.latestInboundMessageId,
          runId: existingSnapshot.run.id,
          status: "expired",
        });
      }

      const intent: TicketConciergeIntent = {
        maxTotalCents: maxTotalCents ?? undefined,
        preferences,
        quantity,
      };
      const prepared = await resolvedDeps.prepareStructuredSelection({
        conversationMetadata,
        intent,
      });

      if (prepared.status !== "options_ready") {
        return {
          reason: prepared.status === "no_inventory" ? prepared.reason : "needs_clarification",
          status: prepared.status,
        };
      }

      const run = await resolvedDeps.createRun({
        contactId: input.contact.id,
        conversationId: input.conversation.id,
        customerMessage: input.message.textBody ?? "",
        eventContext: prepared.eventContext,
        intent: prepared.intent,
        latestInboundMessageId: input.latestInboundMessageId,
        scenarioKey: prepared.scenarioKey,
      });

      if (!run?.id) {
        throw new Error("[concierge] seller run creation failed.");
      }

      const optionSet = existingSnapshot
        ? await resolvedDeps.replaceActiveOptionSet({
            conversationId: input.conversation.id,
            eventContext: prepared.eventContext,
            intent: prepared.intent,
            options: prepared.options,
            previousOptionSetId: existingSnapshot.optionSet.id,
            runId: run.id,
            status: "active",
          })
        : await resolvedDeps.createOptionSet({
            conversationId: input.conversation.id,
            eventContext: prepared.eventContext,
            intent: prepared.intent,
            options: prepared.options,
            runId: run.id,
            status: "active",
          });

      preparedOptions = optionSet.options;
      activeSnapshot = {
        optionSet: {
          conversationId: input.conversation.id,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          id: optionSet.id,
          runId: run.id,
          selectedOptionId: null,
          status: "active",
        },
        options: optionSet.options,
        run: {
          customerMessage: input.message.textBody ?? "",
          eventContext: prepared.eventContext,
          id: run.id,
          intent: prepared.intent,
          scenarioKey: prepared.scenarioKey,
          status: "options_sent",
        },
      };

      await resolvedDeps.updateRunState({
        lastError: null,
        latestInboundMessageId: input.latestInboundMessageId,
        runId: run.id,
        status: "options_sent",
      });

      return {
        eventContext: prepared.eventContext,
        intent: prepared.intent,
        options: optionSet.options,
        optionSetId: optionSet.id,
        runId: run.id,
        scenarioKey: prepared.scenarioKey,
        status: "options_ready",
      };
    },
  };

  const agentResult = await resolvedDeps.querySellerAgent({
    prompt: buildTurnPrompt({
      activeSnapshot,
      messageText: input.message.textBody,
      resumeSessionId: storedSessionId,
    }),
    resumeSessionId: storedSessionId,
    systemPrompt: buildSystemPrompt({
      activeSnapshot,
      contact: input.contact,
      eventContext: resolvedContext.eventContext,
    }),
    toolHandlers,
  });

  if (agentResult.sessionId && agentResult.sessionId !== storedSessionId) {
    await resolvedDeps.updateConversationMetadata(
      input.conversation.id,
      applyStoredClaudeSessionId(conversationMetadata, agentResult.sessionId),
    );
  }

  const body =
    agentResult.text.trim() ||
    (lastCheckoutUrl
      ? `Here is your Ticketmaster checkout link:\n${lastCheckoutUrl}\nThis link is time-sensitive, so open it now.`
      : "Tell me what tickets you need and I’ll check live options.");

  if (preparedOptions) {
    return {
      introText: body,
      kind: "prepared_options",
      options: preparedOptions,
    };
  }

  return {
    body,
    kind: "text",
  };
}
