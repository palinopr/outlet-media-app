"use client";

import { AtSign, MessageSquare, Users, FileText } from "lucide-react";
import type { Notification } from "@/lib/workspace-types";
import { timeAgo } from "@/lib/formatters";

function typeIcon(type: string) {
  switch (type) {
    case "mention":
      return <AtSign className="h-3.5 w-3.5 text-blue-400" />;
    case "comment":
      return <MessageSquare className="h-3.5 w-3.5 text-green-400" />;
    case "assignment":
      return <Users className="h-3.5 w-3.5 text-yellow-400" />;
    default:
      return <FileText className="h-3.5 w-3.5 text-white/40" />;
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
      className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-white/[0.04] transition-colors"
      onClick={() => onClick(notification)}
    >
      <div className="mt-0.5 shrink-0">{typeIcon(notification.type)}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm truncate ${notification.read ? "text-white/40" : "font-medium"}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        {notification.message && (
          <p className="mt-0.5 text-xs text-white/40 truncate">{notification.message}</p>
        )}
        <p className="mt-0.5 text-xs text-white/25">{timeAgo(notification.created_at)}</p>
      </div>
    </button>
  );
}
