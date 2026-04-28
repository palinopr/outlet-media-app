import { beforeEach, describe, expect, it, vi } from "vitest";

const { clientMaybeSingle, overrideUpsert, supabaseAdmin } = vi.hoisted(() => {
  const clientMaybeSingle = vi.fn();
  const overrideUpsert = vi.fn();

  const supabaseAdmin = {
    from: vi.fn((table: string) => {
      if (table === "clients") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({ maybeSingle: clientMaybeSingle })),
          })),
        };
      }

      if (table === "campaign_client_overrides") {
        return { upsert: overrideUpsert };
      }

      throw new Error(`Unexpected table ${table}`);
    }),
  };

  return { clientMaybeSingle, overrideUpsert, supabaseAdmin };
});

vi.mock("@/lib/supabase", () => ({ supabaseAdmin }));
vi.mock("@/lib/campaign-client-assignment", () => ({
  applyEffectiveCampaignClientSlugs: vi.fn(),
  getEffectiveCampaignRowById: vi.fn(),
}));
vi.mock("@/features/system-events/server", () => ({ logSystemEvent: vi.fn() }));
vi.mock("./audit", () => ({ logAudit: vi.fn() }));
vi.mock("./meta-sync", () => ({
  syncCampaignBudget: vi.fn(),
  syncCampaignStatus: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("campaign assignment actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clientMaybeSingle.mockResolvedValue({ data: null, error: null });
    overrideUpsert.mockResolvedValue({ error: null });
  });

  it("does not allow assigning campaigns to the unknown placeholder", async () => {
    const { bulkAssignClient } = await import("./campaigns");

    await expect(
      bulkAssignClient({ campaignIds: ["cmp_1"], clientSlug: "unknown" }),
    ).rejects.toThrow();

    expect(clientMaybeSingle).not.toHaveBeenCalled();
    expect(overrideUpsert).not.toHaveBeenCalled();
  });

  it("requires an existing active client before writing campaign overrides", async () => {
    const { bulkAssignClient } = await import("./campaigns");

    await expect(
      bulkAssignClient({ campaignIds: ["cmp_1"], clientSlug: "acme" }),
    ).rejects.toThrow("Client not found. Create the client before assigning campaigns.");

    expect(clientMaybeSingle).toHaveBeenCalledTimes(1);
    expect(overrideUpsert).not.toHaveBeenCalled();
  });
});
