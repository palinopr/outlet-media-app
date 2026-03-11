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

vi.mock("./config", () => ({
  getClientPortalConfig: vi.fn(),
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { getClientPortalConfig } from "./config";
import { requireClientAccess, requireClientEventsAccess } from "./access";

const mockedAuth = vi.mocked(auth);
const mockedCurrentUser = vi.mocked(currentUser);
const mockedGetMemberAccessForSlug = vi.mocked(getMemberAccessForSlug);
const mockedGetClientPortalConfig = vi.mocked(getClientPortalConfig);

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

    const result = await requireClientAccess("acme");

    expect(result).toEqual({
      userId: "user_member",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
    });
  });

  it("redirects members without access back to the client picker", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_member" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue({
      publicMetadata: { role: "client" },
    } as unknown as Awaited<ReturnType<typeof currentUser>>);
    mockedGetMemberAccessForSlug.mockResolvedValue(null);

    await expect(requireClientAccess("acme")).rejects.toThrow("redirect:/client");
  });

  it("allows event routes when the client has events enabled", async () => {
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
    mockedGetClientPortalConfig.mockResolvedValue({
      clientId: "client_1",
      eventsEnabled: true,
    });

    const result = await requireClientEventsAccess("acme");

    expect(result.scope).toEqual({
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
    });
  });

  it("redirects event routes when events are disabled for the client", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_member" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue({
      publicMetadata: { role: "client" },
    } as unknown as Awaited<ReturnType<typeof currentUser>>);
    mockedGetMemberAccessForSlug.mockResolvedValue({
      allowedCampaignIds: null,
      allowedEventIds: null,
      clientId: "client_1",
      clientName: "Acme",
      clientSlug: "acme",
      memberId: "member_1",
      role: "member",
      scope: "all",
    });
    mockedGetClientPortalConfig.mockResolvedValue({
      clientId: "client_1",
      eventsEnabled: false,
    });

    await expect(requireClientEventsAccess("acme")).rejects.toThrow(
      "redirect:/client/acme",
    );
  });
});
