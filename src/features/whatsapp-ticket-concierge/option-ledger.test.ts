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

import { createOptionSet, replaceActiveOptionSet } from "./option-ledger";

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
});
