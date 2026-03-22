import { describe, expect, it } from "vitest";
import { buildActionableInvitations } from "./server";

describe("buildActionableInvitations", () => {
  it("prefers Clerk-enriched status over the stored ledger status", () => {
    const invitations = buildActionableInvitations([
      {
        clerkInvitationId: "clerk_invite_1",
        clerkStatus: "expired",
        clientId: "client_1",
        clientRole: "member",
        clientSlug: "zamora",
        createdAt: "2026-03-02T00:00:00.000Z",
        email: "invitee@example.com",
        id: "invite_1",
        status: "pending",
      },
    ]);

    expect(invitations).toHaveLength(1);
    expect(invitations[0]).toMatchObject({
      clientSlug: "zamora",
      email: "invitee@example.com",
      id: "invite_1",
      status: "expired",
    });
  });

  it("filters invitations by client id and excluded emails", () => {
    const invitations = buildActionableInvitations(
      [
        {
          clientId: "client_1",
          clientRole: "member",
          clientSlug: "zamora",
          createdAt: "2026-03-03T00:00:00.000Z",
          email: "keep@example.com",
          id: "inv_1",
          status: "pending",
        },
        {
          clientId: "client_1",
          clientRole: "member",
          clientSlug: "zamora",
          createdAt: "2026-03-02T00:00:00.000Z",
          email: "skip@example.com",
          id: "inv_2",
          status: "pending",
        },
        {
          clientId: "client_2",
          clientRole: "member",
          clientSlug: "beamina",
          createdAt: "2026-03-01T00:00:00.000Z",
          email: "other@example.com",
          id: "inv_3",
          status: "pending",
        },
      ],
      {
        clientId: "client_1",
        excludeEmails: ["skip@example.com"],
      },
    );

    expect(invitations).toHaveLength(1);
    expect(invitations[0]?.email).toBe("keep@example.com");
  });

  it("prioritizes pending invites ahead of expired cleanup", () => {
    const invitations = buildActionableInvitations([
      {
        clientId: "client_1",
        clientRole: "member",
        clientSlug: "zamora",
        createdAt: "2026-03-04T00:00:00.000Z",
        email: "expired@example.com",
        id: "inv_expired",
        status: "expired",
      },
      {
        clientId: "client_1",
        clientRole: "member",
        clientSlug: "zamora",
        createdAt: "2026-03-02T00:00:00.000Z",
        email: "older-pending@example.com",
        id: "inv_pending_older",
        status: "pending",
      },
      {
        clientId: "client_1",
        clientRole: "member",
        clientSlug: "zamora",
        createdAt: "2026-03-03T00:00:00.000Z",
        email: "newer-pending@example.com",
        id: "inv_pending_newer",
        status: "pending",
      },
    ]);

    expect(invitations.map((invitation) => invitation.id)).toEqual([
      "inv_pending_newer",
      "inv_pending_older",
      "inv_expired",
    ]);
  });
});
