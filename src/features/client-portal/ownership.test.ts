import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/member-access", () => ({
  getMemberAccessForSlug: vi.fn(),
}));

import { getMemberAccessForSlug } from "@/lib/member-access";
import { requireClientOwner } from "./ownership";

describe("requireClientOwner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows client owners", async () => {
    vi.mocked(getMemberAccessForSlug).mockResolvedValue({
      allowedCampaignIds: null,
      allowedEventIds: null,
      clientId: "client_1",
      clientName: "Zamora",
      clientSlug: "zamora",
      memberId: "member_1",
      role: "owner",
      scope: "all",
    });

    await expect(requireClientOwner("user_1", "zamora")).resolves.toBeNull();
  });

  it("blocks non-owners and missing memberships", async () => {
    vi.mocked(getMemberAccessForSlug).mockResolvedValueOnce({
      allowedCampaignIds: null,
      allowedEventIds: null,
      clientId: "client_1",
      clientName: "Zamora",
      clientSlug: "zamora",
      memberId: "member_2",
      role: "member",
      scope: "all",
    });

    const nonOwnerResponse = await requireClientOwner("user_2", "zamora", "connect ad accounts");
    expect(nonOwnerResponse?.status).toBe(403);

    vi.mocked(getMemberAccessForSlug).mockResolvedValueOnce(null);
    const missingResponse = await requireClientOwner("user_3", "zamora");
    expect(missingResponse?.status).toBe(403);
  });
});
