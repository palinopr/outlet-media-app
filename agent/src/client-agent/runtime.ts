import { createSdkMcpServer, query, tool } from "@anthropic-ai/claude-agent-sdk";
import { join } from "node:path";
import { z } from "zod";
import type {
  ClientAgentAppClient,
  ClientAgentResolveInput,
  ClientAgentTaskContext,
  ClientAgentToolName,
} from "./app-client.js";
import { CLIENT_AGENT_TOOL_NAMES } from "./app-client.js";
import { toErrorMessage } from "../utils/error-helpers.js";

const AGENT_DIR = join(import.meta.dirname ?? ".", "..");
const DEFAULT_MODEL = "claude-sonnet-4-6";
const CanonicalDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const ReferencedEntitySchema = z.discriminatedUnion("entityType", [
  z.object({
    entityId: z.string().min(1),
    entityType: z.literal("campaign"),
    name: z.string().min(1),
  }),
  z.object({
    entityId: z.string().min(1),
    entityType: z.literal("event"),
    name: z.string().min(1),
  }),
  z.object({
    entityId: z.string().min(1),
    entityType: z.literal("creative"),
    name: z.string().min(1),
    campaignId: z.string().min(1),
  }),
]);

const ResolvedRangeSchema = z.object({
  preset: z.enum([
    "today",
    "yesterday",
    "last_7_days",
    "last_30_days",
    "lifetime",
    "this_week",
    "this_month",
    "this_quarter",
    "custom",
  ]),
  startDate: CanonicalDateSchema,
  endDate: CanonicalDateSchema,
  timezone: z.string().min(1),
});

const ThreadContextPayloadSchema = z.object({
  primaryDomain: z.enum(["ads", "events", "mixed"]),
  referencedEntities: z.array(ReferencedEntitySchema),
  resolvedRange: ResolvedRangeSchema.nullable(),
  comparisonSet: z.array(z.string().min(1)),
  pronounTargets: z.array(z.string().min(1)),
});

const RuntimeOutputSchema = z.object({
  status: z.enum(["answer", "clarify", "refuse", "error"]),
  text: z.string().min(1),
  referencedEntities: z.array(ReferencedEntitySchema).default([]),
  contextPayload: ThreadContextPayloadSchema.nullable().default(null),
  resolvedRange: ResolvedRangeSchema.nullable().default(null),
});

const TOOL_DESCRIPTIONS: Record<ClientAgentToolName, string> = {
  search_scope: "Search campaigns, events, and creatives inside this client's allowed scope.",
  get_ads_overview: "Read-only ads overview across the allowed campaigns.",
  get_events_overview: "Read-only event overview across the allowed events.",
  get_campaign_details: "Read-only campaign details and metrics for allowed campaigns.",
  get_event_details: "Read-only event details for allowed events.",
  get_creative_details: "Read-only creative details for allowed campaigns.",
  get_demographic_breakdown: "Read-only demographic performance breakdown.",
  get_geography_breakdown: "Read-only geography performance breakdown.",
  get_placement_breakdown: "Read-only placement performance breakdown.",
  compare_entities: "Read-only comparison across campaigns, events, or creatives.",
  get_timeseries: "Read-only performance timeseries.",
};

const BASE_SYSTEM_PROMPT = [
  "You are the Outlet Media client portal Agent.",
  "You answer only from the provided client-safe analytics tools.",
  "Do not reveal internal setup, source systems, ad account structure, strategy, or workflow details.",
  "Use Meta ads first for vague business questions unless the question clearly asks about shows, tickets, venues, sell-through, or event timing.",
  "Default the timeframe to lifetime when the user does not provide one.",
  "Use as many read-only tools as needed before answering.",
  "Your final answer must be a single JSON object with keys: status, text, referencedEntities, contextPayload, resolvedRange.",
  "Do not wrap the JSON in markdown fences.",
].join("\n");

type RuntimeOutput = Omit<ClientAgentResolveInput, "blocks" | "providerResponseId">;
export type ClientAgentRuntimeResult = RuntimeOutput & { providerResponseId: string | null };

function inferDomainHint(text: string) {
  return /(last show|next show|tickets?|sell[- ]?through|venue|gross|attendance|event)/i.test(text)
    ? "events"
    : "ads";
}

function buildPrompt(context: ClientAgentTaskContext) {
  const domainHint = inferDomainHint(context.userMessage.text);
  const scopeSummary = [
    `Client slug: ${context.scopeSummary.clientSlug}`,
    `Viewer: ${context.scopeSummary.viewer}`,
    `Events enabled: ${context.scopeSummary.eventsEnabled ? "yes" : "no"}`,
    `Domain hint: ${domainHint}`,
    "Default timeframe: lifetime",
  ].join("\n");

  return [
    "Answer the user's latest question using the client-agent tools.",
    scopeSummary,
    "",
    `Latest user question: ${context.userMessage.text}`,
    "",
    "Return only the final JSON object.",
  ].join("\n");
}

function buildToolServer(input: {
  appClient: Pick<ClientAgentAppClient, "runTool">;
  taskId: string;
}) {
  return createSdkMcpServer({
    name: "client-agent-tools",
    version: "1.0.0",
    tools: CLIENT_AGENT_TOOL_NAMES.map((toolName) =>
      tool(
        toolName,
        TOOL_DESCRIPTIONS[toolName],
        {
          payload: z.record(z.string(), z.unknown()).optional().describe("Raw JSON arguments for the tool."),
        },
        async (args) => {
          const result = await input.appClient.runTool(input.taskId, toolName, args.payload ?? {});
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(result),
              },
            ],
          };
        },
      ),
    ),
  });
}

function extractTextContent(content: unknown) {
  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((block) => {
      if (!block || typeof block !== "object") {
        return "";
      }

      const type = "type" in block ? block.type : null;
      const text = "text" in block ? block.text : null;
      return type === "text" && typeof text === "string" ? text : "";
    })
    .join("");
}

function parseRuntimeOutput(rawText: string): RuntimeOutput {
  const parsed = RuntimeOutputSchema.safeParse(JSON.parse(rawText));
  if (!parsed.success) {
    throw new Error("Client agent runtime returned invalid JSON.");
  }

  return parsed.data;
}

export async function runClientAgentRuntime(input: {
  appClient: Pick<ClientAgentAppClient, "runTool">;
  context: ClientAgentTaskContext;
  model?: string;
}): Promise<ClientAgentRuntimeResult> {
  const toolServer = buildToolServer({
    appClient: input.appClient,
    taskId: input.context.taskId,
  });

  let assembledText = "";
  let fallbackResult = "";
  let providerResponseId: string | null = null;

  try {
    for await (const event of query({
      prompt: buildPrompt(input.context),
      options: {
        cwd: AGENT_DIR,
        maxTurns: 8,
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,
        settingSources: ["local"],
        systemPrompt: BASE_SYSTEM_PROMPT,
        model: input.model ?? process.env.CLIENT_AGENT_CLAUDE_MODEL ?? DEFAULT_MODEL,
        tools: [],
        mcpServers: {
          "client-agent-tools": toolServer,
        },
        allowedTools: CLIENT_AGENT_TOOL_NAMES.map(
          (toolName) => `mcp__client-agent-tools__${toolName}`,
        ),
      },
    })) {
      if (!event || typeof event !== "object") {
        continue;
      }

      if ("session_id" in event && typeof event.session_id === "string") {
        providerResponseId = event.session_id;
      }

      if (event.type === "assistant" && "message" in event) {
        assembledText += extractTextContent(event.message?.content);
      }

      if (event.type === "result" && event.subtype === "success" && typeof event.result === "string") {
        fallbackResult = event.result;
      }
    }

    const rawText = assembledText.trim() || fallbackResult.trim();
    const parsed = parseRuntimeOutput(rawText);

    return {
      ...parsed,
      providerResponseId,
    };
  } catch (error) {
    return {
      status: "error",
      text: `I’m unable to answer that right now. ${toErrorMessage(error)}`,
      referencedEntities: [],
      contextPayload: null,
      resolvedRange: null,
      providerResponseId,
    };
  }
}
