"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./notification-item";
import { buildNotificationHref, buildNotificationsCenterHref } from "@/features/notifications/routing";
import type { AppNotification } from "@/features/notifications/types";

interface NotificationBellProps {
  fallbackClientSlug?: string;
  viewer: "admin" | "client";
}

export function NotificationBell({ fallbackClientSlug, viewer }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inboxHref = buildNotificationsCenterHref(viewer, fallbackClientSlug);
  const clientSlug = viewer === "client" ? fallbackClientSlug : undefined;
  const notificationsUrl = clientSlug
    ? `/api/workspace/notifications?clientSlug=${encodeURIComponent(clientSlug)}`
    : "/api/workspace/notifications";

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      try {
        const res = await fetch(notificationsUrl);
        if (!res.ok || cancelled) return;

        const data = await res.json();
        if (!cancelled) {
          setNotifications(data.notifications ?? []);
        }
      } catch {
        // ignore
      }
    }

    void loadNotifications();
    const interval = setInterval(() => {
      void loadNotifications();
    }, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [notificationsUrl]);

  async function handleMarkAllRead() {
    try {
      await fetch("/api/workspace/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSlug,
          markAll: true,
        }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  }

  async function handleNotificationClick(notification: AppNotification) {
    if (!notification.read) {
      try {
        await fetch("/api/workspace/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notification.id }),
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
        );
      } catch {
        // ignore
      }
    }

    setOpen(false);

    const href = buildNotificationHref(notification, {
      fallbackClientSlug,
      viewer,
    });
    if (href) {
      router.push(href);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="py-1">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} />
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t px-4 py-2">
          <Link
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            href={inboxHref}
            onClick={() => setOpen(false)}
          >
            Open inbox
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
