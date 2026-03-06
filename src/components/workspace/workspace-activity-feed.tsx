import Link from "next/link";
import {
  BadgeCheck,
  BarChart3,
  CalendarDays,
  CheckSquare,
  Cpu,
  FileText,
  FolderInput,
  MessageSquare,
  Upload,
  Users,
} from "lucide-react";
import { timeAgo } from "@/lib/formatters";
import type { SystemEvent } from "@/features/system-events/server";

interface WorkspaceActivityFeedProps {
  assetHrefPrefix?: string;
  events: SystemEvent[];
  basePath: string;
  description?: string;
  emptyState?: string;
  showClientSlug?: boolean;
  title?: string;
}

function getEventIcon(eventName: string) {
  if (eventName === "agent_action_requested") return Cpu;
  if (eventName.startsWith("approval_")) return BadgeCheck;
  if (eventName.startsWith("asset_comment_")) return MessageSquare;
  if (eventName.startsWith("asset_follow_up_item_")) return CheckSquare;
  if (eventName.startsWith("campaign_action_item_")) return CheckSquare;
  if (eventName.startsWith("campaign_comment_")) return MessageSquare;
  if (eventName.startsWith("crm_contact_")) return Users;
  if (eventName.startsWith("crm_comment_")) return MessageSquare;
  if (eventName.startsWith("crm_follow_up_item_")) return CheckSquare;
  if (eventName.startsWith("workspace_comment")) return MessageSquare;
  if (eventName.startsWith("workspace_task")) return CheckSquare;
  if (eventName === "campaign_updated") return BarChart3;
  if (eventName === "event_updated") return CalendarDays;
  if (eventName === "asset_folder_imported") return FolderInput;
  if (eventName.startsWith("asset_")) return Upload;
  return FileText;
}

function getEventHref(
  event: SystemEvent,
  basePath: string,
  assetHrefPrefix?: string,
) {
  const assetId =
    event.entityType === "asset" && event.entityId
      ? event.entityId
      : typeof event.metadata.assetId === "string"
        ? event.metadata.assetId
        : null;
  if (assetHrefPrefix && assetId) return `${assetHrefPrefix}/${assetId}`;
  if (event.pageId) return `${basePath}/${event.pageId}`;
  if (event.entityType === "event" && event.entityId) return `${basePath}/${event.entityId}`;
  if (event.entityType === "crm_contact" && event.entityId) return `${basePath}/${event.entityId}`;
  if (event.entityType === "crm_comment" && typeof event.metadata.crmContactId === "string") {
    return `${basePath}/${event.metadata.crmContactId}`;
  }
  if (
    event.entityType === "crm_follow_up_item" &&
    typeof event.metadata.crmContactId === "string"
  ) {
    return `${basePath}/${event.metadata.crmContactId}`;
  }
  if (event.taskId) return `${basePath}/tasks`;
  return null;
}

export function WorkspaceActivityFeed({
  assetHrefPrefix,
  events,
  basePath,
  description = "The latest changes across pages, tasks, comments, and assets.",
  emptyState = "Shared activity will appear here as work moves through the system.",
  showClientSlug = false,
  title = "Recent shared events",
}: WorkspaceActivityFeedProps) {
  return (
    <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#787774]">Activity</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#9b9a97]">{description}</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
          {emptyState}
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const Icon = getEventIcon(event.eventName);
            const href = getEventHref(event, basePath, assetHrefPrefix);

            return (
              <div
                key={event.id}
                className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4 transition-colors hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f6a63] shadow-[0_10px_30px_-24px_rgba(15,23,42,0.8)]">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#9b9a97]">
                      <span>{event.actorName ?? "Someone"}</span>
                      <span>&middot;</span>
                      <span>{timeAgo(event.createdAt)}</span>
                      {showClientSlug && event.clientSlug ? (
                        <>
                          <span>&middot;</span>
                          <span className="rounded-full bg-[#f1ece4] px-2 py-0.5 font-medium text-[#6f6a63]">
                            {event.clientSlug}
                          </span>
                        </>
                      ) : null}
                    </div>

                    <p className="mt-1 text-sm font-medium text-[#2f2f2f]">
                      {event.summary}
                    </p>

                    {event.detail ? (
                      <p className="mt-1 text-sm text-[#787774]">{event.detail}</p>
                    ) : null}

                    {href ? (
                      <div className="mt-3">
                        <Link
                          href={href}
                          className="text-sm font-medium text-[#0f7b6c] hover:text-[#0b5e52]"
                        >
                          Open
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
