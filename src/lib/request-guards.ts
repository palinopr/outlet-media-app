import { apiError } from "@/lib/api-helpers";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

function nowMs() {
  return Date.now();
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  return forwardedFor || realIp || cfIp || "unknown";
}

export function enforceContentLength(request: Request, maxBytes: number) {
  const rawLength = request.headers.get("content-length");
  if (!rawLength) return null;

  const parsed = Number(rawLength);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return apiError("Invalid content length", 400);
  }

  if (parsed > maxBytes) {
    return apiError("Payload too large", 413);
  }

  return null;
}

export function enforceRateLimit(
  request: Request,
  {
    limit,
    scope,
    windowMs,
  }: {
    limit: number;
    scope: string;
    windowMs: number;
  },
) {
  const now = nowMs();
  const key = `${scope}:${getClientIp(request)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  existing.count += 1;
  if (existing.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    const response = apiError("Too many requests", 429);
    response.headers.set("Retry-After", String(retryAfter));
    return response;
  }

  return null;
}

export function resetRateLimitsForTests() {
  buckets.clear();
}
