import { beforeEach, describe, expect, it, vi } from "vitest";

const { adminGuard, state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    existingMembership: null as { id: string } | null,
    insertMembership: vi.fn(),
  };

  function clientsQuery() {
    return {
      select() {
        return this;
      },
      eq() {
        return this;
      },
      maybeSingle: vi.fn(async () => ({
        data: { id: "client_1", slug: "acme" },
        error: null,
      })),
    };
  }

  function clientMembersQuery() {
    return {
      delete() {
        return this;
      },
      eq() {
        return this;
      },
      insert: state.insertMembership.mockResolvedValue({ error: null }),
      select() {
        return this;
      },
      maybeSingle: vi.fn(async () => ({
        data: state.existingMembership,
        error: null,
      })),
      then(resolve: (value: { data: Array<{ clients: { slug: string } }>; error: null }) => unknown) {
        return Promise.resolve({
          data: [{ clients: { slug: "acme" } }],
          error: null,
        }).then(resolve);
      },
    };
  }

  const supabaseAdmin = {
    from(table: string) {
      if (table === "clients") return clientsQuery();
      if (table === "client_members") return clientMembersQuery();
      throw new Error(`Unexpected table ${table}`);
    },
  };

  return {
    adminGuard: vi.fn(),
    state,
    supabaseAdmin,
  };
});

vi.mock("@/lib/api-helpers", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-helpers")>("@/lib/api-helpers");
  return {
    ...actual,
    adminGuard,
  };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

describe("PATCH /api/admin/users/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminGuard.mockResolvedValue(null);
    state.existingMembership = null;
  });

  it("does not recreate an existing membership when adding client access", async () => {
    state.existingMembership = { id: "member_1" };

    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://example.com/api/admin/users/user_1", {
        body: JSON.stringify({ action: "add", clientId: "client_1" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      }),
      { params: Promise.resolve({ id: "user_1" }) },
    );

    expect(response.status).toBe(200);
    expect(state.insertMembership).not.toHaveBeenCalled();
  });

  it("inserts a membership when adding a new client assignment", async () => {
    const { PATCH } = await import("./route");
    const response = await PATCH(
      new Request("https://example.com/api/admin/users/user_1", {
        body: JSON.stringify({ action: "add", clientId: "client_1" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      }),
      { params: Promise.resolve({ id: "user_1" }) },
    );

    expect(response.status).toBe(200);
    expect(state.insertMembership).toHaveBeenCalledWith({
      client_id: "client_1",
      clerk_user_id: "user_1",
      role: "member",
    });
  });
});
