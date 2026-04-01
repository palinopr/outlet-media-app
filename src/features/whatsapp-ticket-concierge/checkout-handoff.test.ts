import { afterEach, describe, expect, it } from "vitest";

import {
  buildCheckoutHandoffUrl,
  readCheckoutHandoffToken,
} from "./checkout-handoff";

const ORIGINAL_ENV = { ...process.env };

describe("checkout handoff helpers", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("builds a public handoff URL with a signed token", () => {
    process.env.INGEST_SECRET = "test-ingest-secret";

    const url = buildCheckoutHandoffUrl({
      baseUrl: "https://www.outletmedia.net",
      expiresAt: "2099-04-01T00:00:00.000Z",
      optionId: "opt_123",
    });

    expect(url).toMatch(/^https:\/\/www\.outletmedia\.net\/checkout\//);
    const token = url.split("/").pop();
    expect(token).toBeTruthy();
    expect(readCheckoutHandoffToken(token ?? "")).toMatchObject({
      optionId: "opt_123",
    });
  });

  it("rejects an invalid token", () => {
    process.env.INGEST_SECRET = "test-ingest-secret";
    expect(readCheckoutHandoffToken("not-a-real-token")).toBeNull();
  });
});
