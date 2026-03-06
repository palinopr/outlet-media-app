import { describe, expect, it } from "vitest";
import {
  buildConnectedAccountsSummary,
  getConnectedAccountHealth,
  type ConnectedAccount,
} from "@/features/settings/connected-accounts";

function makeAccount(overrides: Partial<ConnectedAccount> = {}): ConnectedAccount {
  return {
    ad_account_id: "act_123",
    ad_account_name: "Main Account",
    connected_at: "2026-03-01T12:00:00.000Z",
    id: "acct_1",
    last_used_at: "2026-03-05T12:00:00.000Z",
    status: "active",
    token_expires_at: "2026-04-01T12:00:00.000Z",
    ...overrides,
  };
}

describe("getConnectedAccountHealth", () => {
  const now = new Date("2026-03-06T12:00:00.000Z");

  it("classifies healthy, expiring, stale, and disconnected accounts", () => {
    expect(getConnectedAccountHealth(makeAccount(), now)).toMatchObject({
      key: "healthy",
      label: "Healthy",
    });

    expect(
      getConnectedAccountHealth(
        makeAccount({ token_expires_at: "2026-03-10T12:00:00.000Z" }),
        now,
      ),
    ).toMatchObject({
      key: "expiring_soon",
    });

    expect(
      getConnectedAccountHealth(
        makeAccount({ last_used_at: "2026-02-01T12:00:00.000Z" }),
        now,
      ),
    ).toMatchObject({
      key: "stale",
    });

    expect(
      getConnectedAccountHealth(
        makeAccount({ status: "disconnected" }),
        now,
      ),
    ).toMatchObject({
      key: "needs_reconnection",
    });
  });
});

describe("buildConnectedAccountsSummary", () => {
  it("counts healthy and attention links separately", () => {
    const summary = buildConnectedAccountsSummary(
      [
        makeAccount(),
        makeAccount({ id: "acct_2", token_expires_at: "2026-03-08T12:00:00.000Z" }),
        makeAccount({ id: "acct_3", last_used_at: "2026-01-20T12:00:00.000Z" }),
        makeAccount({ id: "acct_4", status: "disconnected" }),
      ],
      new Date("2026-03-06T12:00:00.000Z"),
    );

    expect(summary).toMatchObject({
      attentionCount: 3,
      expiringSoonCount: 1,
      healthyCount: 1,
      needsReconnectionCount: 1,
      staleCount: 1,
      totalCount: 4,
    });
  });
});
