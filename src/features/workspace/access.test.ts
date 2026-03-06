import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireWorkspaceClientAccess } from "./access";

const { currentUser, getMemberAccessForSlug } = vi.hoisted(() => ({
  currentUser: vi.fn(),
  getMemberAccessForSlug: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/member-access", () => ({
  getMemberAccessForSlug,
}));

describe("requireWorkspaceClientAccess", () => {
  beforeEach(() => {
    currentUser.mockReset();
    getMemberAccessForSlug.mockReset();
  });

  it("allows admins into the internal admin workspace", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });

    const result = await requireWorkspaceClientAccess("user-admin", null);

    expect(result).toEqual({ clientSlug: "admin", isAdmin: true });
  });

  it("blocks non-admin users from the internal admin workspace", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });

    const result = await requireWorkspaceClientAccess("user-client", null);

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(403);
  });

  it("allows client members into their client workspace", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });
    getMemberAccessForSlug.mockResolvedValue({
      allowedCampaignIds: null,
      allowedEventIds: null,
      clientId: "client-1",
      clientName: "Zamora",
      clientSlug: "zamora",
      memberId: "member-1",
      role: "member",
      scope: "all",
    });

    const result = await requireWorkspaceClientAccess("user-client", "zamora");

    expect(result).toEqual({ clientSlug: "zamora", isAdmin: false });
  });

  it("blocks client users without membership from another client workspace", async () => {
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });
    getMemberAccessForSlug.mockResolvedValue(null);

    const result = await requireWorkspaceClientAccess("user-client", "beamina");

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(403);
  });
});
