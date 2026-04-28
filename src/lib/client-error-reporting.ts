"use client";

export function reportClientError(error: Error & { digest?: string }, context?: Record<string, unknown>) {
  const payload = {
    digest: error.digest,
    message: error.message || "Client render error",
    metadata: context,
    route: typeof window !== "undefined" ? window.location.pathname : undefined,
    stack: error.stack,
  };

  void fetch("/api/observability/client-error", {
    body: JSON.stringify(payload),
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    method: "POST",
  }).catch(() => {
    // Never let monitoring failures affect the user recovery path.
  });
}
