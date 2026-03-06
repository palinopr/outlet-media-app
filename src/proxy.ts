import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that do not require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/landing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/privacy",
  "/terms",
  "/deletion-status(.*)",
  "/api/ingest(.*)",
  "/api/alerts(.*)",
  "/api/agents/heartbeat(.*)",
  "/api/agents/email/watch",
  "/api/agents/email(.*)",
  "/api/agents/email/watch(.*)",
  "/api/health(.*)",
  "/api/meta/callback(.*)",
  "/api/meta/data-deletion(.*)",
  "/api/contact(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  if (pathname === "/api/agents/email/watch" || pathname.startsWith("/api/agents/email/watch/")) {
    return;
  }

  if (isPublicRoute(req)) return;
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
