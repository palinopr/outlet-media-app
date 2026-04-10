import {
  Activity,
  Bot,
  ListTodo,
  MessageSquareMore,
  ShieldCheck,
} from "lucide-react";
import { fmtDate } from "@/lib/formatters";
import { taskStatusLabel } from "@/lib/action-item-labels";
import { TASK_PRIORITY_LABELS } from "@/lib/workspace-types";
import type { ClientEventOperatingView } from "@/features/events/client-operating";
import type { EventComment } from "@/features/event-comments/server";
import { EventDiscussionForm } from "./event-discussion-form";

interface EventOperatingPanelProps {
  data: ClientEventOperatingView;
  eventId: string;
  slug: string;
}

function toneBadge(kind: "neutral" | "success" | "warning") {
  switch (kind) {
    case "success":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "warning":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";
    default:
      return "border-white/[0.08] bg-white/[0.04] text-white/55";
  }
}

function followUpPriorityTone(priority: keyof typeof TASK_PRIORITY_LABELS) {
  if (priority === "urgent") return "border-rose-400/20 bg-rose-400/10 text-rose-200";
  if (priority === "high") return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  return "border-white/[0.08] bg-white/[0.04] text-white/55";
}

function outcomeTone(status: "done" | "error" | "pending" | "running") {
  if (status === "error") return "warning" as const;
  if (status === "done") return "success" as const;
  return "neutral" as const;
}

function outcomeLabel(status: "done" | "error" | "pending" | "running") {
  if (status === "done") return "Completed";
  if (status === "error") return "Needs attention";
  if (status === "running") return "Running";
  return "Queued";
}

function compactText(value: string | null, max = 220) {
  if (!value) return null;
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function groupDiscussionThreads(comments: EventComment[]) {
  const repliesByParent = new Map<string, EventComment[]>();

  for (const comment of comments) {
    if (!comment.parentCommentId) continue;
    const current = repliesByParent.get(comment.parentCommentId) ?? [];
    current.push(comment);
    repliesByParent.set(comment.parentCommentId, current);
  }

  return comments
    .filter((comment) => !comment.parentCommentId)
    .map((thread) => ({
      ...thread,
      replies: repliesByParent.get(thread.id) ?? [],
    }));
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-white/45">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ThreadList({ comments }: { comments: ReturnType<typeof groupDiscussionThreads> }) {
  return (
    <div className="space-y-3">
      {comments.map((thread) => (
        <article key={thread.id} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-white">{thread.authorName ?? "Unknown author"}</p>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] ${toneBadge(
                thread.resolved ? "success" : "neutral",
              )}`}
            >
              {thread.resolved ? "Resolved" : "Open"}
            </span>
            <span className="text-xs text-white/35">{fmtDate(thread.createdAt)}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/60">{thread.content}</p>

          {thread.replies.length > 0 ? (
            <div className="mt-4 space-y-2 border-l border-white/[0.08] pl-4">
              {thread.replies.map((reply) => (
                <div key={reply.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium text-white/80">
                      {reply.authorName ?? "Unknown author"}
                    </p>
                    <span className="text-[11px] text-white/35">{fmtDate(reply.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/50">{reply.content}</p>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function EventOperatingPanel({ data, eventId, slug }: EventOperatingPanelProps) {
  const discussionThreads = groupDiscussionThreads(data.comments);
  const openThreads = discussionThreads.filter((comment) => !comment.resolved);
  const hasSupportColumn =
    data.approvals.length > 0 ||
    data.followUpItems.length > 0 ||
    data.agentOutcomes.length > 0 ||
    data.systemEvents.length > 0;

  return (
    <section className="space-y-4">
      <div className={hasSupportColumn ? "grid gap-4 xl:grid-cols-[1.05fr_0.95fr]" : undefined}>
        <SectionCard
          title="Event requests"
          subtitle="Ask for a change, flag a blocker, or leave context for this show in one place."
        >
          <div className="mb-4 flex flex-wrap items-center gap-2 text-cyan-300/80">
            <MessageSquareMore className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Client conversation</span>
            {openThreads.length > 0 ? (
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[11px] text-cyan-200">
                {openThreads.length} open
              </span>
            ) : null}
          </div>

          <EventDiscussionForm eventId={eventId} slug={slug} />

          <div className="mt-4">
            {discussionThreads.length === 0 ? (
              <p className="text-sm text-white/45">No requests yet.</p>
            ) : (
              <ThreadList comments={discussionThreads} />
            )}
          </div>
        </SectionCard>

        {hasSupportColumn ? (
          <div className="space-y-4">
            {(data.approvals.length > 0 ||
              data.followUpItems.length > 0 ||
              data.agentOutcomes.length > 0) ? (
              <SectionCard
                title="Already in motion"
                subtitle="Only the event work that already exists is shown here."
              >
                <div className="space-y-4">
                  {data.approvals.length > 0 ? (
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Waiting for approval
                      </div>
                      <div className="space-y-3">
                        {data.approvals.map((approval) => (
                          <article
                            key={approval.id}
                            className="rounded-2xl border border-white/[0.08] bg-black/15 p-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-medium text-white">{approval.title}</h3>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[11px] ${toneBadge("warning")}`}
                              >
                                {approval.requestType}
                              </span>
                            </div>
                            {approval.summary ? (
                              <p className="mt-2 text-sm leading-6 text-white/50">{approval.summary}</p>
                            ) : null}
                            <p className="mt-3 text-xs text-white/35">
                              Requested {fmtDate(approval.createdAt)}
                              {approval.requestedByName ? ` by ${approval.requestedByName}` : ""}
                            </p>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {data.followUpItems.length > 0 ? (
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                        <ListTodo className="h-3.5 w-3.5" />
                        Open next steps
                      </div>
                      <div className="space-y-3">
                        {data.followUpItems.map((item) => (
                          <article
                            key={item.id}
                            className="rounded-2xl border border-white/[0.08] bg-black/15 p-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-medium text-white">{item.title}</h3>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[11px] ${toneBadge("neutral")}`}
                              >
                                {taskStatusLabel(item.status)}
                              </span>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[11px] ${followUpPriorityTone(
                                  item.priority,
                                )}`}
                              >
                                {TASK_PRIORITY_LABELS[item.priority]}
                              </span>
                            </div>
                            {item.description ? (
                              <p className="mt-2 text-sm leading-6 text-white/50">{item.description}</p>
                            ) : null}
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/35">
                              <span>Assignee: {item.assigneeName ?? "Unassigned"}</span>
                              {item.dueDate ? <span>Due: {fmtDate(item.dueDate)}</span> : null}
                              <span>Updated: {fmtDate(item.updatedAt)}</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {data.agentOutcomes.length > 0 ? (
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                        <Bot className="h-3.5 w-3.5" />
                        Agent follow-through
                      </div>
                      <div className="space-y-3">
                        {data.agentOutcomes.map((outcome) => (
                          <article
                            key={outcome.taskId}
                            className="rounded-2xl border border-white/[0.08] bg-black/15 p-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-medium text-white">{outcome.requestSummary}</h3>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[11px] ${toneBadge(
                                  outcomeTone(outcome.status),
                                )}`}
                              >
                                {outcomeLabel(outcome.status)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-white/50">
                              {compactText(outcome.resultText, 200) ??
                                compactText(outcome.requestDetail, 200) ??
                                "Waiting for a result or linked next step."}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/35">
                              <span>{outcome.eventName ?? outcome.campaignName ?? outcome.agentId}</span>
                              <span>{fmtDate(outcome.createdAt)}</span>
                              {outcome.linkedEventFollowUpItemId ? (
                                <span>Linked to an event next step</span>
                              ) : null}
                              {!outcome.linkedEventFollowUpItemId && outcome.linkedActionItemId ? (
                                <span>Linked to a campaign next step</span>
                              ) : null}
                              {!outcome.linkedEventFollowUpItemId &&
                              !outcome.linkedActionItemId &&
                              outcome.linkedAssetFollowUpItemId ? (
                                <span>Linked to creative follow-up</span>
                              ) : null}
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </SectionCard>
            ) : null}

            {data.systemEvents.length > 0 ? (
              <SectionCard title="Recent changes" subtitle="Shared updates already attached to this event.">
                <div className="space-y-3">
                  {data.systemEvents.map((event) => (
                    <article
                      key={event.id}
                      className="rounded-2xl border border-white/[0.08] bg-black/15 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] p-2 text-white/55">
                          <Activity className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">{event.summary}</p>
                          {event.detail ? (
                            <p className="mt-1 text-sm leading-6 text-white/50">{event.detail}</p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/35">
                            <span>{fmtDate(event.occurredAt)}</span>
                            {event.actorName ? <span>{event.actorName}</span> : null}
                            <span>{event.eventName}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </SectionCard>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
