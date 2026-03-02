import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns 200 with status, timestamp, and version", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.version).toBe("0.1.0");
    expect(typeof body.timestamp).toBe("string");

    // Timestamp should be a valid ISO 8601 string
    const parsed = new Date(body.timestamp);
    expect(parsed.toISOString()).toBe(body.timestamp);
  });

  it("returns a recent timestamp", async () => {
    const before = new Date();
    const response = await GET();
    const after = new Date();
    const body = await response.json();
    const ts = new Date(body.timestamp);

    expect(ts.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(ts.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("returns Content-Type application/json", async () => {
    const response = await GET();
    expect(response.headers.get("content-type")).toContain("application/json");
  });
});
