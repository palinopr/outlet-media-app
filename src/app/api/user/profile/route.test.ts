import { beforeEach, describe, expect, it, vi } from "vitest";

const { authGuard, clerkClient, updateUser } = vi.hoisted(() => {
  const updateUser = vi.fn();
  return {
    authGuard: vi.fn(),
    clerkClient: vi.fn(async () => ({
      users: { updateUser },
    })),
    updateUser,
  };
});

vi.mock("@/lib/api-helpers", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-helpers")>("@/lib/api-helpers");
  return {
    ...actual,
    authGuard,
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient,
}));

function makeRequest(body: unknown) {
  return new Request("https://example.com/api/user/profile", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

describe("POST /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authGuard.mockResolvedValue({ userId: "user_1", error: null });
    updateUser.mockResolvedValue({ id: "user_1" });
  });

  it("requires authentication", async () => {
    authGuard.mockResolvedValue({
      userId: null,
      error: Response.json({ error: "Unauthenticated" }, { status: 401 }),
    });

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ firstName: "Jane", lastName: "Doe" }));

    expect(response.status).toBe(401);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("updates the signed-in user's profile", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ firstName: "Jane", lastName: "Doe" }));

    expect(response.status).toBe(200);
    expect(updateUser).toHaveBeenCalledWith("user_1", {
      firstName: "Jane",
      lastName: "Doe",
    });
  });

  it("rejects invalid profile payloads", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ firstName: "", lastName: "Doe" }));

    expect(response.status).toBe(400);
    expect(updateUser).not.toHaveBeenCalled();
  });
});
