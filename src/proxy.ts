import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that do not require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/privacy",
  "/terms",
  "/deletion-status(.*)",
  "/api/ingest(.*)",
  "/api/alerts(.*)",
  "/api/agents/heartbeat(.*)",
  "/api/health(.*)",
  "/api/meta/callback(.*)",
  "/api/meta/data-deletion(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
