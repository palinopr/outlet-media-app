import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((destination: string) => {
    throw new Error(`redirect:${destination}`);
  }),
}));

vi.mock("@/lib/member-access", () => ({
  getMemberAccessForSlug: vi.fn(),
}));

vi.mock("@/lib/service-guard", () => ({
  requireService: vi.fn(),
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { requireService } from "@/lib/service-guard";
import { requireClientAccess } from "./access";

const mockedAuth = vi.mocked(auth);
const mockedCurrentUser = vi.mocked(currentUser);
const mockedGetMemberAccessForSlug = vi.mocked(getMemberAccessForSlug);
const mockedRequireService = vi.mocked(requireService);

describe("requireClientAccess", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("allows admins to preview client portal routes without membership", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_admin" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue({
      publicMetadata: { role: "admin" },
    } as unknown as Awaited<ReturnType<typeof currentUser>>);

    const result = await requireClientAccess("acme");

    expect(result).toEqual({ userId: "user_admin", scope: undefined });
    expect(mockedGetMemberAccessForSlug).not.toHaveBeenCalled();
  });

  it("returns assigned scope for scoped client members", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_member" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue({
      publicMetadata: { role: "client" },
    } as unknown as Awaited<ReturnType<typeof currentUser>>);
    mockedGetMemberAccessForSlug.mockResolvedValue({
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
      clientId: "client_1",
      clientName: "Acme",
      clientSlug: "acme",
      memberId: "member_1",
      role: "member",
      scope: "assigned",
    });

    const result = await requireClientAccess("acme", "workspace");

    expect(result).toEqual({
      userId: "user_member",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
    });
    expect(mockedRequireService).toHaveBeenCalledWith("acme", "workspace");
  });

  it("redirects members without access back to the client picker", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_member" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue({
      publicMetadata: { role: "client" },
    } as unknown as Awaited<ReturnType<typeof currentUser>>);
    mockedGetMemberAccessForSlug.mockResolvedValue(null);

    await expect(requireClientAccess("acme")).rejects.toThrow("redirect:/client");
  });
});
