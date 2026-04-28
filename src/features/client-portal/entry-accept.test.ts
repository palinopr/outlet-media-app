import { beforeEach, describe, expect, it, vi } from "vitest";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    existingMembership: null as { id: string; role: string } | null,
    insertMembership: vi.fn(),
    inviteUpdate: vi.fn(),
    membershipUpdate: vi.fn(),
  };

  function clientAccessInvitesQuery() {
    return {
      select() {
        return this;
      },
      eq() {
        return this;
      },
      maybeSingle: vi.fn(async () => ({
        data: {
          accepted_by_clerk_user_id: null,
          client_id: "client_1",
          client_role: "owner",
          clients: { name: "Acme", slug: "acme" },
          email: "member@example.com",
          id: "invite_1",
          status: "pending",
        },
        error: null,
      })),
      update: state.inviteUpdate.mockImplementation(() => ({
        eq: vi.fn(async () => ({ error: null })),
      })),
    };
  }

  function clientMembersQuery() {
    return {
      select() {
        return this;
      },
      eq() {
        return this;
      },
      maybeSingle: vi.fn(async () => ({
        data: state.existingMembership,
        error: null,
      })),
      insert: state.insertMembership.mockResolvedValue({ error: null }),
      update: state.membershipUpdate.mockImplementation(() => ({
        eq: vi.fn(async () => ({ error: null })),
      })),
    };
  }

  const supabaseAdmin = {
    from(table: string) {
      if (table === "client_access_invites") return clientAccessInvitesQuery();
      if (table === "client_members") return clientMembersQuery();
      throw new Error(`Unexpected table ${table}`);
    },
  };

  return { state, supabaseAdmin };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

describe("acceptClientAccessInvite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.existingMembership = null;
  });

  it("preserves an existing member row so assigned campaigns and events stay attached", async () => {
    state.existingMembership = { id: "member_1", role: "member" };

    const { acceptClientAccessInvite } = await import("./entry");
    const result = await acceptClientAccessInvite({
      emailAddresses: ["member@example.com"],
      inviteId: "invite_1",
      userId: "user_1",
    });

    expect(result).toEqual({
      clientId: "client_1",
      clientName: "Acme",
      clientSlug: "acme",
    });
    expect(state.insertMembership).not.toHaveBeenCalled();
    expect(state.membershipUpdate).toHaveBeenCalledWith({ role: "owner" });
    expect(state.inviteUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        accepted_by_clerk_user_id: "user_1",
        status: "accepted",
      }),
    );
  });

  it("creates a member row when the invitee has not been assigned yet", async () => {
    const { acceptClientAccessInvite } = await import("./entry");
    await acceptClientAccessInvite({
      emailAddresses: ["member@example.com"],
      inviteId: "invite_1",
      userId: "user_1",
    });

    expect(state.insertMembership).toHaveBeenCalledWith({
      client_id: "client_1",
      clerk_user_id: "user_1",
      role: "owner",
    });
    expect(state.membershipUpdate).not.toHaveBeenCalled();
  });
});
