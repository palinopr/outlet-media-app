import { beforeEach, describe, expect, it, vi } from "vitest";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    whatsapp_ticket_concierge_bans: [] as Record<string, unknown>[],
  };

  const supabaseAdmin = {
    from(table: string) {
      const queryState = {
        data: state[table as keyof typeof state] as Record<string, unknown>[],
        filters: [] as Array<{ field: string; value: unknown }>,
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
          const rows = applyFilters();
          const current = rows[0];
          if (current) {
            Object.assign(current, payload);
            return { data: current, error: null };
          }
          queryState.data.push(payload);
          return { data: payload, error: null };
        },
      };

      return chain;
    },
    async rpc(name: string, args: Record<string, unknown>) {
      if (name !== "record_whatsapp_ticket_concierge_tamper_strike") {
        return { data: null, error: { message: `unknown rpc ${name}` } };
      }

      const waId = String(args.p_wa_id);
      const threshold = Number(args.p_threshold ?? 3);
      const existing = state.whatsapp_ticket_concierge_bans.find((row) => row.wa_id === waId);
      const strikeCount = Number(existing?.strike_count ?? 0) + 1;
      const row = {
        banned_at: existing?.banned_at ?? new Date().toISOString(),
        conversation_id: args.p_conversation_id ?? null,
        created_at: existing?.created_at ?? new Date().toISOString(),
        last_inbound_message_id: args.p_last_inbound_message_id ?? existing?.last_inbound_message_id ?? null,
        reason: String(args.p_reason),
        strike_count: strikeCount,
        updated_at: new Date().toISOString(),
        wa_id: waId,
      };

      if (existing) {
        Object.assign(existing, row);
      } else {
        state.whatsapp_ticket_concierge_bans.push(row);
      }

      return {
        data: [
          {
            banned: strikeCount >= threshold,
            reason: row.reason,
            strike_count: strikeCount,
            wa_id: waId,
          },
        ],
        error: null,
      };
    },
  };

  return { state, supabaseAdmin };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

import {
  getTicketConciergeSecurityDisposition,
  recordConciergeTamperStrike,
} from "./security";

describe("ticket concierge security", () => {
  beforeEach(() => {
    state.whatsapp_ticket_concierge_bans = [];
  });

  it("allows an unbanned WhatsApp number", async () => {
    await expect(
      getTicketConciergeSecurityDisposition({
        conversationId: "conv_1",
        waId: "13055551212",
      }),
    ).resolves.toEqual({ allowed: true, banned: false });
  });

  it("records a tamper strike without banning below threshold", async () => {
    await expect(
      recordConciergeTamperStrike({
        conversationId: "conv_1",
        reason: "stale_option_replay",
        threshold: 3,
        waId: "13055551212",
      }),
    ).resolves.toMatchObject({
      banned: false,
      strikeCount: 1,
    });
  });

  it("keeps the WhatsApp number allowed until the threshold is reached", async () => {
    await recordConciergeTamperStrike({
      conversationId: "conv_1",
      reason: "stale_option_replay",
      threshold: 3,
      waId: "13055551212",
    });

    await expect(
      getTicketConciergeSecurityDisposition({
        conversationId: "conv_1",
        waId: "13055551212",
      }),
    ).resolves.toEqual({ allowed: true, banned: false });
  });

  it("ignores non-tamper replies while an option set is active", async () => {
    await expect(
      recordConciergeTamperStrike({
        conversationId: "conv_1",
        reason: "other",
        threshold: 3,
        waId: "13055551212",
      }),
    ).resolves.toMatchObject({
      banned: false,
      strikeCount: 0,
    });
  });
});
