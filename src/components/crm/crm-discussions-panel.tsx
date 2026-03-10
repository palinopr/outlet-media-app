import Link from "next/link";
import { ArrowRight, MessageSquareMore } from "lucide-react";
import type { CrmDiscussionThread } from "@/features/crm-comments/server";
import { timeAgo } from "@/lib/formatters";
import { tone } from "@/lib/tone-styles";

interface CrmDiscussionsPanelProps {
  detailHrefPrefix: string;
  discussions: CrmDiscussionThread[];
  description?: string;
  emptyState?: string;
  showClientSlug?: boolean;
  title?: string;
  variant: "admin" | "client";
}

function truncate(value: string, max = 160) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function panelTone(variant: "admin" | "client") {
  return {
    ...tone(variant),
    item:
      variant === "client"
        ? "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
        : "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
  };
}

export function CrmDiscussionsPanel({
  detailHrefPrefix,
  discussions,
  description = "Recent unresolved CRM threads that still need a response or follow-up.",
  emptyState = "No unresolved CRM discussions right now.",
  showClientSlug = false,
  title = "Open relationship discussion",
  variant,
}: CrmDiscussionsPanelProps) {
  const styles = panelTone(variant);

  return (
    <section className={styles.body}>
      <div className="mb-4">
        <p className={`text-sm font-medium ${styles.muted}`}>Discussion</p>
        <h2 className={`mt-1 text-xl font-semibold tracking-tight ${styles.text}`}>{title}</h2>
        <p className={`mt-1 text-sm ${styles.muted}`}>{description}</p>
      </div>

      {discussions.length === 0 ? (
        <div className={styles.empty}>{emptyState}</div>
      ) : (
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <div key={discussion.id} className={styles.item}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6f6a63] shadow-[0_10px_30px_-24px_rgba(15,23,42,0.8)]">
                  <MessageSquareMore className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className={`flex flex-wrap items-center gap-2 text-xs ${styles.muted}`}>
                    <span>{discussion.authorName ?? "Team member"}</span>
                    <span>&middot;</span>
                    <span>{timeAgo(discussion.createdAt)}</span>
                    {showClientSlug ? (
                      <>
                        <span>&middot;</span>
                        <span>{discussion.clientSlug}</span>
                      </>
                    ) : null}
                  </div>
                  <p className={`mt-1 text-sm font-medium ${styles.text}`}>
                    {discussion.contactName ?? "CRM contact"}
                  </p>
                  <p className={`mt-1 text-sm ${styles.muted}`}>
                    {truncate(discussion.content)}
                  </p>
                  <div className="mt-3">
                    <Link
                      href={`${detailHrefPrefix}/${discussion.contactId}`}
                      className={`inline-flex items-center gap-1 text-sm font-medium ${styles.link}`}
                    >
                      Open contact <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
