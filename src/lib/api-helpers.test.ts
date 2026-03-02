import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Clerk's auth before importing the module under test
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

import { authGuard, apiError, apiSuccess } from "./api-helpers";
import { auth } from "@clerk/nextjs/server";

const mockedAuth = vi.mocked(auth);

describe("apiError", () => {
  it("returns JSON response with error message and status", async () => {
    const res = apiError("Something went wrong", 400);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: "Something went wrong" });
  });

  it("defaults to status 500", async () => {
    const res = apiError("Server error");
    expect(res.status).toBe(500);
  });
});

describe("apiSuccess", () => {
  it("returns JSON response with data and 200 status", async () => {
    const res = apiSuccess({ items: [1, 2, 3] });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ items: [1, 2, 3] });
  });
});

describe("authGuard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns userId when authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const result = await authGuard();
    expect(result).toEqual({ userId: "user_123", error: null });
  });

  it("returns error response when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const result = await authGuard();
    expect(result.userId).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.status).toBe(401);
  });
});
