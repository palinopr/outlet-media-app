import { describe, it, expect, vi } from "vitest";

// Mock env to provide TOKEN_ENCRYPTION_KEY
vi.stubEnv("TOKEN_ENCRYPTION_KEY", "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6");

describe("crypto", () => {
  it("encrypts and decrypts a token round-trip", async () => {
    const { encrypt, decrypt } = await import("./crypto");
    const token = "EAABsbCS1IXXBAO...fake-token";
    const encrypted = encrypt(token);
    expect(encrypted).not.toBe(token);
    expect(encrypted).toContain(":"); // iv:authTag:ciphertext format
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(token);
  });

  it("produces different ciphertext each time (random IV)", async () => {
    const { encrypt } = await import("./crypto");
    const token = "same-token";
    const a = encrypt(token);
    const b = encrypt(token);
    expect(a).not.toBe(b);
  });

  it("throws on tampered ciphertext", async () => {
    const { encrypt, decrypt } = await import("./crypto");
    const encrypted = encrypt("token");
    const parts = encrypted.split(":");
    parts[2] = "tampered" + parts[2];
    expect(() => decrypt(parts.join(":"))).toThrow();
  });
});
