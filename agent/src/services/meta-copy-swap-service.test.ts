import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../state.js", () => ({
  withResourceLocks: vi.fn(async (_ownerId: string, _resources: string[], work: () => Promise<unknown>) => {
    return await work();
  }),
}));

import { executeScheduledCopySwap } from "./meta-copy-swap-service.js";

describe("meta-copy-swap-service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    process.env.META_ACCESS_TOKEN = "test-token";
  });

  afterEach(() => {
    delete process.env.META_ACCESS_TOKEN;
  });

  it("activates the new ad and pauses the old ad", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const result = await executeScheduledCopySwap("task-copy-swap", {
      activateAdId: "120243055587590525",
      activateLabel: "Hoy",
      campaignName: "Arjona Salt Lake City",
      city: "Salt Lake City",
      pauseAdId: "120242622824170525",
      pauseLabel: "Mañana",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.rollbackPerformed).toBe(false);
    expect(result.text).toContain("Executed scheduled copy swap for Arjona Salt Lake City / Salt Lake City.");
    expect(result.text).toContain("Activated Hoy (`120243055587590525`).");
    expect(result.text).toContain("Paused Mañana (`120242622824170525`).");
  });

  it("fails fast when the task is missing ad ids", async () => {
    await expect(
      executeScheduledCopySwap("task-copy-swap", {
        activateAdId: "120243055587590525",
      }),
    ).rejects.toThrow("missing ad IDs");
  });

  it("rolls the new ad back to PAUSED when the pause step fails", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ error: { message: "pause denied" } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      executeScheduledCopySwap("task-copy-swap", {
        activateAdId: "120243055587590525",
        pauseAdId: "120242622824170525",
      }),
    ).rejects.toThrow("reverted the new ad back to PAUSED");

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
