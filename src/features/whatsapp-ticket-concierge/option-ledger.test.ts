import { beforeEach, describe, expect, it, vi } from "vitest";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    whatsapp_ticket_concierge_checkout_attempts: [] as Record<string, unknown>[],
    whatsapp_ticket_concierge_option_sets: [] as Record<string, unknown>[],
    whatsapp_ticket_concierge_options: [] as Record<string, unknown>[],
    whatsapp_ticket_concierge_runs: [] as Record<string, unknown>[],
  };

  const supabaseAdmin = {
    from(table: string) {
      const queryState = {
        data: state[table as keyof typeof state] as Record<string, unknown>[],
        deleteRequested: false,
        filters: [] as Array<{ field: string; value: unknown }>,
        orderField: null as string | null,
        updatePayload: null as Record<string, unknown> | null,
      };

      const applyFilters = () =>
        queryState.data.filter((row) =>
          queryState.filters.every(({ field, value }) => row[field] === value),
        );

      const chain = {
        select() {
          return this;
        },
        eq(field: string, value: unknown) {
          queryState.filters.push({ field, value });
          return this;
        },
        order(field: string) {
          queryState.orderField = field;
          return this;
        },
        async maybeSingle() {
          const rows = applyFilters();
          return { data: rows[0] ?? null, error: null };
        },
        async insert(payload: Record<string, unknown> | Record<string, unknown>[]) {
          const rows = Array.isArray(payload) ? payload : [payload];
          queryState.data.push(...rows);
          return { data: rows, error: null };
        },
        update(payload: Record<string, unknown>) {
          queryState.updatePayload = payload;
          return this;
        },
        async upsert(payload: Record<string, unknown>) {
          const existing = applyFilters()[0];
          if (existing) {
            Object.assign(existing, payload);
            return { data: existing, error: null };
          }
          queryState.data.push(payload);
          return { data: payload, error: null };
        },
        delete() {
          queryState.deleteRequested = true;
          return this;
        },
        then(
          resolve: (value: {
            data: Record<string, unknown> | Record<string, unknown>[] | null;
            error: null;
          }) => unknown,
        ) {
          const rows = applyFilters();

          if (queryState.updatePayload) {
            for (const row of rows) {
              Object.assign(row, queryState.updatePayload);
            }
            return Promise.resolve({ data: rows[0] ?? null, error: null }).then(resolve);
          }

          if (queryState.deleteRequested) {
            const remainingRows = queryState.data.filter((row) => !rows.includes(row));
            queryState.data.splice(0, queryState.data.length, ...remainingRows);
            return Promise.resolve({ data: rows, error: null }).then(resolve);
          }

          return Promise.resolve({ data: rows, error: null }).then(resolve);
        },
      };

      return chain;
    },
  };

  return { state, supabaseAdmin };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

import {
  createOptionSet,
  getActiveOptionSetSelectionSnapshot,
  getLatestRunForConversation,
  replaceActiveOptionSet,
  selectConciergeOption,
  updateRunState,
} from "./option-ledger";

describe("option ledger", () => {
  beforeEach(() => {
    state.whatsapp_ticket_concierge_checkout_attempts = [];
    state.whatsapp_ticket_concierge_option_sets = [];
    state.whatsapp_ticket_concierge_options = [];
    state.whatsapp_ticket_concierge_runs = [{ active_option_set_id: null, id: "run_1" }];
  });

  it("creates an active option set with ranked options", async () => {
    const optionSet = await createOptionSet({
      conversationId: "conv_1",
      eventContext: {
        artist: "Ricardo Arjona",
        city: "Miami",
        date: "2026-04-02",
        eventId: "0D0062FF195A626B",
        eventUrl: "",
      },
      intent: {
        maxTotalCents: 30000,
        preferences: ["near_stage"],
        quantity: 2,
      },
      options: [
        {
          execution: { selectionPayload: { placeSelections: [] } },
          isUnderBudget: true,
          label: "Option 1",
          mapSvg: "<svg />",
          mapToken: "map_1",
          note: "Best value",
          ordinal: 1,
          quantity: 2,
          quoteSource: "exact",
          row: "K",
          seatLabels: ["7", "8"],
          section: "114",
          totalCents: 28600,
        },
      ],
      runId: "run_1",
      status: "active",
    });

    expect(optionSet).toMatchObject({
      options: [expect.objectContaining({ ordinal: 1 })],
      status: "active",
    });
    expect(state.whatsapp_ticket_concierge_runs[0]?.active_option_set_id).toBe(optionSet.id);
  });

  it("links a refreshed option set back to the replaced option set", async () => {
    state.whatsapp_ticket_concierge_option_sets = [
      {
        id: "set_1",
        run_id: "run_1",
        conversation_id: "conv_1",
        status: "active",
      },
    ];

    const refreshed = await replaceActiveOptionSet({
      conversationId: "conv_1",
      eventContext: {
        artist: "Ricardo Arjona",
        city: "Miami",
        date: "2026-04-02",
        eventId: "0D0062FF195A626B",
        eventUrl: "",
      },
      intent: {
        maxTotalCents: 30000,
        preferences: ["near_stage"],
        quantity: 2,
      },
      options: [
        {
          execution: { selectionPayload: { placeSelections: [] } },
          isUnderBudget: false,
          label: "Option 2",
          mapSvg: "<svg />",
          mapToken: "map_2",
          note: "Closest over budget",
          ordinal: 1,
          quantity: 2,
          quoteSource: "exact",
          row: "L",
          seatLabels: ["9", "10"],
          section: "115",
          totalCents: 31200,
        },
      ],
      previousOptionSetId: "set_1",
      runId: "run_1",
      status: "active",
    });

    const refreshedRow = state.whatsapp_ticket_concierge_option_sets.find(
      (row) => row.id === refreshed.id,
    );
    expect(refreshedRow?.refresh_of_option_set_id).toBe("set_1");
    expect(state.whatsapp_ticket_concierge_option_sets[0]?.status).toBe("replaced");
  });

  it("loads the active option set together with its options and run state", async () => {
    state.whatsapp_ticket_concierge_runs = [
      {
        active_option_set_id: "set_1",
        conversation_id: "conv_1",
        customer_message: "[zamora-miami] I need 2 tickets for Zamora under $300",
        event_context: { city: "Miami" },
        id: "run_1",
        intent: { maxTotalCents: 30000, preferences: [], quantity: 2 },
        scenario_key: "zamora_arjona_miami_v1",
        status: "options_sent",
        updated_at: "2026-04-01T00:00:00.000Z",
      },
    ];
    state.whatsapp_ticket_concierge_option_sets = [
      {
        conversation_id: "conv_1",
        created_at: "2026-04-01T00:00:00.000Z",
        expires_at: "2099-04-01T00:05:00.000Z",
        id: "set_1",
        refresh_of_option_set_id: null,
        run_id: "run_1",
        selected_option_id: null,
        status: "active",
        updated_at: "2026-04-01T00:00:00.000Z",
      },
    ];
    state.whatsapp_ticket_concierge_options = [
      {
        execution: { selectionPayload: { placeSelections: [] } },
        id: "opt_1",
        is_under_budget: true,
        label: "Option 1",
        map_svg: "<svg />",
        map_token: "map_1",
        note: "Best value",
        option_set_id: "set_1",
        ordinal: 1,
        quantity: 2,
        quote_source: "exact",
        row: "K",
        seat_labels: ["7", "8"],
        section: "114",
        total_cents: 28600,
      },
    ];

    await expect(getActiveOptionSetSelectionSnapshot("conv_1")).resolves.toEqual({
      optionSet: {
        conversationId: "conv_1",
        expiresAt: "2099-04-01T00:05:00.000Z",
        id: "set_1",
        runId: "run_1",
        selectedOptionId: null,
        status: "active",
      },
      options: [
        expect.objectContaining({
          id: "opt_1",
          ordinal: 1,
          section: "114",
        }),
      ],
      run: expect.objectContaining({
        customerMessage: "[zamora-miami] I need 2 tickets for Zamora under $300",
        id: "run_1",
        status: "options_sent",
      }),
    });
  });

  it("treats expired active option sets as unavailable", async () => {
    state.whatsapp_ticket_concierge_runs = [
      {
        active_option_set_id: "set_expired",
        conversation_id: "conv_1",
        customer_message: "Necesito 2 tickets para Arjona por menos de 300 total",
        event_context: { city: "Miami" },
        id: "run_1",
        intent: { maxTotalCents: 30000, preferences: [], quantity: 2 },
        scenario_key: "zamora_arjona_miami_v1",
        status: "options_sent",
        updated_at: "2026-04-01T00:00:00.000Z",
      },
    ];
    state.whatsapp_ticket_concierge_option_sets = [
      {
        conversation_id: "conv_1",
        created_at: "2026-04-01T00:00:00.000Z",
        expires_at: "2000-01-01T00:00:00.000Z",
        id: "set_expired",
        refresh_of_option_set_id: null,
        run_id: "run_1",
        selected_option_id: null,
        status: "active",
        updated_at: "2026-04-01T00:00:00.000Z",
      },
    ];

    await expect(getActiveOptionSetSelectionSnapshot("conv_1")).resolves.toBeNull();
    expect(state.whatsapp_ticket_concierge_option_sets[0]).toMatchObject({
      id: "set_expired",
      status: "expired",
    });
  });

  it("marks a selected option on the option set", async () => {
    state.whatsapp_ticket_concierge_option_sets = [
      {
        id: "set_1",
        run_id: "run_1",
        conversation_id: "conv_1",
        selected_option_id: null,
        status: "active",
      },
    ];

    await selectConciergeOption({
      optionId: "opt_2",
      optionSetId: "set_1",
    });

    expect(state.whatsapp_ticket_concierge_option_sets[0]).toMatchObject({
      selected_option_id: "opt_2",
      status: "selected",
    });
  });

  it("updates concierge run state after sending options or checkout results", async () => {
    state.whatsapp_ticket_concierge_runs = [
      {
        id: "run_1",
        last_checkout_url: null,
        last_error: null,
        latest_inbound_message_id: null,
        status: "pending_options",
      },
    ];

    await updateRunState({
      lastCheckoutUrl: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      lastError: null,
      latestInboundMessageId: "db_msg_2",
      runId: "run_1",
      status: "checkout_ready",
    });

    expect(state.whatsapp_ticket_concierge_runs[0]).toMatchObject({
      last_checkout_url: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
      last_error: null,
      latest_inbound_message_id: "db_msg_2",
      status: "checkout_ready",
    });
  });

  it("returns the most recent run for a conversation", async () => {
    state.whatsapp_ticket_concierge_runs = [
      {
        conversation_id: "conv_1",
        customer_message: "old",
        id: "run_1",
        status: "expired",
        updated_at: "2026-04-01T00:00:00.000Z",
      },
      {
        conversation_id: "conv_1",
        customer_message: "new",
        id: "run_2",
        status: "options_sent",
        updated_at: "2026-04-01T00:10:00.000Z",
      },
    ];

    await expect(getLatestRunForConversation("conv_1")).resolves.toMatchObject({
      customerMessage: "new",
      id: "run_2",
      status: "options_sent",
    });
  });
});
