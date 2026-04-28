import { describe, expect, it } from "vitest";
import {
  buildConnectedAccountsSummary,
  getConnectedAccountHealth,
  type ConnectedAccount,
} from "@/features/settings/connected-accounts";

const now = new Date("2026-03-06T12:00:00.000Z");

function account(overrides: Partial<ConnectedAccount>): ConnectedAccount {
  return {
    ad_account_id: "act_1",
    ad_account_name: "Account",
    client_slug: "zamora",
    connected_at: "2026-03-01T12:00:00.000Z",
    id: "acct_1",
    last_used_at: "2026-03-05T12:00:00.000Z",
    status: "active",
    token_expires_at: "2026-04-06T12:00:00.000Z",
    ...overrides,
  };
}

describe("connected account health", () => {
  it("classifies healthy, expiring, stale, and disconnected Meta accounts", () => {
    expect(getConnectedAccountHealth(account({}), now).key).toBe("healthy");
    expect(
      getConnectedAccountHealth(
        account({ token_expires_at: "2026-03-08T12:00:00.000Z" }),
        now,
      ).key,
    ).toBe("expiring_soon");
    expect(
      getConnectedAccountHealth(
        account({ last_used_at: "2026-01-01T12:00:00.000Z" }),
        now,
      ).key,
    ).toBe("stale");
    expect(getConnectedAccountHealth(account({ status: "revoked" }), now).key).toBe(
      "needs_reconnection",
    );
  });

  it("summarizes attention counts without pulling in client or user setup state", () => {
    expect(
      buildConnectedAccountsSummary(
        [
          account({ id: "healthy" }),
          account({ id: "stale", last_used_at: "2026-01-01T12:00:00.000Z" }),
          account({ id: "expired", token_expires_at: "2026-03-01T12:00:00.000Z" }),
        ],
        now,
      ),
    ).toMatchObject({
      attentionCount: 2,
      healthyCount: 1,
      needsReconnectionCount: 1,
      staleCount: 1,
      totalCount: 3,
    });
  });
});
