import { createHmac } from "node:crypto";

import { afterEach, describe, expect, it } from "vitest";

import { verifyTwilioWebhookSignature } from "@/features/whatsapp/server";

function signTwilioRequest(input: {
  authToken: string;
  params: URLSearchParams;
  url: string;
}): string {
  const entries = [...input.params.entries()].sort(([leftKey], [rightKey]) =>
    leftKey.localeCompare(rightKey),
  );
  const payload = entries.reduce((result, [key, value]) => result + key + value, input.url);
  return createHmac("sha1", input.authToken).update(payload).digest("base64");
}

describe("verifyTwilioWebhookSignature", () => {
  const originalAuthToken = process.env.TWILIO_AUTH_TOKEN;

  afterEach(() => {
    if (originalAuthToken === undefined) {
      delete process.env.TWILIO_AUTH_TOKEN;
    } else {
      process.env.TWILIO_AUTH_TOKEN = originalAuthToken;
    }
  });

  it("validates against the forwarded public webhook URL when running behind a tunnel", () => {
    process.env.TWILIO_AUTH_TOKEN = "test-token";

    const requestUrl = "http://localhost:3000/api/whatsapp/twilio";
    const publicUrl =
      "https://06e2-2600-1702-4fb0-b050-5cb7-6d01-c0c9-ae22.ngrok-free.app/api/whatsapp/twilio";
    const params = new URLSearchParams({
      AccountSid: "AC123",
      Body: "Hola",
      From: "whatsapp:+13054870475",
      MessageSid: "SM18c22f04002c194ae0407e36031d31a2",
      To: "whatsapp:+13157435653",
    });
    const signature = signTwilioRequest({
      authToken: "test-token",
      params,
      url: publicUrl,
    });
    const headers = new Headers({
      host: "localhost:3000",
      "x-forwarded-host": "06e2-2600-1702-4fb0-b050-5cb7-6d01-c0c9-ae22.ngrok-free.app",
      "x-forwarded-proto": "https",
    });

    expect(verifyTwilioWebhookSignature(requestUrl, params, signature, headers)).toBe(true);
  });
});
