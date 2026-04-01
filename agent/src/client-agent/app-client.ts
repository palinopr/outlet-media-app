import { z } from "zod";

const ViewerSchema = z.enum(["member", "admin_preview"]);
const AgentResponseStatusSchema = z.enum(["answer", "clarify", "refuse", "error", "pending"]);

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
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  timezone: z.string().min(1),
});

const ThreadContextPayloadSchema = z.object({
  primaryDomain: z.enum(["ads", "events", "mixed"]),
  referencedEntities: z.array(ReferencedEntitySchema),
  resolvedRange: ResolvedRangeSchema.nullable(),
  comparisonSet: z.array(z.string().min(1)),
  pronounTargets: z.array(z.string().min(1)),
});

const ThreadMessageSchema = z.object({
  messageId: z.string().min(1),
  role: z.enum(["user", "assistant"]),
  status: AgentResponseStatusSchema.nullable(),
  text: z.string(),
  blocks: z.array(z.unknown()),
  referencedEntities: z.array(ReferencedEntitySchema),
  contextPayload: ThreadContextPayloadSchema.nullable(),
  resolvedRange: ResolvedRangeSchema.nullable(),
  providerResponseId: z.string().nullable(),
  clientGeneratedId: z.string().nullable(),
  clientRequestId: z.string().nullable(),
  agentTaskId: z.string().nullable(),
  createdAt: z.string().min(1),
});

const ThreadSchema = z.object({
  threadId: z.string().min(1),
  title: z.string().nullable(),
  previewText: z.string().nullable(),
  referencedEntities: z.array(ReferencedEntitySchema),
  lastResponseStatus: AgentResponseStatusSchema.nullable(),
  lastMessageAt: z.string().min(1),
  updatedAt: z.string().min(1),
  createdAt: z.string().min(1),
  messages: z.array(ThreadMessageSchema),
});

const ScopeSchema = z.object({
  clientId: z.string().min(1),
  clientMemberId: z.string().min(1),
  clientSlug: z.string().min(1),
  allowedCampaignIds: z.array(z.string().min(1)).nullable(),
  allowedEventIds: z.array(z.string().min(1)).nullable(),
  eventsEnabled: z.boolean(),
  viewer: ViewerSchema,
});

const ScopeSummarySchema = z.object({
  client_slug: z.string().min(1),
  events_enabled: z.boolean(),
  viewer: ViewerSchema,
});

const TaskContextBodySchema = z.object({
  task_id: z.string().min(1),
  thread_id: z.string().min(1),
  user_message_id: z.string().min(1),
  assistant_message_id: z.string().min(1),
  scope_summary: ScopeSummarySchema,
  scope: ScopeSchema,
  thread: ThreadSchema,
  user_message: ThreadMessageSchema,
  assistant_message: ThreadMessageSchema,
});

const ToolResultBodySchema = z.object({
  status: z.enum(["ok", "no_data", "invalid_arguments", "error"]),
  data: z.unknown().optional(),
  referenced_entities: z.array(ReferencedEntitySchema),
  warnings: z.array(z.string()).optional(),
});

const ResolveBodySchema = z.object({
  status: z.enum(["answer", "clarify", "refuse", "error"]),
  thread_id: z.string().min(1),
  assistant_message_id: z.string().min(1),
});

export const CLIENT_AGENT_TOOL_NAMES = [
  "search_scope",
  "get_ads_overview",
  "get_events_overview",
  "get_campaign_details",
  "get_event_details",
  "get_creative_details",
  "get_demographic_breakdown",
  "get_geography_breakdown",
  "get_placement_breakdown",
  "compare_entities",
  "get_timeseries",
] as const;

export type ClientAgentToolName = (typeof CLIENT_AGENT_TOOL_NAMES)[number];
export type ClientAgentReferencedEntity = z.infer<typeof ReferencedEntitySchema>;
export type ClientAgentResolvedRange = z.infer<typeof ResolvedRangeSchema>;
export type ClientAgentThreadContextPayload = z.infer<typeof ThreadContextPayloadSchema>;
export type ClientAgentTaskContext = {
  taskId: string;
  threadId: string;
  userMessageId: string;
  assistantMessageId: string;
  scopeSummary: {
    clientSlug: string;
    eventsEnabled: boolean;
    viewer: z.infer<typeof ViewerSchema>;
  };
  scope: z.infer<typeof ScopeSchema>;
  thread: z.infer<typeof ThreadSchema>;
  userMessage: z.infer<typeof ThreadMessageSchema>;
  assistantMessage: z.infer<typeof ThreadMessageSchema>;
};

export type ClientAgentToolResult = {
  status: z.infer<typeof ToolResultBodySchema>["status"];
  data?: unknown;
  referencedEntities: ClientAgentReferencedEntity[];
  warnings?: string[];
};

export type ClientAgentResolveInput = {
  status: "answer" | "clarify" | "refuse" | "error";
  text: string;
  blocks: unknown[];
  referencedEntities: ClientAgentReferencedEntity[];
  contextPayload: ClientAgentThreadContextPayload | null;
  resolvedRange: ClientAgentResolvedRange | null;
  providerResponseId: string | null;
};

export type ClientAgentResolveResult = {
  status: ClientAgentResolveInput["status"];
  threadId: string;
  assistantMessageId: string;
};

export interface ClientAgentAppClient {
  getTaskContext(taskId: string): Promise<ClientAgentTaskContext>;
  runTool(
    taskId: string,
    toolName: ClientAgentToolName,
    args: Record<string, unknown>,
  ): Promise<ClientAgentToolResult>;
  resolveTask(
    taskId: string,
    result: ClientAgentResolveInput,
  ): Promise<ClientAgentResolveResult>;
}

type FetchLike = typeof fetch;

function getClientAgentAppBaseUrl() {
  const override = process.env.CLIENT_AGENT_APP_URL?.trim();
  if (override) {
    return override.replace(/\/$/, "");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  throw new Error("CLIENT_AGENT_APP_URL or NEXT_PUBLIC_APP_URL is required for the client agent worker.");
}

function getWorkerSecret() {
  const secret = process.env.CLIENT_AGENT_WORKER_SECRET?.trim();
  if (!secret) {
    throw new Error("CLIENT_AGENT_WORKER_SECRET is required for the client agent worker.");
  }

  return secret;
}

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function normalizeTaskContext(body: z.infer<typeof TaskContextBodySchema>): ClientAgentTaskContext {
  return {
    taskId: body.task_id,
    threadId: body.thread_id,
    userMessageId: body.user_message_id,
    assistantMessageId: body.assistant_message_id,
    scopeSummary: {
      clientSlug: body.scope_summary.client_slug,
      eventsEnabled: body.scope_summary.events_enabled,
      viewer: body.scope_summary.viewer,
    },
    scope: body.scope,
    thread: body.thread,
    userMessage: body.user_message,
    assistantMessage: body.assistant_message,
  };
}

export function createClientAgentAppClient(options?: {
  baseUrl?: string;
  workerSecret?: string;
  fetchImpl?: FetchLike;
}): ClientAgentAppClient {
  const baseUrl = (options?.baseUrl ?? getClientAgentAppBaseUrl()).replace(/\/$/, "");
  const workerSecret = options?.workerSecret ?? getWorkerSecret();
  const fetchImpl = options?.fetchImpl ?? fetch;

  async function request<T>({
    path,
    method = "GET",
    body,
    schema,
  }: {
    path: string;
    method?: "GET" | "POST";
    body?: unknown;
    schema: z.ZodType<T>;
  }): Promise<T> {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${workerSecret}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await parseJson<unknown>(response);
    if (!response.ok) {
      const error =
        payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : `Client agent worker request failed (${response.status})`;
      throw new Error(error);
    }

    return schema.parse(payload);
  }

  return {
    async getTaskContext(taskId: string): Promise<ClientAgentTaskContext> {
      const body = await request({
        path: `/api/internal/client-agent/tasks/${taskId}/context`,
        schema: TaskContextBodySchema,
      });
      return normalizeTaskContext(body);
    },

    async runTool(
      taskId: string,
      toolName: ClientAgentToolName,
      args: Record<string, unknown>,
    ): Promise<ClientAgentToolResult> {
      const body = await request({
        path: "/api/internal/client-agent/tools",
        method: "POST",
        body: {
          task_id: taskId,
          tool_name: toolName,
          args,
        },
        schema: ToolResultBodySchema,
      });

      return {
        status: body.status,
        data: body.data,
        referencedEntities: body.referenced_entities,
        warnings: body.warnings,
      };
    },

    async resolveTask(
      taskId: string,
      result: ClientAgentResolveInput,
    ): Promise<ClientAgentResolveResult> {
      const body = await request({
        path: `/api/internal/client-agent/tasks/${taskId}/resolve`,
        method: "POST",
        body: {
          status: result.status,
          text: result.text,
          blocks: result.blocks,
          referenced_entities: result.referencedEntities,
          context_payload: result.contextPayload,
          resolved_range: result.resolvedRange,
          provider_response_id: result.providerResponseId,
        },
        schema: ResolveBodySchema,
      });

      return {
        status: body.status,
        threadId: body.thread_id,
        assistantMessageId: body.assistant_message_id,
      };
    },
  };
}
