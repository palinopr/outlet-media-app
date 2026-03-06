import { describe, expect, it } from "vitest";
import { buildActionableInvitations } from "./server";

describe("buildActionableInvitations", () => {
  it("deduplicates by email and prefers pending over expired", () => {
    const invitations = buildActionableInvitations([
      {
        createdAt: Date.parse("2026-03-01T00:00:00.000Z"),
        emailAddress: "invitee@example.com",
        id: "inv_expired",
        publicMetadata: { client_slug: "zamora" },
        status: "expired",
      },
      {
        createdAt: Date.parse("2026-03-02T00:00:00.000Z"),
        emailAddress: "invitee@example.com",
        id: "inv_pending",
        publicMetadata: { client_slug: "zamora" },
        status: "pending",
      },
    ]);

    expect(invitations).toHaveLength(1);
    expect(invitations[0]).toMatchObject({
      clientSlug: "zamora",
      email: "invitee@example.com",
      id: "inv_pending",
      status: "pending",
    });
  });

  it("filters invitations by client slug and excluded emails", () => {
    const invitations = buildActionableInvitations(
      [
        {
          createdAt: Date.parse("2026-03-03T00:00:00.000Z"),
          emailAddress: "keep@example.com",
          id: "inv_1",
          publicMetadata: { client_slug: "zamora" },
          status: "pending",
        },
        {
          createdAt: Date.parse("2026-03-02T00:00:00.000Z"),
          emailAddress: "skip@example.com",
          id: "inv_2",
          publicMetadata: { client_slug: "zamora" },
          status: "pending",
        },
        {
          createdAt: Date.parse("2026-03-01T00:00:00.000Z"),
          emailAddress: "other@example.com",
          id: "inv_3",
          publicMetadata: { client_slug: "beamina" },
          status: "pending",
        },
      ],
      {
        clientSlug: "zamora",
        excludeEmails: ["skip@example.com"],
      },
    );

    expect(invitations).toHaveLength(1);
    expect(invitations[0]?.email).toBe("keep@example.com");
  });

  it("prioritizes pending invites ahead of expired cleanup", () => {
    const invitations = buildActionableInvitations([
      {
        createdAt: Date.parse("2026-03-04T00:00:00.000Z"),
        emailAddress: "expired@example.com",
        id: "inv_expired",
        publicMetadata: { client_slug: "zamora" },
        status: "expired",
      },
      {
        createdAt: Date.parse("2026-03-02T00:00:00.000Z"),
        emailAddress: "older-pending@example.com",
        id: "inv_pending_older",
        publicMetadata: { client_slug: "zamora" },
        status: "pending",
      },
      {
        createdAt: Date.parse("2026-03-03T00:00:00.000Z"),
        emailAddress: "newer-pending@example.com",
        id: "inv_pending_newer",
        publicMetadata: { client_slug: "zamora" },
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
