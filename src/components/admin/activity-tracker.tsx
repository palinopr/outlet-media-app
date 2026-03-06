"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface Props {
  userId: string;
  userEmail: string;
}

const PAGE_LABELS: Record<string, string> = {
  "/admin/dashboard": "Viewed Dashboard",
  "/admin/campaigns": "Viewed Campaigns",
  "/admin/events": "Viewed Events",
  "/admin/assets": "Viewed Assets",
  "/admin/agents": "Viewed Agents",
  "/admin/clients": "Viewed Clients",
  "/admin/users": "Viewed Users",
  "/admin/settings": "Viewed Settings",
  "/admin/activity": "Viewed Activity",
};

function getPageLabel(pathname: string): string {
  return PAGE_LABELS[pathname] ?? `Viewed ${pathname}`;
}

async function postActivity(
  userId: string,
  userEmail: string,
  eventType: "page_view" | "error" | "session_start",
  detail: string,
  page?: string | null,
  metadata?: Record<string, unknown>,
) {
  try {
    await fetch("/api/admin/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        user_email: userEmail,
        event_type: eventType,
        page: page ?? null,
        detail,
        metadata: metadata ?? {},
      }),
    });
  } catch {
    // Silent fail -- activity tracking should never break the app
  }
}

export function ActivityTracker({ userId, userEmail }: Props) {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");
  const sessionLoggedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Log session start on first mount
  useEffect(() => {
    if (sessionLoggedRef.current) return;
    sessionLoggedRef.current = true;
    postActivity(userId, userEmail, "session_start", "Logged in", null, {
      user_agent: navigator.userAgent,
    });
  }, [userId, userEmail]);

  // Log page views on pathname change (debounced)
  useEffect(() => {
    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      postActivity(userId, userEmail, "page_view", getPageLabel(pathname), pathname);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pathname, userId, userEmail]);

  // Capture uncaught JS errors
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      postActivity(userId, userEmail, "error", event.message, pathname, {
        error_message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const msg = event.reason instanceof Error ? event.reason.message : String(event.reason);
      postActivity(userId, userEmail, "error", msg, pathname, {
        error_message: msg,
        stack: event.reason instanceof Error ? event.reason.stack : undefined,
      });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [userId, userEmail, pathname]);

  return null;
}
