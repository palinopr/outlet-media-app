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
import {
  buildNotificationsCenterSummary,
  notificationMatchesFilter,
  type NotificationFilterKey,
} from "@/features/notifications/summary";
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
  const [filter, setFilter] = useState<NotificationFilterKey>("all");
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
  const summary = buildNotificationsCenterSummary(notifications);
  const filteredNotifications = notifications.filter((notification) =>
    notificationMatchesFilter(notification, filter),
  );
  const unreadNotifications = filteredNotifications.filter((notification) => !notification.read);
  const readNotifications = filteredNotifications.filter((notification) => notification.read);

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
        body: JSON.stringify({ clientSlug, id: notification.id }),
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

      <div className="grid gap-3 md:grid-cols-5">
        {summary.metrics.map((metric) => (
          <div
            className={
              viewer === "client"
                ? "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
                : "rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4"
            }
            key={metric.key}
          >
            <p className={cn("text-xs font-semibold uppercase tracking-wide", styles.meta)}>
              {metric.label}
            </p>
            <p className={cn("mt-2 text-2xl font-bold tracking-tight", styles.text)}>
              {metric.value}
            </p>
            <p className={cn("mt-1 text-xs", styles.meta)}>{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {summary.filters.map((option) => {
          const active = option.key === filter;
          return (
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                viewer === "client"
                  ? active
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                  : active
                    ? "border-[#0f7b6c]/20 bg-[#0f7b6c]/10 text-[#0f7b6c]"
                    : "border-[#ece8df] bg-[#fcfbf8] text-[#6f6a63] hover:bg-white",
              )}
              key={option.key}
              onClick={() => setFilter(option.key)}
              type="button"
            >
              <span>{option.label}</span>
              <span
                className={
                  viewer === "client"
                    ? "rounded-full bg-white/[0.08] px-1.5 py-0.5 text-[11px] text-white/70"
                    : "rounded-full bg-[#f1ece4] px-1.5 py-0.5 text-[11px] text-[#6f6a63]"
                }
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading && notifications.length === 0 ? (
        <div className={styles.empty}>Loading notifications…</div>
      ) : filteredNotifications.length === 0 ? (
        <div className={styles.empty}>
          {notifications.length === 0
            ? "No notifications yet. Shared updates and assigned work will appear here."
            : "No notifications match this filter yet."}
        </div>
      ) : (
        <div className="space-y-5">
          {unreadNotifications.length > 0 ? (
            <div className="space-y-3">
              <div>
                <p className={cn("text-sm font-medium", styles.muted)}>Unread</p>
                <p className={cn("mt-1 text-xs", styles.meta)}>
                  Start with the newest items that still need attention.
                </p>
              </div>
              {unreadNotifications.map((notification) => (
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
                        <span className={cn("h-2 w-2 rounded-full", styles.unread)} />
                      </div>

                      <p className={cn("mt-1 text-sm font-medium", styles.text)}>
                        {notification.title}
                      </p>

                      {notification.message ? (
                        <p className={cn("mt-1 text-sm", styles.muted)}>{notification.message}</p>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {readNotifications.length > 0 ? (
            <div className="space-y-3">
              <div>
                <p className={cn("text-sm font-medium", styles.muted)}>Recently read</p>
                <p className={cn("mt-1 text-xs", styles.meta)}>
                  Recent workflow updates you already opened.
                </p>
              </div>
              {readNotifications.map((notification) => (
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
                      </div>

                      <p className={cn("mt-1 text-sm font-medium", styles.text)}>
                        {notification.title}
                      </p>

                      {notification.message ? (
                        <p className={cn("mt-1 text-sm", styles.muted)}>{notification.message}</p>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
