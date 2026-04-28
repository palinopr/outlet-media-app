import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  adminGuard,
  clientMaybeSingle,
  clientSelect,
  createInvitation,
  getUserList,
  updateUserMetadata,
  inviteInsert,
  inviteInsertSingle,
  inviteUpdate,
  memberInsert,
  memberMaybeSingle,
  memberUpdate,
  clerkClientMock,
} = vi.hoisted(() => {
  const clientMaybeSingle = vi.fn();
  const clientQuery = {
    eq: vi.fn(() => ({ maybeSingle: clientMaybeSingle })),
  };
  const clientSelect = vi.fn(() => clientQuery);

  const inviteInsertSingle = vi.fn();
  const inviteInsertSelect = vi.fn(() => ({ single: inviteInsertSingle }));
  const inviteInsert = vi.fn(() => ({ select: inviteInsertSelect }));
  const inviteUpdateQuery = {
    eq: vi.fn(() => inviteUpdateQuery),
  };
  const inviteUpdate = vi.fn(() => inviteUpdateQuery);

  const memberMaybeSingle = vi.fn();
  const memberQuery = {
    eq: vi.fn(() => memberQuery),
    insert: vi.fn(),
    maybeSingle: memberMaybeSingle,
    select: vi.fn(() => memberQuery),
    update: vi.fn(() => ({ eq: vi.fn(async () => ({ error: null })) })),
  };
  memberQuery.insert.mockResolvedValue({ error: null });
  const memberInsert = memberQuery.insert;
  const memberUpdate = memberQuery.update;

  const createInvitation = vi.fn();
  const getUserList = vi.fn();
  const updateUserMetadata = vi.fn();
  const clerkClientMock = vi.fn(async () => ({
    invitations: {
      createInvitation,
    },
    users: {
      getUserList,
      updateUserMetadata,
    },
  }));

  return {
    adminGuard: vi.fn(),
    clientMaybeSingle,
    clientSelect,
    createInvitation,
    getUserList,
    updateUserMetadata,
    inviteInsert,
    inviteInsertSingle,
    inviteUpdate,
    memberInsert,
    memberMaybeSingle,
    memberUpdate,
    clerkClientMock,
  };
});

vi.mock("@/lib/api-helpers", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-helpers")>("@/lib/api-helpers");
  return {
    ...actual,
    adminGuard,
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: clerkClientMock,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn((table: string) => {
      if (table === "clients") return { select: clientSelect };
      if (table === "client_access_invites") {
        return {
          insert: inviteInsert,
          update: inviteUpdate,
        };
      }
      if (table === "client_members") {
        return {
          insert: memberInsert,
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({ maybeSingle: memberMaybeSingle })),
            })),
          })),
          update: memberUpdate,
        };
      }
      throw new Error(`Unexpected table ${table}`);
    }),
  },
}));

describe("POST /api/admin/invite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminGuard.mockResolvedValue(null);
    clientMaybeSingle.mockResolvedValue({
      data: { id: "client_1", slug: "acme" },
      error: null,
    });
    getUserList.mockResolvedValue({ data: [] });
    memberMaybeSingle.mockResolvedValue({ data: null, error: null });
    memberInsert.mockResolvedValue({ error: null });
    inviteInsertSingle.mockResolvedValue({
      data: { id: "invite_1" },
      error: null,
    });
    createInvitation.mockResolvedValue({
      id: "clerk_invite_1",
    });
    updateUserMetadata.mockResolvedValue({});
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");
  });

  it("requires admin access", async () => {
    adminGuard.mockResolvedValue(Response.json({ error: "Forbidden" }, { status: 403 }));

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/admin/invite", {
        body: JSON.stringify({ email: "member@example.com", clientId: "client_1" }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );

    expect(response.status).toBe(403);
    expect(inviteInsert).not.toHaveBeenCalled();
    expect(createInvitation).not.toHaveBeenCalled();
  });

  it("creates a DB invite row and passes only transition metadata into Clerk", async () => {
    const { POST } = await import("./route");

    const response = await POST(
      new Request("https://example.com/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "member@example.com",
          clientId: "client_1",
          client_role: "member",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(clientSelect).toHaveBeenCalledWith("id, slug");
    expect(getUserList).toHaveBeenCalledWith({
      emailAddress: ["member@example.com"],
      limit: 1,
    });
    expect(inviteInsert).toHaveBeenCalledWith({
      client_id: "client_1",
      client_role: "member",
      email: "member@example.com",
    });
    expect(createInvitation).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "member@example.com",
        ignoreExisting: true,
        redirectUrl: expect.stringContaining("/sign-up"),
        publicMetadata: expect.objectContaining({
          client_id: "client_1",
          client_role: "member",
          invite_id: "invite_1",
        }),
      }),
    );
    expect(inviteUpdate).toHaveBeenCalledWith({
      clerk_invitation_id: "clerk_invite_1",
    });
  });

  it("grants admin access immediately when the invited admin email already has a Clerk user", async () => {
    getUserList.mockResolvedValue({ data: [{ id: "user_existing", publicMetadata: { team: "ops" } }] });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          role: "admin",
        }),
      }),
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      message: "Admin access granted to existing user.",
    });
    expect(updateUserMetadata).toHaveBeenCalledWith("user_existing", {
      publicMetadata: { team: "ops", role: "admin" },
    });
    expect(inviteInsert).not.toHaveBeenCalled();
    expect(memberInsert).not.toHaveBeenCalled();
    expect(createInvitation).not.toHaveBeenCalled();
  });

  it("grants client access immediately when the invited email already has a Clerk user", async () => {
    getUserList.mockResolvedValue({ data: [{ id: "user_existing" }] });

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "member@example.com",
          clientId: "client_1",
          client_role: "owner",
        }),
      }),
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      message: "Access granted to existing user.",
    });
    expect(memberInsert).toHaveBeenCalledWith({
      client_id: "client_1",
      clerk_user_id: "user_existing",
      role: "owner",
    });
    expect(inviteUpdate).toHaveBeenCalledWith(expect.objectContaining({
      accepted_by_clerk_user_id: "user_existing",
      status: "accepted",
    }));
    expect(inviteInsert).not.toHaveBeenCalled();
    expect(createInvitation).not.toHaveBeenCalled();
  });
});
