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
  getMemberships: vi.fn(),
}));

vi.mock("./entry", () => ({
  getUserEmailAddresses: vi.fn(() => ["member@example.com"]),
  resolveClientPortalEntry: vi.fn(),
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { resolveClientPortalEntry } from "./entry";
import { requireClientAccess } from "./access";

const mockedAuth = vi.mocked(auth);
const mockedCurrentUser = vi.mocked(currentUser);
const mockedGetMemberAccessForSlug = vi.mocked(getMemberAccessForSlug);
const mockedResolveClientPortalEntry = vi.mocked(resolveClientPortalEntry);

describe("requireClientAccess", () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockedResolveClientPortalEntry.mockResolvedValue({
      clientSlug: "acme",
      destination: "/client/acme",
      kind: "portal",
      memberships: [],
    });
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

  it("redirects members without a valid invite or membership to the pending page", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_member" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue({
      publicMetadata: { role: "client" },
    } as unknown as Awaited<ReturnType<typeof currentUser>>);
    mockedResolveClientPortalEntry.mockResolvedValue({
      destination: "/client/pending",
      kind: "pending",
      pendingInvites: [],
    });

    await expect(requireClientAccess("acme")).rejects.toThrow("redirect:/client/pending");
  });
});
