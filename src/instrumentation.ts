// Next.js instrumentation hook -- runs once when the server starts.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
export async function register() {
  // Validate environment variables on startup
  await import("@/lib/env");
}
