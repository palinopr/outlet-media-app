import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// ─── Global mock: @clerk/nextjs/server ──────────────────────────────────────
// All API routes now import auth() from Clerk. Mock it globally so tests
// don't fail with "server-only" import errors. Default: authenticated user.
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "test-user-id" }),
  currentUser: vi.fn().mockResolvedValue({ publicMetadata: { role: "admin" } }),
  clerkClient: vi.fn().mockResolvedValue({
    invitations: { createInvitation: vi.fn().mockResolvedValue({}) },
  }),
  clerkMiddleware: vi.fn(),
  createRouteMatcher: vi.fn(),
}));
