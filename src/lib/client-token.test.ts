import { describe, it, expect, vi } from "vitest";

vi.stubEnv("TOKEN_ENCRYPTION_KEY", "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6");

const mockSelect = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({ select: mockSelect }),
  },
}));

describe("getClientToken", () => {
  it("returns decrypted token for active account", async () => {
    const { encrypt } = await import("./crypto");
    const encrypted = encrypt("test-token-123");

    mockSelect.mockReturnValue({
      eq: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: { access_token_encrypted: encrypted },
                error: null,
              }),
          }),
        }),
      }),
    });

    const { getClientToken } = await import("./client-token");
    const result = await getClientToken("zamora", "act_123");
    expect(result).toBe("test-token-123");
  });

  it("returns null when no account found", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({ data: null, error: { message: "not found" } }),
          }),
        }),
      }),
    });

    const { getClientToken } = await import("./client-token");
    const result = await getClientToken("zamora", "act_999");
    expect(result).toBeNull();
  });
});
