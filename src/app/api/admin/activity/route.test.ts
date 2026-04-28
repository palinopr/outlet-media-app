import { beforeEach, describe, expect, it, vi } from "vitest";

const { adminGuard, currentUser, insert, from } = vi.hoisted(() => {
  const insert = vi.fn();
  const from = vi.fn((table: string) => {
    if (table !== "admin_activity") throw new Error(`Unexpected table ${table}`);
    return { insert };
  });

  return {
    adminGuard: vi.fn(),
    currentUser: vi.fn(),
    insert,
    from,
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
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from },
}));

function makeRequest(body: unknown) {
  return new Request("https://example.com/api/admin/activity", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

describe("POST /api/admin/activity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminGuard.mockResolvedValue(null);
    currentUser.mockResolvedValue({
      id: "user_1",
      emailAddresses: [{ emailAddress: "admin@example.com" }],
    });
    insert.mockResolvedValue({ error: null });
  });

  it("requires admin access", async () => {
    adminGuard.mockResolvedValue(Response.json({ error: "Forbidden" }, { status: 403 }));

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ event_type: "page_view", detail: "Viewed", page: "/admin" }));

    expect(response.status).toBe(403);
    expect(insert).not.toHaveBeenCalled();
  });

  it("validates and records admin activity", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({
      detail: "Opened clients",
      event_type: "page_view",
      metadata: { area: "clients" },
      page: "/admin/clients",
    }));

    expect(response.status).toBe(200);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      detail: "Opened clients",
      event_type: "page_view",
      page: "/admin/clients",
      user_email: "admin@example.com",
      user_id: "user_1",
    }));
  });

  it("rejects malformed activity payloads", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ event_type: "unknown", detail: "Bad" }));

    expect(response.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });
});
