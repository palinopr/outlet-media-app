/**
 * Shared text truncation utilities used across comment and follow-up API routes.
 */

/** Truncate text to `limit` characters (default 140), normalizing whitespace. */
export function excerpt(text: string, limit = 140): string {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1)}\u2026`;
}
