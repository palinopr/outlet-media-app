/**
 * Retry with exponential backoff.
 * Use for Meta API calls, Supabase writes, and ingest POSTs.
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** Called before each retry with attempt number and error */
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry an async function with exponential backoff.
 * Doubles the delay each attempt, capped at maxDelayMs.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 30_000,
    onRetry,
  } = opts;

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt === maxAttempts) break;

      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);

      console.warn(
        `[retry] attempt ${attempt}/${maxAttempts} failed: ${lastError.message}. Retrying in ${delay}ms...`
      );

      onRetry?.(attempt, lastError);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Classify an error to decide how to retry.
 * Returns a hint the agent can use to revise its approach.
 */
export function classifyError(err: Error): { category: string; hint: string } {
  const msg = err.message.toLowerCase();

  if (/oauth|access.?token|token.*expired|190/.test(msg)) {
    return {
      category: "auth",
      hint: "Access token may be expired. Re-read credentials from .env.local before calling the API.",
    };
  }
  if (/rate.?limit|too many requests|429/.test(msg)) {
    return {
      category: "rate_limit",
      hint: "Rate limit hit. Wait 60 seconds before retrying.",
    };
  }
  if (/timeout|etimedout|econnreset/.test(msg)) {
    return {
      category: "timeout",
      hint: "Request timed out. Break the task into smaller steps and retry one at a time.",
    };
  }
  if (/not found|404|does not exist/.test(msg)) {
    return {
      category: "not_found",
      hint: "Resource not found. Verify the campaign or event ID by listing active items first.",
    };
  }
  if (/permission|forbidden|403|unauthorized/.test(msg)) {
    return {
      category: "permission",
      hint: "Permission denied. Check that the token has ads_management and ads_read scopes.",
    };
  }

  return {
    category: "unknown",
    hint: "Unexpected error. Check the raw API response for details.",
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
