import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_HANDOFF_BASE_URL = "https://www.outletmedia.net";
const CHECKOUT_HANDOFF_PATH = "/checkout";

interface CheckoutHandoffPayload {
  exp: number;
  optionId: string;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function getCheckoutHandoffSecret(): string {
  const secret =
    process.env.WHATSAPP_TICKET_CONCIERGE_CHECKOUT_SECRET?.trim() ??
    process.env.INGEST_SECRET?.trim() ??
    "";

  if (!secret) {
    throw new Error("Checkout handoff secret is not configured.");
  }

  return secret;
}

function signCheckoutHandoffPayload(payload: string): string {
  return createHmac("sha256", getCheckoutHandoffSecret()).update(payload).digest("base64url");
}

function normalizeBaseUrl(baseUrl: string | null | undefined): string {
  const resolved = baseUrl?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_HANDOFF_BASE_URL;
  return resolved.endsWith("/") ? resolved.slice(0, -1) : resolved;
}

export function createCheckoutHandoffToken(input: {
  expiresAt: Date | string;
  optionId: string;
}): string {
  const exp =
    input.expiresAt instanceof Date
      ? input.expiresAt.getTime()
      : new Date(input.expiresAt).getTime();

  if (!Number.isFinite(exp)) {
    throw new Error("Invalid checkout handoff expiration.");
  }

  const encodedPayload = encodeBase64Url(
    JSON.stringify({
      exp,
      optionId: input.optionId,
    } satisfies CheckoutHandoffPayload),
  );
  const signature = signCheckoutHandoffPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function readCheckoutHandoffToken(token: string): CheckoutHandoffPayload | null {
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = signCheckoutHandoffPayload(encodedPayload);
  const left = Buffer.from(providedSignature);
  const right = Buffer.from(expectedSignature);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  const decoded = decodeBase64Url(encodedPayload);
  if (!decoded) {
    return null;
  }

  try {
    const payload = JSON.parse(decoded) as Partial<CheckoutHandoffPayload>;
    if (
      typeof payload.optionId !== "string" ||
      payload.optionId.length === 0 ||
      typeof payload.exp !== "number" ||
      !Number.isFinite(payload.exp)
    ) {
      return null;
    }

    return {
      exp: payload.exp,
      optionId: payload.optionId,
    };
  } catch {
    return null;
  }
}

export function buildCheckoutHandoffUrl(input: {
  baseUrl?: string | null;
  expiresAt: Date | string;
  optionId: string;
}): string {
  const token = createCheckoutHandoffToken({
    expiresAt: input.expiresAt,
    optionId: input.optionId,
  });

  return `${normalizeBaseUrl(input.baseUrl)}${CHECKOUT_HANDOFF_PATH}/${token}`;
}
