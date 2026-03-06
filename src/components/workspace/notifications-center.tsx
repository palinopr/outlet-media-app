"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AtSign,
  BadgeCheck,
  BellRing,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Megaphone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { buildNotificationHref } from "@/features/notifications/routing";
import type { AppNotification } from "@/features/notifications/types";

interface NotificationsCenterProps {
  fallbackClientSlug?: string | null;
  initialNotifications: AppNotification[];
  viewer: "admin" | "client";
}

function tone(viewer: "admin" | "client") {
  if (viewer === "client") {
    return {
      body: "space-y-3",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-8 text-sm text-white/50",
      item: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]",
      meta: "text-white/45",
      muted: "text-white/55",
      text: "text-white",
      unread: "bg-cyan-400",
    };
  }

  return {
    body: "space-y-3",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-8 text-sm text-[#9b9a97]",
    item: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4 text-left transition-colors hover:border-[#e5ded2] hover:bg-white",
    meta: "text-[#9b9a97]",
    muted: "text-[#6f6a63]",
    text: "text-[#2f2f2f]",
    unread: "bg-[#0f7b6c]",
  };
}

function typeIcon(type: string) {
  switch (type) {
    case "approval":
      return <BadgeCheck className="h-4 w-4 text-emerald-400" />;
    case "asset":
      return <ImageIcon className="h-4 w-4 text-cyan-400" />;
    case "campaign":
      return <Megaphone className="h-4 w-4 text-violet-400" />;
    case "mention":
      return <AtSign className="h-4 w-4 text-blue-400" />;
    case "comment":
      return <MessageSquare className="h-4 w-4 text-green-400" />;
    case "event":
      return <CalendarDays className="h-4 w-4 text-amber-400" />;
    case "assignment":
      return <Users className="h-4 w-4 text-yellow-400" />;
    default:
      return <FileText className="h-4 w-4 text-current opacity-60" />;
  }
}

export function NotificationsCenter({
  fallbackClientSlug,
  initialNotifications,
  viewer,
}: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loading, setLoading] = useState(initialNotifications.length === 0);
  const router = useRouter();
  const styles = tone(viewer);
  const clientSlug = viewer === "client" ? fallbackClientSlug : undefined;
  const notificationsUrl = clientSlug
    ? `/api/workspace/notifications?clientSlug=${encodeURIComponent(clientSlug)}`
    : "/api/workspace/notifications";

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      try {
        setLoading(true);
        const response = await fetch(notificationsUrl);
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as { notifications?: AppNotification[] };
        if (!cancelled) {
          setNotifications(data.notifications ?? []);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadNotifications();
    return () => {
      cancelled = true;
    };
  }, [notificationsUrl]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  async function markAllRead() {
    await fetch("/api/workspace/notifications", {
      body: JSON.stringify({
        clientSlug,
        markAll: true,
      }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });

    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }

  async function openNotification(notification: AppNotification) {
    if (!notification.read) {
      await fetch("/api/workspace/notifications", {
        body: JSON.stringify({ id: notification.id }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      setNotifications((current) =>
        current.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
      );
    }

    const href = buildNotificationHref(notification, {
      fallbackClientSlug,
      viewer,
    });

    if (href) {
      router.push(href);
    }
  }

  return (
    <div className={styles.body}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={cn("inline-flex items-center gap-2 text-sm font-medium", styles.muted)}>
          <BellRing className="h-4 w-4" />
          <span>
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </span>
        </div>
        {unreadCount > 0 ? (
          <Button
            className={viewer === "client" ? "border-white/[0.12] bg-white/[0.04] text-white hover:bg-white/[0.08]" : undefined}
            onClick={() => void markAllRead()}
            size="sm"
            variant={viewer === "client" ? "outline" : "outline"}
          >
            Mark all read
          </Button>
        ) : null}
      </div>

      {loading && notifications.length === 0 ? (
        <div className={styles.empty}>Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className={styles.empty}>
          No notifications yet. Shared updates and assigned work will appear here.
        </div>
      ) : (
        notifications.map((notification) => (
          <button
            className={styles.item}
            key={notification.id}
            onClick={() => void openNotification(notification)}
            type="button"
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
                  viewer === "client"
                    ? "border-white/[0.08] bg-white/[0.04] text-white/70"
                    : "border-[#ece8df] bg-white text-[#6f6a63]",
                )}
              >
                {typeIcon(notification.type)}
              </div>

              <div className="min-w-0 flex-1">
                <div className={cn("flex flex-wrap items-center gap-2 text-xs", styles.meta)}>
                  <span>{notification.fromUserName ?? "Outlet"}</span>
                  <span>&middot;</span>
                  <span>{timeAgo(notification.createdAt)}</span>
                  {!notification.read ? (
                    <span className={cn("h-2 w-2 rounded-full", styles.unread)} />
                  ) : null}
                </div>

                <p className={cn("mt-1 text-sm font-medium", styles.text)}>{notification.title}</p>

                {notification.message ? (
                  <p className={cn("mt-1 text-sm", styles.muted)}>{notification.message}</p>
                ) : null}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
