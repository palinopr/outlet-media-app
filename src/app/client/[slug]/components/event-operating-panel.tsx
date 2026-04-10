import {
  Activity,
  Bot,
  ListTodo,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
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
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/45">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/10 px-4 py-5 text-sm text-white/45">
      {message}
    </div>
  );
}

export function EventOperatingPanel({ data, eventId, slug }: EventOperatingPanelProps) {
  const discussionThreads = groupDiscussionThreads(data.comments);
  const openThreads = discussionThreads.filter((comment) => !comment.resolved);

  const summaryCards = [
    {
      icon: ShieldCheck,
      label: "Pending approvals",
      value: String(data.approvals.length),
      detail:
        data.approvals.length === 1 ? "Decision waiting on this show" : "Decisions waiting on this show",
    },
    {
      icon: ListTodo,
      label: "Open next steps",
      value: String(data.followUpItems.length),
      detail:
        data.followUpItems.length === 1 ? "Shared event follow-through item" : "Shared event follow-through items",
    },
    {
      icon: MessageSquareMore,
      label: "Open discussion",
      value: String(openThreads.length),
      detail: openThreads.length === 1 ? "Active thread" : "Active threads",
    },
    {
      icon: Bot,
      label: "Agent follow-through",
      value: String(data.agentOutcomes.length),
      detail:
        data.agentOutcomes.length === 1 ? "Visible event outcome" : "Visible event outcomes",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2 flex items-center gap-2 text-cyan-300/80">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Event operating loop</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Shared approvals, event follow-up, discussion, and linked agent work
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Keep show-level ticketing questions, blockers, next steps, and linked campaign follow-through attached to this event instead of scattering the operating context.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  <Icon className="h-3.5 w-3.5" />
                  {card.label}
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{card.value}</p>
                <p className="mt-1 text-xs text-white/40">{card.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="Pending approvals"
          subtitle="Explicit decisions still attached to this event or its linked promotion work."
        >
          {data.approvals.length === 0 ? (
            <EmptyState message="No pending approvals are attached to this event right now." />
          ) : (
            <div className="space-y-3">
              {data.approvals.map((approval) => (
                <article key={approval.id} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium text-white">{approval.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${toneBadge("warning")}`}>
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
          )}
        </SectionCard>

        <SectionCard
          title="Open next steps"
          subtitle="Show-level follow-through already attached to the event."
        >
          {data.followUpItems.length === 0 ? (
            <EmptyState message="No shared follow-up items are open for this event." />
          ) : (
            <div className="space-y-3">
              {data.followUpItems.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${toneBadge("neutral")}`}>
                      {taskStatusLabel(item.status)}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${followUpPriorityTone(item.priority)}`}
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
          )}
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="Shared discussion"
          subtitle="Comments stay attached to the event so ticketing questions and promotion blockers remain visible in context."
        >
          <div className="mb-4">
            <EventDiscussionForm eventId={eventId} slug={slug} />
          </div>

          {discussionThreads.length === 0 ? (
            <EmptyState message="No event discussion has started yet. Leave the first note, blocker, or show update here." />
          ) : (
            <div className="space-y-3">
              {discussionThreads.map((thread) => (
                <article key={thread.id} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white">{thread.authorName ?? "Unknown author"}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${toneBadge(thread.resolved ? "success" : "neutral")}`}>
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
          )}
        </SectionCard>

        <div className="space-y-4">
          <SectionCard
            title="Agent follow-through"
            subtitle="Agent work attached to this event and its linked campaign context."
          >
            {data.agentOutcomes.length === 0 ? (
              <EmptyState message="No shared agent outcomes are visible on this event yet." />
            ) : (
              <div className="space-y-3">
                {data.agentOutcomes.map((outcome) => (
                  <article key={outcome.taskId} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{outcome.requestSummary}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] ${toneBadge(outcomeTone(outcome.status))}`}>
                        {outcomeLabel(outcome.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {compactText(outcome.resultText, 200) ?? compactText(outcome.requestDetail, 200) ?? "Waiting for a result or linked next step."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/35">
                      <span>{outcome.eventName ?? outcome.campaignName ?? outcome.agentId}</span>
                      <span>{fmtDate(outcome.createdAt)}</span>
                      {outcome.linkedEventFollowUpItemId ? <span>Linked to an event next step</span> : null}
                      {!outcome.linkedEventFollowUpItemId && outcome.linkedActionItemId ? (
                        <span>Linked to a campaign next step</span>
                      ) : null}
                      {!outcome.linkedEventFollowUpItemId && !outcome.linkedActionItemId && outcome.linkedAssetFollowUpItemId ? (
                        <span>Linked to creative follow-up</span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Recent activity"
            subtitle="Shared timeline signals attached to this event and its linked campaign work."
          >
            {data.systemEvents.length === 0 ? (
              <EmptyState message="No recent shared activity is attached to this event." />
            ) : (
              <div className="space-y-3">
                {data.systemEvents.map((event) => (
                  <article key={event.id} className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
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
            )}
          </SectionCard>
        </div>
      </div>

      {data.approvals.length === 0 &&
      data.followUpItems.length === 0 &&
      discussionThreads.length === 0 &&
      data.agentOutcomes.length === 0 &&
      data.systemEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/10 px-5 py-4 text-sm text-white/45">
          This event has not built much workflow pressure yet. Use the discussion panel to keep new show updates and blockers attached here as activity grows.
        </div>
      ) : null}
    </section>
  );
}
