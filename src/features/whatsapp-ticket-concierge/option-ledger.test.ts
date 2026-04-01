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
        filters: [] as Array<{ field: string; value: unknown }>,
        orderField: null as string | null,
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
        async insert(payload: Record<string, unknown>) {
          queryState.data.push(payload);
          return { data: payload, error: null };
        },
        async update(payload: Record<string, unknown>) {
          const rows = applyFilters();
          for (const row of rows) {
            Object.assign(row, payload);
          }
          return { data: rows[0] ?? null, error: null };
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
        async delete() {
          const rows = applyFilters();
          queryState.data = queryState.data.filter((row) => !rows.includes(row));
          return { data: rows, error: null };
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

import { createOptionSet } from "./option-ledger";

describe("option ledger", () => {
  beforeEach(() => {
    state.whatsapp_ticket_concierge_checkout_attempts = [];
    state.whatsapp_ticket_concierge_option_sets = [];
    state.whatsapp_ticket_concierge_options = [];
    state.whatsapp_ticket_concierge_runs = [];
  });

  it("creates an active option set with ranked options", async () => {
    await expect(
      createOptionSet({
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
      }),
    ).resolves.toMatchObject({
      options: [expect.objectContaining({ ordinal: 1 })],
      status: "active",
    });
  });
});
