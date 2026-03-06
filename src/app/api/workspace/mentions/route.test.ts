import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { authGuard, currentUser, clerkClient, state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    clerkUsers: [] as Array<{
      emailAddresses: Array<{ emailAddress: string }>;
      firstName: string | null;
      id: string;
      imageUrl: string;
      publicMetadata?: { role?: string };
      username: string | null;
    }>,
    clients: new Map<string, { id: string }>(),
    memberships: [] as Array<{ clerk_user_id: string; client_id: string }>,
  };

  function buildResult(table: string, filters: Array<{ field: string; value: unknown }>) {
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

  const supabaseAdmin = {
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
          const result = buildResult(table, filters);
          if (Array.isArray(result.data)) {
            return { data: result.data[0] ?? null, error: result.error };
          }
          return result;
        },
        async maybeSingle() {
          const result = buildResult(table, filters);
          if (Array.isArray(result.data)) {
            return { data: result.data[0] ?? null, error: result.error };
          }
          return result;
        },
        then(resolve: (value: unknown) => unknown) {
          return Promise.resolve(buildResult(table, filters)).then(resolve);
        },
      };

      return query;
    },
  };

  return {
    authGuard: vi.fn(),
    clerkClient: vi.fn(),
    currentUser: vi.fn(),
    state,
    supabaseAdmin,
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
  supabaseAdmin,
}));

function makeRequest(url: string) {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

describe("GET /api/workspace/mentions", () => {
  beforeEach(() => {
    state.clerkUsers = [];
    state.clients = new Map();
    state.memberships = [];
    authGuard.mockReset();
    currentUser.mockReset();
    clerkClient.mockReset();
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
    state.clerkUsers = [
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
        getUserList: vi.fn().mockResolvedValue({ data: state.clerkUsers }),
      },
    });

    const { GET } = await import("./route");
    const response = await GET(makeRequest("https://example.com/api/workspace/mentions?q=ja"));
    const payload = (await response.json()) as { users: Array<{ email: string }> };

    expect(response.status).toBe(200);
    expect(payload.users.map((user) => user.email)).toEqual(["jaime@example.com"]);
  });

  it("filters client mention results to client members and admins", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "client-member" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });
    state.clients.set("zamora", { id: "client-1" });
    state.memberships = [
      { clerk_user_id: "client-member", client_id: "client-1" },
      { clerk_user_id: "other-member", client_id: "client-1" },
    ];
    state.clerkUsers = [
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
        getUserList: vi.fn().mockResolvedValue({ data: state.clerkUsers }),
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
});
