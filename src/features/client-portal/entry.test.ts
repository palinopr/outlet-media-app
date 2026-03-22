import { describe, expect, it, vi } from "vitest";
import type { MemberAccess } from "@/lib/member-access";
import { resolveClientPortalEntry } from "./entry";

const member = (overrides: Partial<MemberAccess> = {}): MemberAccess => ({
  clientId: "client_1",
  clientName: "Acme",
  clientSlug: "acme",
  memberId: "member_1",
  role: "member",
  scope: "all",
  ...overrides,
});

describe("resolveClientPortalEntry", () => {
  it("routes admins into the admin dashboard immediately", async () => {
    const result = await resolveClientPortalEntry(
      {
        emailAddresses: ["owner@example.com"],
        role: "admin",
        userId: "user_admin",
      },
      {
        acceptClientAccessInvite: vi.fn(),
        getMemberships: vi.fn(),
        listPendingClientAccessInvites: vi.fn(),
      },
    );

    expect(result).toEqual({
      destination: "/admin/dashboard",
      kind: "admin",
    });
  });

  it("accepts an invite id before computing the final portal destination", async () => {
    const acceptClientAccessInvite = vi.fn().mockResolvedValue({
      clientSlug: "acme",
    });
    const getMemberships = vi.fn().mockResolvedValue([member()]);

    const result = await resolveClientPortalEntry(
      {
        emailAddresses: ["member@example.com"],
        inviteId: "invite_1",
        role: "client",
        userId: "user_1",
      },
      {
        acceptClientAccessInvite,
        getMemberships,
        listPendingClientAccessInvites: vi.fn(),
      },
    );

    expect(acceptClientAccessInvite).toHaveBeenCalledWith({
      emailAddresses: ["member@example.com"],
      inviteId: "invite_1",
      userId: "user_1",
    });
    expect(result).toEqual({
      clientSlug: "acme",
      destination: "/client/acme",
      kind: "portal",
      memberships: [member()],
    });
  });

  it("falls back to the pending state when the user has no memberships but still has an invite", async () => {
    const pendingInvites = [
      {
        clientId: "client_1",
        clientRole: "member" as const,
        clientSlug: "acme",
        createdAt: "2026-03-22T00:00:00.000Z",
        email: "member@example.com",
        id: "invite_1",
        status: "pending" as const,
      },
    ];

    const result = await resolveClientPortalEntry(
      {
        emailAddresses: ["member@example.com"],
        role: "client",
        userId: "user_1",
      },
      {
        acceptClientAccessInvite: vi.fn().mockResolvedValue(null),
        getMemberships: vi.fn().mockResolvedValue([]),
        listPendingClientAccessInvites: vi.fn().mockResolvedValue(pendingInvites),
      },
    );

    expect(result).toEqual({
      destination: "/client/pending",
      kind: "pending",
      pendingInvites,
    });
  });
});
