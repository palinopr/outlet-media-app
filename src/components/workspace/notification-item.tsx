"use client";

import type { Notification } from "@/lib/workspace-types";
import { timeAgo } from "@/lib/formatters";

function typeIcon(type: string) {
  switch (type) {
    case "mention":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
          <circle cx="12" cy="12" r="4" />
          <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" />
        </svg>
      );
    case "comment":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      );
    case "assignment":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
  }
}

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-accent/50 transition-colors"
      onClick={() => onClick(notification)}
    >
      <div className="mt-0.5 shrink-0">{typeIcon(notification.type)}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm truncate ${notification.read ? "text-muted-foreground" : "font-medium"}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        {notification.message && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{notification.message}</p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground/60">{timeAgo(notification.created_at)}</p>
      </div>
    </button>
  );
}
