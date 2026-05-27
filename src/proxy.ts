import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that do not require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/landing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/connect-error(.*)",
  "/privacy",
  "/terms",
  "/9am(.*)",
  "/ataca-sergio(.*)",
  "/out/ticketmaster(.*)",
  "/deletion-status(.*)",
  "/api/ingest(.*)",
  "/api/health(.*)",
  "/api/meta/callback(.*)",
  "/api/tiktok/oauth/callback(.*)",
  "/api/meta/data-deletion(.*)",
  "/api/meta/ticketmaster-capi(.*)",
  "/api/attribution/funnel(.*)",
  "/api/contact(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
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
