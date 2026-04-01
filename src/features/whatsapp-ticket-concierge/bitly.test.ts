import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { shortenBitlyUrl } from "./bitly";

describe("shortenBitlyUrl", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    delete process.env.BITLY_ACCESS_TOKEN;
    delete process.env.BITLY_GROUP_GUID;
    delete process.env.BITLY_DOMAIN;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns the original URL when Bitly is not configured", async () => {
    await expect(shortenBitlyUrl("https://example.com/long")).resolves.toBe(
      "https://example.com/long",
    );
  });

  it("uses Bitly shorten when configured", async () => {
    process.env.BITLY_ACCESS_TOKEN = "token";
    process.env.BITLY_GROUP_GUID = "group-1";
    process.env.BITLY_DOMAIN = "bit.ly";
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ link: "https://bit.ly/abc123" }), {
        headers: {
          "content-type": "application/json",
        },
        status: 200,
      }),
    ) as typeof global.fetch;

    await expect(shortenBitlyUrl("https://example.com/long")).resolves.toBe(
      "https://bit.ly/abc123",
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api-ssl.bitly.com/v4/shorten",
      expect.objectContaining({
        body: JSON.stringify({
          domain: "bit.ly",
          group_guid: "group-1",
          long_url: "https://example.com/long",
        }),
        headers: expect.objectContaining({
          Authorization: "Bearer token",
          "Content-Type": "application/json",
        }),
        method: "POST",
      }),
    );
  });

  it("falls back to the original URL when Bitly returns an error", async () => {
    process.env.BITLY_ACCESS_TOKEN = "token";
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ message: "bad request" }), {
        headers: {
          "content-type": "application/json",
        },
        status: 400,
      }),
    ) as typeof global.fetch;

    await expect(shortenBitlyUrl("https://example.com/long")).resolves.toBe(
      "https://example.com/long",
    );
  });
});
