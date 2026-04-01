import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AgentAnswerBlock, ReferencedEntity, ResolvedRange } from "./types";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    fromCalls: 0,
    client_agent_threads: [] as Record<string, unknown>[],
    client_agent_messages: [] as Record<string, unknown>[],
    failingTables: {} as Partial<Record<string, { insert?: boolean; update?: boolean }>>,
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }

        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  const supabaseAdmin = {
    from(table: string) {
      state.fromCalls += 1;

      const filters: Array<{ field: string; type: "eq" | "in"; value: unknown }> = [];
      let orderField: string | null = null;
      let orderAscending = true;
      let insertPayload: Record<string, unknown>[] | null = null;
      let updatePayload: Record<string, unknown> | null = null;

      const query = {
        select() {
          return this;
        },
        eq(field: string, value: unknown) {
          filters.push({ field, type: "eq", value });
          return this;
        },
        in(field: string, value: unknown[]) {
          filters.push({ field, type: "in", value });
          return this;
        },
        order(field: string, options?: { ascending?: boolean }) {
          orderField = field;
          orderAscending = options?.ascending ?? true;
          return this;
        },
        insert(payload: Record<string, unknown> | Record<string, unknown>[]) {
          insertPayload = Array.isArray(payload) ? payload : [payload];
          return this;
        },
        update(payload: Record<string, unknown>) {
          updatePayload = payload;
          return this;
        },
        async maybeSingle() {
          const result = await Promise.resolve(this);
          return {
            data: Array.isArray(result.data) ? (result.data[0] ?? null) : result.data,
            error: result.error,
          };
        },
        async single() {
          const result = await Promise.resolve(this);
          return {
            data: Array.isArray(result.data) ? (result.data[0] ?? null) : result.data,
            error: result.error,
          };
        },
        then(
          resolve: (value: {
            data: Record<string, unknown>[] | null;
            error: { message: string } | null;
          }) => unknown,
        ) {
          const tableRows = state[table as keyof typeof state] as Record<string, unknown>[];
          const tableFailures = state.failingTables[table] ?? {};
          let rows: Record<string, unknown>[] | null = applyFilters(tableRows ?? [], filters);
          let error: { message: string } | null = null;

          if (insertPayload) {
            if (tableFailures.insert) {
              error = { message: `insert failed for ${table}` };
              rows = null;
            } else {
              for (const payload of insertPayload) {
                tableRows.push({ ...payload });
              }
              rows = insertPayload.map((payload) => ({ ...payload }));
            }
          } else if (updatePayload) {
            if (tableFailures.update) {
              error = { message: `update failed for ${table}` };
              rows = null;
            } else {
              for (const row of rows) {
                Object.assign(row, updatePayload);
              }
              rows = rows.map((row) => ({ ...row }));
            }
          } else {
            rows = rows.map((row) => ({ ...row }));
          }

          if (orderField && Array.isArray(rows)) {
            const field = orderField;
            rows.sort((left, right) => {
              const leftValue = String(left[field] ?? "");
              const rightValue = String(right[field] ?? "");
              return orderAscending
                ? leftValue.localeCompare(rightValue)
                : rightValue.localeCompare(leftValue);
            });
          }

          return Promise.resolve({ data: rows, error }).then(resolve);
        },
      };

      return query;
    },
  };

  return { state, supabaseAdmin };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

import {
  appendAssistantMessage,
  appendUserMessage,
  createThread,
  getThread,
  listThreads,
} from "./store";

const memberScope = {
  clientId: "client_1",
  clientMemberId: "member_1",
  clientSlug: "acme",
  allowedCampaignIds: ["cmp_1", "cmp_2"],
  allowedEventIds: ["evt_1"],
  eventsEnabled: true,
  viewer: "member" as const,
};

function makeThread(overrides: Record<string, unknown> = {}) {
  return {
    id: "thread_1",
    client_id: "client_1",
    client_member_id: "member_1",
    title: "Budget pacing",
    preview_text: "Latest assistant answer",
    referenced_entities: [],
    last_response_status: "answer",
    last_message_at: "2026-03-31T09:00:00.000Z",
    created_at: "2026-03-31T09:00:00.000Z",
    updated_at: "2026-03-31T09:00:00.000Z",
    ...overrides,
  };
}

function makeMessage(overrides: Record<string, unknown> = {}) {
  return {
    id: "message_1",
    thread_id: "thread_1",
    role: "assistant",
    response_status: "answer",
    text: "Latest assistant answer",
    blocks: [],
    referenced_entities: [],
    context_payload: null,
    resolved_range: null,
    provider_response_id: null,
    client_generated_id: null,
    created_at: "2026-03-31T09:00:00.000Z",
    ...overrides,
  };
}

describe("client-agent store", () => {
  beforeEach(() => {
    state.fromCalls = 0;
    state.client_agent_threads = [];
    state.client_agent_messages = [];
    state.failingTables = {};
    vi.useRealTimers();
  });

  it("lists only the current member rows and hides out-of-scope thread references", async () => {
    state.client_agent_threads = [
      makeThread({
        id: "thread_visible",
        title: "Visible thread",
        referenced_entities: [{ entityId: "cmp_1", entityType: "campaign", name: "Launch" }],
      }),
      makeThread({
        id: "thread_other_member",
        client_member_id: "member_2",
        title: "Other member thread",
        referenced_entities: [{ entityId: "cmp_1", entityType: "campaign", name: "Launch" }],
      }),
      makeThread({
        id: "thread_hidden",
        title: "Hidden thread",
        referenced_entities: [{ entityId: "cmp_9", entityType: "campaign", name: "Secret" }],
      }),
    ];

    const threads = await listThreads({ scope: memberScope });

    expect(threads).toHaveLength(1);
    expect(threads[0]).toMatchObject({
      threadId: "thread_visible",
      title: "Visible thread",
    });
  });

  it("returns null when a referenced entity drops out of scope", async () => {
    state.client_agent_threads = [
      makeThread({
        id: "thread_hidden",
        referenced_entities: [{ entityId: "evt_9", entityType: "event", name: "Hidden event" }],
      }),
    ];
    state.client_agent_messages = [
      makeMessage({
        thread_id: "thread_hidden",
        id: "message_hidden",
        referenced_entities: [{ entityId: "evt_9", entityType: "event", name: "Hidden event" }],
      }),
    ];

    const thread = await getThread({
      threadId: "thread_hidden",
      scope: memberScope,
    });

    expect(thread).toBeNull();
  });

  it("hides creative-only thread rows when the parent campaign is out of scope", async () => {
    const scopeWithoutCmp1 = {
      ...memberScope,
      allowedCampaignIds: ["cmp_2"],
    };

    state.client_agent_threads = [
      makeThread({
        id: "thread_creative_hidden",
        referenced_entities: [
          {
            entityId: "ad_1",
            entityType: "creative",
            name: "video 4 - Bay Area",
            campaignId: "cmp_1",
          },
        ],
      }),
    ];

    const threads = await listThreads({ scope: scopeWithoutCmp1 });

    expect(threads).toEqual([]);
  });

  it("returns null when persisted assistant messages drift out of scope even if thread summary still looks visible", async () => {
    state.client_agent_threads = [
      makeThread({
        id: "thread_drifted",
        referenced_entities: [{ entityId: "cmp_1", entityType: "campaign", name: "Launch" }],
      }),
    ];
    state.client_agent_messages = [
      makeMessage({
        thread_id: "thread_drifted",
        id: "message_visible",
        referenced_entities: [{ entityId: "cmp_1", entityType: "campaign", name: "Launch" }],
      }),
      makeMessage({
        thread_id: "thread_drifted",
        id: "message_hidden",
        text: "Hidden assistant answer",
        referenced_entities: [{ entityId: "cmp_9", entityType: "campaign", name: "Secret" }],
      }),
    ];

    const thread = await getThread({
      threadId: "thread_drifted",
      scope: memberScope,
    });

    expect(thread).toBeNull();
  });

  it("hides list rows when persisted assistant messages drift out of scope even if the summary row still looks visible", async () => {
    state.client_agent_threads = [
      makeThread({
        id: "thread_drifted_list",
        title: "Visible from summary only",
        referenced_entities: [{ entityId: "cmp_1", entityType: "campaign", name: "Launch" }],
      }),
    ];
    state.client_agent_messages = [
      makeMessage({
        thread_id: "thread_drifted_list",
        id: "message_hidden_list",
        referenced_entities: [{ entityId: "cmp_9", entityType: "campaign", name: "Secret" }],
      }),
    ];

    const threads = await listThreads({ scope: memberScope });

    expect(threads).toEqual([]);
  });

  it("short-circuits preview mode before any durable reads or writes", async () => {
    const previewScope = {
      ...memberScope,
      viewer: "admin_preview" as const,
    };

    expect(await listThreads({ scope: previewScope })).toEqual([]);
    expect(await getThread({ threadId: "thread_1", scope: previewScope })).toBeNull();
    await expect(createThread({ scope: previewScope })).resolves.toMatchObject({
      ok: false,
      code: "preview_unavailable",
    });
    await expect(
      appendUserMessage({
        threadId: "thread_1",
        scope: previewScope,
        text: "Can you summarize this?",
        clientGeneratedId: "client_msg_1",
      }),
    ).resolves.toMatchObject({
      ok: false,
      code: "preview_unavailable",
    });
    await expect(
      appendAssistantMessage({
        threadId: "thread_1",
        scope: previewScope,
        status: "answer",
        text: "Preview answers should not persist.",
        blocks: [],
        referencedEntities: [],
        resolvedRange: null,
        providerResponseId: "resp_1",
      }),
    ).resolves.toMatchObject({
      ok: false,
      code: "preview_unavailable",
    });

    expect(state.fromCalls).toBe(0);
    expect(state.client_agent_threads).toEqual([]);
    expect(state.client_agent_messages).toEqual([]);
  });

  it("derives title and preview text, aggregates assistant references, and refreshes durable timestamps", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-31T12:00:00.000Z"));

    const created = await createThread({ scope: memberScope });
    expect(created).toMatchObject({ ok: true });

    const threadId = created.ok ? created.thread.threadId : "missing";

    vi.setSystemTime(new Date("2026-03-31T12:01:00.000Z"));
    await appendUserMessage({
      threadId,
      scope: memberScope,
      text: "Show me the spend trend for Spring Launch compared with Miami and explain where performance is strongest this month please.",
      clientGeneratedId: "client_msg_1",
    });

    const firstAssistantText =
      "Spring Launch is pacing ahead of Miami on spend efficiency, with the strongest performance concentrated in Instagram feed placements over the last month.";
    const secondAssistantText =
      "Miami rebounded in the latest week, but Spring Launch still leads on blended efficiency after accounting for the broader spend base.";
    const blocks: AgentAnswerBlock[] = [
      {
        type: "table",
        title: "Campaign comparison",
        columns: ["Campaign", "Spend"],
        rows: [
          { Campaign: "Spring Launch", Spend: "$12,400" },
          { Campaign: "Miami", Spend: "$8,900" },
        ],
      },
    ];
    const firstReferences: ReferencedEntity[] = [
      { entityId: "cmp_1", entityType: "campaign", name: "Spring Launch" },
      { entityId: "evt_1", entityType: "event", name: "Miami" },
    ];
    const secondReferences: ReferencedEntity[] = [
      { entityId: "cmp_1", entityType: "campaign", name: "Spring Launch" },
      { entityId: "cmp_2", entityType: "campaign", name: "Miami Retargeting" },
    ];
    const resolvedRange: ResolvedRange = {
      preset: "this_month",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      timezone: "America/Chicago",
    };

    vi.setSystemTime(new Date("2026-03-31T12:02:00.000Z"));
    await appendAssistantMessage({
      threadId,
      scope: memberScope,
      status: "answer",
      text: firstAssistantText,
      blocks,
      referencedEntities: firstReferences,
      contextPayload: {
        primaryDomain: "ads",
        referencedEntities: [
          {
            entityId: "ad_1",
            entityType: "creative",
            name: "video 4 - Bay Area",
            campaignId: "cmp_1",
          },
        ],
        resolvedRange,
        comparisonSet: [],
        pronounTargets: ["ad_1"],
      },
      resolvedRange,
      providerResponseId: "resp_1",
    });

    vi.setSystemTime(new Date("2026-03-31T12:03:00.000Z"));
    await appendAssistantMessage({
      threadId,
      scope: memberScope,
      status: "answer",
      text: secondAssistantText,
      blocks: [],
      referencedEntities: secondReferences,
      resolvedRange,
      providerResponseId: "resp_2",
    });

    const threads = await listThreads({ scope: memberScope });
    const thread = await getThread({ threadId, scope: memberScope });

    expect(threads[0]).toMatchObject({
      threadId,
      title:
        "Show me the spend trend for Spring Launch compared with Miami and explain where ",
      previewText:
        "Miami rebounded in the latest week, but Spring Launch still leads on blended efficiency after accounting for the broader spend base.",
      updatedAt: "2026-03-31T12:03:00.000Z",
      lastMessageAt: "2026-03-31T12:03:00.000Z",
    });
    expect(threads[0]?.title).toHaveLength(80);
    expect(threads[0]?.previewText?.length).toBeLessThanOrEqual(140);
    expect(thread).toMatchObject({
      threadId,
      title:
        "Show me the spend trend for Spring Launch compared with Miami and explain where ",
      previewText:
        "Miami rebounded in the latest week, but Spring Launch still leads on blended efficiency after accounting for the broader spend base.",
      referencedEntities: [
        { entityId: "cmp_1", entityType: "campaign", name: "Spring Launch" },
        { entityId: "evt_1", entityType: "event", name: "Miami" },
        { entityId: "cmp_2", entityType: "campaign", name: "Miami Retargeting" },
      ],
      lastResponseStatus: "answer",
      updatedAt: "2026-03-31T12:03:00.000Z",
      lastMessageAt: "2026-03-31T12:03:00.000Z",
    });
    expect(thread?.messages).toHaveLength(3);
    expect(thread?.messages[1]).toMatchObject({
      role: "assistant",
      status: "answer",
      text: firstAssistantText,
      blocks,
      referencedEntities: firstReferences,
      contextPayload: {
        primaryDomain: "ads",
        referencedEntities: [
          {
            entityId: "ad_1",
            entityType: "creative",
            name: "video 4 - Bay Area",
            campaignId: "cmp_1",
          },
        ],
        resolvedRange,
        comparisonSet: [],
        pronounTargets: ["ad_1"],
      },
      resolvedRange,
    });
  });

  it("surfaces insert failures instead of returning phantom success", async () => {
    state.failingTables.client_agent_threads = { insert: true };

    const created = await createThread({ scope: memberScope });

    expect(created).toMatchObject({
      ok: false,
      code: "write_failed",
    });
    expect(state.client_agent_threads).toEqual([]);
  });

  it("surfaces summary update failures after assistant writes", async () => {
    state.client_agent_threads = [makeThread({ id: "thread_write_fail" })];
    state.client_agent_messages = [];
    state.failingTables.client_agent_threads = { update: true };

    const appended = await appendAssistantMessage({
      threadId: "thread_write_fail",
      scope: memberScope,
      status: "answer",
      text: "Scoped answer",
      blocks: [],
      referencedEntities: [{ entityId: "cmp_1", entityType: "campaign", name: "Launch" }],
      resolvedRange: null,
      providerResponseId: "resp_write_fail",
    });

    expect(appended).toMatchObject({
      ok: false,
      code: "write_failed",
    });
  });

  it("reuses an already-inserted user message on retry after summary refresh failure", async () => {
    state.client_agent_threads = [makeThread({ id: "thread_retry_user" })];
    state.client_agent_messages = [];
    state.failingTables.client_agent_threads = { update: true };

    const firstAttempt = await appendUserMessage({
      threadId: "thread_retry_user",
      scope: memberScope,
      text: "Retry-safe user question",
      clientGeneratedId: "client_retry_1",
    });

    expect(firstAttempt).toMatchObject({
      ok: false,
      code: "write_failed",
    });
    expect(state.client_agent_messages).toHaveLength(1);

    state.failingTables.client_agent_threads = {};

    const secondAttempt = await appendUserMessage({
      threadId: "thread_retry_user",
      scope: memberScope,
      text: "Retry-safe user question",
      clientGeneratedId: "client_retry_1",
    });

    expect(secondAttempt).toMatchObject({
      ok: true,
    });
    expect(state.client_agent_messages).toHaveLength(1);
    expect(
      state.client_agent_messages.filter(
        (message) => message.client_generated_id === "client_retry_1",
      ),
    ).toHaveLength(1);
  });

  it("reuses an already-inserted assistant message on retry after summary refresh failure", async () => {
    state.client_agent_threads = [makeThread({ id: "thread_retry_assistant" })];
    state.client_agent_messages = [];
    state.failingTables.client_agent_threads = { update: true };

    const firstAttempt = await appendAssistantMessage({
      threadId: "thread_retry_assistant",
      scope: memberScope,
      status: "answer",
      text: "Retry-safe assistant answer",
      blocks: [],
      referencedEntities: [{ entityId: "cmp_1", entityType: "campaign", name: "Launch" }],
      resolvedRange: null,
      providerResponseId: "resp_retry_1",
    });

    expect(firstAttempt).toMatchObject({
      ok: false,
      code: "write_failed",
    });
    expect(state.client_agent_messages).toHaveLength(1);

    state.failingTables.client_agent_threads = {};

    const secondAttempt = await appendAssistantMessage({
      threadId: "thread_retry_assistant",
      scope: memberScope,
      status: "answer",
      text: "Retry-safe assistant answer",
      blocks: [],
      referencedEntities: [{ entityId: "cmp_1", entityType: "campaign", name: "Launch" }],
      resolvedRange: null,
      providerResponseId: "resp_retry_1",
    });

    expect(secondAttempt).toMatchObject({
      ok: true,
    });
    expect(state.client_agent_messages).toHaveLength(1);
    expect(
      state.client_agent_messages.filter(
        (message) => message.provider_response_id === "resp_retry_1",
      ),
    ).toHaveLength(1);
  });
});
