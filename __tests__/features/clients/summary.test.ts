import { describe, expect, it } from "vitest";
import {
  compareClientAccountHealth,
  getClientAttentionPressure,
  hasClientAttention,
} from "@/features/clients/summary";

describe("client account summary helpers", () => {
  it("treats connection risk as the only client attention signal", () => {
    expect(
      getClientAttentionPressure({
        connectionRiskAccounts: 1,
        needsAttention: 1,
      }),
    ).toBe(4);

    expect(
      hasClientAttention({
        connectionRiskAccounts: 0,
        needsAttention: 0,
      }),
    ).toBe(false);
  });

  it("ranks clients by connection pressure before spend", () => {
    const ranked = [
      {
        connectedAccountCount: 2,
        connectionRiskAccounts: 0,
        name: "Higher spend",
        needsAttention: 0,
        totalSpend: 1000,
      },
      {
        connectedAccountCount: 1,
        connectionRiskAccounts: 1,
        name: "Connection risk",
        needsAttention: 1,
        totalSpend: 100,
      },
    ].sort(compareClientAccountHealth);

    expect(ranked.map((client) => client.name)).toEqual(["Connection risk", "Higher spend"]);
  });
});
