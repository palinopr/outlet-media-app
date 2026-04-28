import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  adminGuard,
  createInvitation,
  inviteInsert,
  inviteInsertSingle,
  inviteUpdate,
  inviteUpdateEq,
  maybeSingle,
  select,
  clerkClientMock,
} = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));

  const inviteInsertSingle = vi.fn();
  const inviteInsertSelect = vi.fn(() => ({ single: inviteInsertSingle }));
  const inviteInsert = vi.fn(() => ({ select: inviteInsertSelect }));

  const inviteUpdateEq = vi.fn();
  const inviteUpdate = vi.fn(() => ({ eq: inviteUpdateEq }));

  const createInvitation = vi.fn();
  const clerkClientMock = vi.fn(async () => ({
    invitations: {
      createInvitation,
    },
  }));

  return {
    adminGuard: vi.fn(),
    createInvitation,
    inviteInsert,
    inviteInsertSingle,
    inviteUpdate,
    inviteUpdateEq,
    maybeSingle,
    select,
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
      if (table === "clients") return { select };
      if (table === "client_access_invites") {
        return {
          insert: inviteInsert,
          update: inviteUpdate,
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
    maybeSingle.mockResolvedValue({
      data: { id: "client_1", slug: "acme" },
      error: null,
    });
    inviteInsertSingle.mockResolvedValue({
      data: { id: "invite_1" },
      error: null,
    });
    inviteUpdateEq.mockResolvedValue({
      error: null,
    });
    createInvitation.mockResolvedValue({
      id: "clerk_invite_1",
    });
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
    expect(select).toHaveBeenCalledWith("id, slug");
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
});
