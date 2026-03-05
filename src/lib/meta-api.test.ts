import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError } from "./meta-api";

describe("metaInsightsUrl", () => {
  it("builds URL with fields and token", () => {
    const url = metaInsightsUrl("123", "tok", "spend,impressions");
    expect(url.pathname).toBe("/v21.0/123/insights");
    expect(url.searchParams.get("access_token")).toBe("tok");
    expect(url.searchParams.get("fields")).toBe("spend,impressions");
  });

  it("includes optional params", () => {
    const url = metaInsightsUrl("123", "tok", "spend", {
      datePreset: "last_7d",
      breakdowns: "age,gender",
      limit: 50,
    });
    expect(url.searchParams.get("date_preset")).toBe("last_7d");
    expect(url.searchParams.get("breakdowns")).toBe("age,gender");
    expect(url.searchParams.get("limit")).toBe("50");
  });
});

describe("metaUrl", () => {
  it("builds a URL with path and token", () => {
    const url = metaUrl("act_123/campaigns", "tok", { status: "PAUSED" });
    expect(url).toContain("/v21.0/act_123/campaigns");
    expect(url).toContain("access_token=tok");
    expect(url).toContain("status=PAUSED");
  });
});

describe("fetchMetaApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "456" }),
    }));

    const result = await fetchMetaApi("https://graph.facebook.com/v21.0/test", "tok");
    expect(result).toEqual({ id: "456" });
  });

  it("throws MetaApiError on failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: { message: "Bad request" } }),
    }));

    await expect(
      fetchMetaApi("https://graph.facebook.com/v21.0/test", "tok"),
    ).rejects.toThrow(MetaApiError);
  });
});

describe("metaGet", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed data on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [{ id: "1" }] }),
    }));

    const url = new URL("https://graph.facebook.com/v21.0/test");
    const result = await metaGet<{ data: { id: string }[] }>(url, "test");
    expect(result).toEqual({ data: [{ id: "1" }] });
  });

  it("returns null on HTTP error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }));

    const url = new URL("https://graph.facebook.com/v21.0/test");
    const result = await metaGet(url, "test");
    expect(result).toBeNull();
  });

  it("returns null on API error in body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ error: { message: "Token expired" } }),
    }));

    const url = new URL("https://graph.facebook.com/v21.0/test");
    const result = await metaGet(url, "test");
    expect(result).toBeNull();
  });

  it("returns null on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    const url = new URL("https://graph.facebook.com/v21.0/test");
    const result = await metaGet(url, "test");
    expect(result).toBeNull();
  });
});
