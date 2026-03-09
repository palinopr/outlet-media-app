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
  "/api/ticketmaster/tm1(.*)",
  "/api/whatsapp/evolution(.*)",
  "/api/whatsapp/send(.*)",
  "/api/whatsapp/twilio(.*)",
  "/api/whatsapp/webhook(.*)",
  "/api/contact(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  if (pathname === "/api/agents/email/watch" || pathname.startsWith("/api/agents/email/watch/")) {
    return;
  }
  if (pathname === "/api/whatsapp/webhook" || pathname.startsWith("/api/whatsapp/webhook/")) {
    return;
  }
  if (pathname === "/api/whatsapp/evolution" || pathname.startsWith("/api/whatsapp/evolution/")) {
    return;
  }
  if (pathname === "/api/whatsapp/send" || pathname.startsWith("/api/whatsapp/send/")) {
    return;
  }
  if (pathname === "/api/whatsapp/twilio" || pathname.startsWith("/api/whatsapp/twilio/")) {
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
