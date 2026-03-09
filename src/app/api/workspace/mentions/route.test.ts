import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authGuard,
  clerkClient,
  createClerkSupabaseClient,
  currentUser,
  serviceState,
  supabaseAdmin,
  userScopedState,
  userScopedSupabase,
} = vi.hoisted(() => {
  type ClerkUser = {
    emailAddresses: Array<{ emailAddress: string }>;
    firstName: string | null;
    id: string;
    imageUrl: string;
    publicMetadata?: { role?: string };
    username: string | null;
  };

  type Membership = { clerk_user_id: string; client_id: string };

  type QueryState = {
    clerkUsers: ClerkUser[];
    clients: Map<string, { id: string }>;
    memberships: Membership[];
  };

  type RlsQueryState = Omit<QueryState, "clerkUsers">;

  const serviceState: QueryState = {
    clerkUsers: [],
    clients: new Map(),
    memberships: [],
  };

  const userScopedState: RlsQueryState = {
    clients: new Map<string, { id: string }>(),
    memberships: [],
  };

  function buildResult(
    state: QueryState | RlsQueryState,
    table: string,
    filters: Array<{ field: string; value: unknown }>,
  ) {
    if (table === "clients") {
      const slug = filters.find((filter) => filter.field === "slug")?.value as string | undefined;
      return { data: slug ? state.clients.get(slug) ?? null : null, error: null };
    }

    if (table === "client_members") {
      const rows = state.memberships.filter((row) =>
        filters.every((filter) => row[filter.field as keyof typeof row] === filter.value),
      );
      return { data: rows, error: null };
    }

    return { data: [], error: null };
  }

  function buildClient(state: QueryState | RlsQueryState) {
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
          async single() {
            const result = buildResult(state, table, filters);
            if (Array.isArray(result.data)) {
              return { data: result.data[0] ?? null, error: result.error };
            }
            return result;
          },
          async maybeSingle() {
            const result = buildResult(state, table, filters);
            if (Array.isArray(result.data)) {
              return { data: result.data[0] ?? null, error: result.error };
            }
            return result;
          },
          then(resolve: (value: unknown) => unknown) {
            return Promise.resolve(buildResult(state, table, filters)).then(resolve);
          },
        };

        return query;
      },
    };
  }

  const supabaseAdmin = buildClient(serviceState);

  return {
    authGuard: vi.fn(),
    clerkClient: vi.fn(),
    createClerkSupabaseClient: vi.fn(),
    currentUser: vi.fn(),
    serviceState,
    supabaseAdmin,
    userScopedState,
    userScopedSupabase: buildClient(userScopedState),
  };
});

vi.mock("@/lib/api-helpers", () => ({
  apiError: (message: string, status = 500) =>
    Response.json({ error: message }, { status }),
  authGuard,
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient,
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

function makeRequest(url: string) {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

describe("GET /api/workspace/mentions", () => {
  beforeEach(() => {
    serviceState.clerkUsers = [];
    serviceState.clients = new Map();
    serviceState.memberships = [];
    userScopedState.clients = new Map();
    userScopedState.memberships = [];
    authGuard.mockReset();
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    clerkClient.mockReset();
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("blocks non-admin mention lookups without a client scope", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user-client" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });
    const getUserList = vi.fn().mockResolvedValue({ data: [] });
    clerkClient.mockResolvedValue({
      users: {
        getUserList,
      },
    });

    const { GET } = await import("./route");
    const response = await GET(makeRequest("https://example.com/api/workspace/mentions?q=ja"));

    expect(response.status).toBe(403);
    expect(getUserList).not.toHaveBeenCalled();
  });

  it("returns global mention matches for admins", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user-admin" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    serviceState.clerkUsers = [
      {
        emailAddresses: [{ emailAddress: "jaime@example.com" }],
        firstName: "Jaime",
        id: "user-admin",
        imageUrl: "https://example.com/avatar.png",
        publicMetadata: { role: "admin" },
        username: null,
      },
    ];
    clerkClient.mockResolvedValue({
      users: {
        getUserList: vi.fn().mockResolvedValue({ data: serviceState.clerkUsers }),
      },
    });

    const { GET } = await import("./route");
    const response = await GET(makeRequest("https://example.com/api/workspace/mentions?q=ja"));
    const payload = (await response.json()) as { users: Array<{ email: string }> };

    expect(response.status).toBe(200);
    expect(payload.users.map((user) => user.email)).toEqual(["jaime@example.com"]);
  });

  it("filters client mention results using the Clerk-scoped client for member rosters", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "client-member" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.clients.set("zamora", { id: "service-client" });
    userScopedState.clients.set("zamora", { id: "client-1" });
    userScopedState.memberships = [
      { clerk_user_id: "client-member", client_id: "client-1" },
      { clerk_user_id: "other-member", client_id: "client-1" },
    ];
    serviceState.clerkUsers = [
      {
        emailAddresses: [{ emailAddress: "owner@zamora.com" }],
        firstName: "Owner",
        id: "client-member",
        imageUrl: "",
        publicMetadata: { role: "client" },
        username: null,
      },
      {
        emailAddresses: [{ emailAddress: "casey@zamora.com" }],
        firstName: "Casey",
        id: "other-member",
        imageUrl: "",
        publicMetadata: { role: "client" },
        username: null,
      },
      {
        emailAddresses: [{ emailAddress: "admin@outlet.com" }],
        firstName: "Admin",
        id: "admin-user",
        imageUrl: "",
        publicMetadata: { role: "admin" },
        username: null,
      },
      {
        emailAddresses: [{ emailAddress: "outsider@example.com" }],
        firstName: "Outsider",
        id: "outsider",
        imageUrl: "",
        publicMetadata: { role: "client" },
        username: null,
      },
    ];
    clerkClient.mockResolvedValue({
      users: {
        getUserList: vi.fn().mockResolvedValue({ data: serviceState.clerkUsers }),
      },
    });

    const { GET } = await import("./route");
    const response = await GET(
      makeRequest("https://example.com/api/workspace/mentions?q=a&client_slug=zamora"),
    );
    const payload = (await response.json()) as { users: Array<{ email: string }> };

    expect(response.status).toBe(200);
    expect(payload.users.map((user) => user.email)).toEqual([
      "owner@zamora.com",
      "casey@zamora.com",
      "admin@outlet.com",
    ]);
  });

  it("keeps client-scoped admin mention lookups on the service role", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user-admin" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    createClerkSupabaseClient.mockResolvedValue(userScopedSupabase);
    serviceState.clients.set("zamora", { id: "client-1" });
    serviceState.memberships = [{ clerk_user_id: "service-member", client_id: "client-1" }];
    userScopedState.clients.set("zamora", { id: "client-1" });
    userScopedState.memberships = [{ clerk_user_id: "rls-member", client_id: "client-1" }];
    serviceState.clerkUsers = [
      {
        emailAddresses: [{ emailAddress: "service@zamora.com" }],
        firstName: "Service",
        id: "service-member",
        imageUrl: "",
        publicMetadata: { role: "client" },
        username: null,
      },
      {
        emailAddresses: [{ emailAddress: "rls@zamora.com" }],
        firstName: "RLS",
        id: "rls-member",
        imageUrl: "",
        publicMetadata: { role: "client" },
        username: null,
      },
      {
        emailAddresses: [{ emailAddress: "admin@outlet.com" }],
        firstName: "Admin",
        id: "user-admin",
        imageUrl: "",
        publicMetadata: { role: "admin" },
        username: null,
      },
    ];
    clerkClient.mockResolvedValue({
      users: {
        getUserList: vi.fn().mockResolvedValue({ data: serviceState.clerkUsers }),
      },
    });

    const { GET } = await import("./route");
    const response = await GET(
      makeRequest("https://example.com/api/workspace/mentions?q=a&client_slug=zamora"),
    );
    const payload = (await response.json()) as { users: Array<{ email: string }> };

    expect(response.status).toBe(200);
    expect(payload.users.map((user) => user.email)).toEqual([
      "service@zamora.com",
      "admin@outlet.com",
    ]);
    expect(createClerkSupabaseClient).not.toHaveBeenCalled();
  });
});
