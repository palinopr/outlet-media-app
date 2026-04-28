import { beforeEach, describe, expect, it } from "vitest";
import {
  enforceContentLength,
  enforceRateLimit,
  getClientIp,
  resetRateLimitsForTests,
} from "./request-guards";

describe("request guards", () => {
  beforeEach(() => {
    resetRateLimitsForTests();
  });

  it("extracts the first forwarded client IP", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });

    expect(getClientIp(request)).toBe("203.0.113.5");
  });

  it("rejects requests larger than the configured content-length", () => {
    const request = new Request("https://example.com", {
      headers: { "content-length": "1025" },
    });

    const response = enforceContentLength(request, 1024);

    expect(response?.status).toBe(413);
  });

  it("limits requests per client IP and scope", () => {
    const request = new Request("https://example.com", {
      headers: { "x-real-ip": "203.0.113.10" },
    });

    expect(enforceRateLimit(request, { limit: 2, scope: "test", windowMs: 60_000 })).toBeNull();
    expect(enforceRateLimit(request, { limit: 2, scope: "test", windowMs: 60_000 })).toBeNull();
    const blocked = enforceRateLimit(request, { limit: 2, scope: "test", windowMs: 60_000 });

    expect(blocked?.status).toBe(429);
    expect(blocked?.headers.get("Retry-After")).toBeTruthy();
  });
});
