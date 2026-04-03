import { createHmac, timingSafeEqual } from "node:crypto";

function getAppSecret(): string {
  const secret = process.env.META_APP_SECRET;
  if (!secret) throw new Error("META_APP_SECRET not configured");
  return secret;
}

export function verifySignedRequest(signedRequest: string): {
  user_id: string;
  algorithm: string;
  issued_at: number;
} {
  const [encodedSig, encodedPayload] = signedRequest.split(".");
  if (!encodedSig || !encodedPayload) {
    throw new Error("Invalid signed_request format");
  }
  const expectedSig = createHmac("sha256", getAppSecret())
    .update(encodedPayload)
    .digest();
  const actualSig = Buffer.from(encodedSig, "base64url");
  if (
    actualSig.length !== expectedSig.length ||
    !timingSafeEqual(actualSig, expectedSig)
  ) {
    throw new Error("Invalid signed_request signature");
  }
  return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
}
