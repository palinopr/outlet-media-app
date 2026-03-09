import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  auth,
  clerkClient,
  createClerkSupabaseClient,
  currentUser,
  listActionableInvitations,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
  usersById,
} = vi.hoisted(() => {
  type ClientRow = { id: string; name: string; slug: string };
  type MemberRow = {
    client_id: string;
    clerk_user_id: string;
    created_at: string;
    id: string;
    role: string;
  };
  type AccountRow = {
    ad_account_id: string;
    ad_account_name: string;
    client_slug: string;
    connected_at: string;
    id: string;
    last_used_at: string | null;
    status: string;
    token_expires_at: string | null;
  };
  type ClerkUser = {
    emailAddresses: Array<{ emailAddress: string }>;
    firstName: string | null;
    lastName: string | null;
  };
  type QueryState = {
    client_accounts: AccountRow[];
    client_members: MemberRow[];
    clients: ClientRow[];
  };

  const serviceState: QueryState = {
    client_accounts: [],
    client_members: [],
    clients: [],
  };

  const userScopedState: Omit<QueryState, "client_accounts"> = {
    client_members: [],
    clients: [],
  };

  const usersById = new Map<string, ClerkUser>();

  function applyFilters<T extends Record<string, unknown>>(
    rows: T[],
    filters: Array<{ field: string; value: unknown }>,
  ) {
    return rows.filter((row) => filters.every((filter) => row[filter.field] === filter.value));
  }

  function buildClient(state: QueryState | Omit<QueryState, "client_accounts">) {
    return {
      from(table: string) {
        const filters: Array<{ field: string; value: unknown }> = [];
        const query = {
          select() {
            return this;
          },
          eq(field: string, value: unknown) {
            filters.push({ field, value });
            return this;
          },
          order() {
            return this;
          },
          async single() {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            return { data: rows[0] ?? null, error: null };
          },
          then(
            resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown,
          ) {
            const rows = applyFilters(
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
              filters,
            );
            return Promise.resolve({ data: rows, error: null }).then(resolve);
          },
        };

        return query;
      },
    };
  }

  return {
    auth: vi.fn(),
    clerkClient: vi.fn(),
    createClerkSupabaseClient: vi.fn(),
    currentUser: vi.fn(),
    listActionableInvitations: vi.fn(),
    serviceState,
    supabaseAdmin: buildClient(serviceState),
    userScopedState,
    userScopedSupabase: buildClient(userScopedState),
    usersById,
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  auth,
  clerkClient,
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

vi.mock("@/features/invitations/server", () => ({
  listActionableInvitations,
}));

import { getSettingsData } from "./data";

describe("client settings data", () => {
  beforeEach(() => {
    auth.mockReset();
    clerkClient.mockReset();
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    listActionableInvitations.mockReset();
    serviceState.client_accounts = [];
    serviceState.client_members = [];
    serviceState.clients = [];
    userScopedState.client_members = [];
    userScopedState.clients = [];
    usersById.clear();

    auth.mockResolvedValue({ userId: "user_1" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    listActionableInvitations.mockResolvedValue([]);
    clerkClient.mockResolvedValue({
      users: {
        getUser: vi.fn(async (userId: string) => {
          const user = usersById.get(userId);
          if (!user) throw new Error("Unknown user");
          return user;
        }),
      },
    });
  });

  it("prefers the Clerk-scoped client for settings roster reads while keeping accounts server-only", async () => {
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.clients = [{ id: "service-client", name: "Service Co", slug: "zamora" }];
    serviceState.client_members = [
      {
        client_id: "service-client",
        clerk_user_id: "user_1",
        created_at: "2026-03-01T00:00:00.000Z",
        id: "member-service",
        role: "member",
      },
    ];
    serviceState.client_accounts = [
      {
        ad_account_id: "111",
        ad_account_name: "Service Account",
        client_slug: "zamora",
        connected_at: "2026-03-07T12:00:00.000Z",
        id: "acct_service",
        last_used_at: null,
        status: "active",
        token_expires_at: null,
      },
    ];
    userScopedState.clients = [{ id: "client-1", name: "Zamora", slug: "zamora" }];
    userScopedState.client_members = [
      {
        client_id: "client-1",
        clerk_user_id: "user_1",
        created_at: "2026-03-01T00:00:00.000Z",
        id: "member-owner",
        role: "owner",
      },
      {
        client_id: "client-1",
        clerk_user_id: "user_2",
        created_at: "2026-03-02T00:00:00.000Z",
        id: "member-two",
        role: "member",
      },
    ];
    usersById.set("user_1", {
      emailAddresses: [{ emailAddress: "owner@zamora.com" }],
      firstName: "Owner",
      lastName: "One",
    });
    usersById.set("user_2", {
      emailAddresses: [{ emailAddress: "member@zamora.com" }],
      firstName: "Member",
      lastName: "Two",
    });
    listActionableInvitations.mockResolvedValue([
      {
        createdAt: "2026-03-07T12:00:00.000Z",
        email: "pending@zamora.com",
        id: "invite_1",
        status: "pending",
      },
    ]);

    const data = await getSettingsData("zamora");

    expect(data).toMatchObject({
      clientId: "client-1",
      clientName: "Zamora",
      isOwner: true,
      pendingInvites: [
        expect.objectContaining({
          email: "pending@zamora.com",
          id: "invite_1",
          status: "pending",
        }),
      ],
      slug: "zamora",
    });
    expect(data?.members.map((member) => member.email)).toEqual([
      "owner@zamora.com",
      "member@zamora.com",
    ]);
    expect(data?.connectedAccounts.map((account) => account.id)).toEqual(["acct_service"]);
  });

  it("keeps admin settings readers on the service role", async () => {
    auth.mockResolvedValue({ userId: "admin_1" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.clients = [{ id: "service-client", name: "Service Co", slug: "zamora" }];
    serviceState.client_members = [
      {
        client_id: "service-client",
        clerk_user_id: "admin_1",
        created_at: "2026-03-01T00:00:00.000Z",
        id: "member-admin",
        role: "owner",
      },
      {
        client_id: "service-client",
        clerk_user_id: "user_2",
        created_at: "2026-03-02T00:00:00.000Z",
        id: "member-two",
        role: "member",
      },
    ];
    userScopedState.clients = [{ id: "rls-client", name: "RLS Co", slug: "zamora" }];
    userScopedState.client_members = [
      {
        client_id: "rls-client",
        clerk_user_id: "admin_1",
        created_at: "2026-03-01T00:00:00.000Z",
        id: "member-rls",
        role: "member",
      },
    ];
    usersById.set("admin_1", {
      emailAddresses: [{ emailAddress: "admin@outlet.com" }],
      firstName: "Admin",
      lastName: "User",
    });
    usersById.set("user_2", {
      emailAddresses: [{ emailAddress: "member@zamora.com" }],
      firstName: "Member",
      lastName: "Two",
    });

    const data = await getSettingsData("zamora");

    expect(data).toMatchObject({
      clientId: "service-client",
      clientName: "Service Co",
      isOwner: true,
      slug: "zamora",
    });
    expect(data?.members.map((member) => member.role)).toEqual(["owner", "member"]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
