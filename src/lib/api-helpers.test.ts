import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";

// Mock Clerk's auth before importing the module under test
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));

import { authGuard, apiError, secretGuard, adminGuard, parseJsonBody, validateRequest } from "./api-helpers";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

const mockedAuth = vi.mocked(auth);
const mockedCurrentUser = vi.mocked(currentUser);

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

describe("secretGuard", () => {
  const originalEnv = process.env.INGEST_SECRET;

  beforeEach(() => {
    process.env.INGEST_SECRET = "test-secret";
  });

  afterAll(() => {
    if (originalEnv !== undefined) {
      process.env.INGEST_SECRET = originalEnv;
    } else {
      delete process.env.INGEST_SECRET;
    }
  });

  it("returns null when secret matches", () => {
    const result = secretGuard("test-secret");
    expect(result).toBeNull();
  });

  it("returns 401 when secret does not match", async () => {
    const result = secretGuard("wrong-secret");
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns 401 when INGEST_SECRET is not set", async () => {
    delete process.env.INGEST_SECRET;
    const result = secretGuard("any-secret");
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns 401 when secret is undefined", async () => {
    const result = secretGuard(undefined);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });
});

describe("adminGuard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns null when user is admin", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockedCurrentUser.mockResolvedValue({ publicMetadata: { role: "admin" } } as unknown as Awaited<ReturnType<typeof currentUser>>);
    const result = await adminGuard();
    expect(result).toBeNull();
  });

  it("returns 401 when not authenticated", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const result = await adminGuard();
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns 403 when authenticated but not admin", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockedCurrentUser.mockResolvedValue({ publicMetadata: { role: "viewer" } } as unknown as Awaited<ReturnType<typeof currentUser>>);
    const result = await adminGuard();
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it("returns 403 when publicMetadata has no role", async () => {
    mockedAuth.mockResolvedValue({ userId: "user_123" } as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    mockedCurrentUser.mockResolvedValue({ publicMetadata: {} } as unknown as Awaited<ReturnType<typeof currentUser>>);
    const result = await adminGuard();
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });
});

describe("parseJsonBody", () => {
  it("returns parsed body on valid JSON", async () => {
    const body = { name: "test" };
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const result = await parseJsonBody(request);
    expect(result).toEqual(body);
  });

  it("returns 400 Response on malformed JSON", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const result = await parseJsonBody(request);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(400);
  });
});

describe("validateRequest", () => {
  const TestSchema = z.object({
    name: z.string().min(1),
    age: z.number().int(),
  });

  it("returns data on valid JSON matching schema", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ name: "Alice", age: 30 }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await validateRequest(request, TestSchema);
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ name: "Alice", age: 30 });
  });

  it("returns 400 error on schema mismatch", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ name: "", age: "not a number" }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await validateRequest(request, TestSchema);
    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.status).toBe(400);
    const body = await result.error!.json();
    expect(body.error).toBe("Invalid payload");
    expect(body.details).toBeDefined();
  });

  it("returns 400 error on malformed JSON", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const result = await validateRequest(request, TestSchema);
    expect(result.data).toBeNull();
    expect(result.error!.status).toBe(400);
  });
});
