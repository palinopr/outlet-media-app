import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
const authGuard = vi.fn();
const currentUser = vi.fn();

vi.mock("@/lib/api-helpers", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-helpers")>("@/lib/api-helpers");
  return {
    ...actual,
    authGuard,
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from(table: string) {
      if (table !== "application_errors") throw new Error(`Unexpected table ${table}`);
      return { insert };
    },
  },
}));

function makeRequest(body: unknown) {
  return new Request("https://example.com/api/observability/client-error", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

describe("POST /api/observability/client-error", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authGuard.mockResolvedValue({ userId: "user_1", error: null });
    currentUser.mockResolvedValue({
      emailAddresses: [{ emailAddress: "admin@example.com" }],
    });
    insert.mockResolvedValue({ error: null });
  });

  it("records a sanitized authenticated client error", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({
      digest: "digest_1",
      message: "Failed with token=secret123",
      route: "/admin/settings",
      stack: "Error: Bearer abc.def.ghi",
    }));
    const body = await response.json();

    expect(body).toEqual({ ok: true, logged: true });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      digest: "digest_1",
      message: "Failed with token=[redacted]",
      route: "/admin/settings",
      stack: "Error: [redacted]",
      user_email: "admin@example.com",
      user_id: "user_1",
    }));
  });

  it("requires authentication", async () => {
    authGuard.mockResolvedValue({
      userId: null,
      error: Response.json({ error: "Unauthenticated" }, { status: 401 }),
    });

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ message: "Boom" }));

    expect(response.status).toBe(401);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects malformed payloads", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ message: "" }));

    expect(response.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });
});
