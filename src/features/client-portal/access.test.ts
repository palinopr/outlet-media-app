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

vi.mock("./config", () => ({
  getClientPortalConfig: vi.fn(),
}));

vi.mock("./entry", () => ({
  getUserEmailAddresses: vi.fn(() => ["member@example.com"]),
  resolveClientPortalEntry: vi.fn(),
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { getMemberAccessForSlug } from "@/lib/member-access";
import { getClientPortalConfig } from "./config";
import { resolveClientPortalEntry } from "./entry";
import {
  requireClientAccess,
  requireClientAgentAccess,
  requireClientEventsAccess,
  requireClientReportsAccess,
  resolveClientAgentAccessForApi,
} from "./access";

const mockedAuth = vi.mocked(auth);
const mockedCurrentUser = vi.mocked(currentUser);
const mockedGetMemberAccessForSlug = vi.mocked(getMemberAccessForSlug);
const mockedGetClientPortalConfig = vi.mocked(getClientPortalConfig);
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
    mockedResolveClientPortalEntry.mockResolvedValue({
      clientSlug: "acme",
      destination: "/client/acme",
      kind: "portal",
      memberships: [],
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
      agentEnabled: false,
      clientId: "client_1",
      eventsEnabled: true,
      slug: "acme",
      reportsEnabled: true,
      brandName: null,
      logoUrl: null,
      logoAlt: null,
    });
    mockedResolveClientPortalEntry.mockResolvedValue({
      clientSlug: "acme",
      destination: "/client/acme",
      kind: "portal",
      memberships: [],
    });

    const result = await requireClientEventsAccess("acme");

    expect(result.scope).toEqual({
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
    });
  });

  it("allows agent routes when the client has agent access enabled", async () => {
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
      agentEnabled: true,
      clientId: "client_1",
      eventsEnabled: false,
      slug: "acme",
      reportsEnabled: true,
      brandName: null,
      logoUrl: null,
      logoAlt: null,
    });
    mockedResolveClientPortalEntry.mockResolvedValue({
      clientSlug: "acme",
      destination: "/client/acme",
      kind: "portal",
      memberships: [],
    });

    const result = await requireClientAgentAccess("acme");

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
      agentEnabled: false,
      clientId: "client_1",
      eventsEnabled: false,
      slug: "acme",
      reportsEnabled: true,
      brandName: null,
      logoUrl: null,
      logoAlt: null,
    });
    mockedResolveClientPortalEntry.mockResolvedValue({
      clientSlug: "acme",
      destination: "/client/acme",
      kind: "portal",
      memberships: [],
    });

    await expect(requireClientEventsAccess("acme")).rejects.toThrow(
      "redirect:/client/acme/campaigns",
    );
  });

  it("redirects agent routes when agent access is disabled for the client", async () => {
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
      agentEnabled: false,
      clientId: "client_1",
      eventsEnabled: true,
      slug: "acme",
      reportsEnabled: true,
      brandName: null,
      logoUrl: null,
      logoAlt: null,
    });
    mockedResolveClientPortalEntry.mockResolvedValue({
      clientSlug: "acme",
      destination: "/client/acme",
      kind: "portal",
      memberships: [],
    });

    await expect(requireClientAgentAccess("acme")).rejects.toThrow(
      "redirect:/client/acme/campaigns",
    );
  });

  it("redirects reports routes when reports are disabled for the client", async () => {
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
      agentEnabled: false,
      clientId: "client_1",
      eventsEnabled: true,
      slug: "acme",
      reportsEnabled: false,
      brandName: null,
      logoUrl: null,
      logoAlt: null,
    });
    mockedResolveClientPortalEntry.mockResolvedValue({
      clientSlug: "acme",
      destination: "/client/acme",
      kind: "portal",
      memberships: [],
    });

    await expect(requireClientReportsAccess("acme")).rejects.toThrow(
      "redirect:/client/acme",
    );
  });

  it("marks admin previews explicitly in API-safe agent access resolution", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_admin" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue({
      publicMetadata: { role: "admin" },
    } as unknown as Awaited<ReturnType<typeof currentUser>>);
    mockedGetClientPortalConfig.mockResolvedValue({
      agentEnabled: true,
      clientId: "client_1",
      eventsEnabled: true,
      slug: "acme",
      reportsEnabled: true,
      brandName: null,
      logoUrl: null,
      logoAlt: null,
    });

    const result = await resolveClientAgentAccessForApi("acme");

    expect(result).toMatchObject({
      clientId: "client_1",
      clientSlug: "acme",
      scope: undefined,
      userId: "user_admin",
      viewer: "admin_preview",
    });
    expect(mockedGetMemberAccessForSlug).not.toHaveBeenCalled();
  });
});
