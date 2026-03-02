import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-02T12:00:00.000Z"));
  });

  it("returns 200 status code", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });

  it("returns status field set to ok", async () => {
    const res = await GET();
    const body = await res.json();
    expect(body.status).toBe("ok");
  });

  it("returns an ISO timestamp", async () => {
    const res = await GET();
    const body = await res.json();
    expect(body.timestamp).toBe("2026-03-02T12:00:00.000Z");
  });

  it("returns a version string", async () => {
    const res = await GET();
    const body = await res.json();
    expect(body.version).toBe("0.1.0");
  });

});
