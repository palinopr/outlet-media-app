import type { CampaignOperatingData } from "@/features/campaigns/server";
import { fmtDate, fmtNum, fmtUsd, roasColor } from "@/lib/formatters";
import { taskStatusLabel } from "@/lib/action-item-labels";
import { TASK_PRIORITY_LABELS } from "@/lib/workspace-types";

interface Props {
  data: CampaignOperatingData;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-wide text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground">{message}</p>;
}

function KpiCard({
  label,
  value,
  detail,
  valueClassName,
}: {
  label: string;
  value: string;
  detail: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight ${valueClassName ?? ""}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function badgeClass(kind: "neutral" | "priority" | "warning") {
  switch (kind) {
    case "priority":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "warning":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    default:
      return "border-border/60 bg-muted/50 text-muted-foreground";
  }
}

export function CampaignDetailDashboard({ data }: Props) {
  const { actionItems, approvals, assets, campaign, comments, linkedEvents, systemEvents } = data;

  const unresolvedComments = comments.filter((comment) => !comment.resolved && !comment.parentCommentId);
  const openActionItems = actionItems.filter((item) => item.status !== "done");

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-[linear-gradient(135deg,rgba(20,36,38,1),rgba(19,24,31,1))] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-teal-200/70">Campaign operating view</p>
            <h2 className="text-3xl font-semibold tracking-tight">{campaign.name}</h2>
            <p className="text-sm leading-6 text-slate-200/80">
              This view shows the live workflow pressure around the campaign: approvals awaiting review,
              open follow-through, unresolved discussion, linked event context, and the latest shared system activity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard
              label="Spend"
              value={fmtUsd(campaign.spend)}
              detail={`${fmtNum(campaign.impressions)} impressions`}
            />
            <KpiCard
              label="ROAS"
              value={campaign.roas != null ? `${campaign.roas.toFixed(2)}x` : "--"}
              detail={campaign.revenue != null ? `${fmtUsd(campaign.revenue)} est. revenue` : "Revenue unavailable"}
              valueClassName={roasColor(campaign.roas)}
            />
            <KpiCard
              label="Approvals"
              value={String(approvals.length)}
              detail={approvals.length === 1 ? "Decision waiting" : "Decisions waiting"}
            />
            <KpiCard
              label="Open follow-through"
              value={String(openActionItems.length)}
              detail={unresolvedComments.length === 1 ? "Discussion thread open" : `${unresolvedComments.length} discussion threads open`}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Pending approvals">
          {approvals.length === 0 ? (
            <EmptyState message="No pending approvals are attached to this campaign." />
          ) : (
            <div className="space-y-3">
              {approvals.map((approval) => (
                <article key={approval.id} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium">{approval.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${badgeClass("warning")}`}>
                      {approval.requestType}
                    </span>
                  </div>
                  {approval.summary ? (
                    <p className="mt-2 text-sm text-muted-foreground">{approval.summary}</p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Requested {fmtDate(approval.createdAt)}
                    {approval.requestedByName ? ` by ${approval.requestedByName}` : ""}
                  </p>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Linked events">
          {linkedEvents.length === 0 ? (
            <EmptyState message="This campaign is not currently linked to an event record." />
          ) : (
            <div className="space-y-3">
              {linkedEvents.map((event) => (
                <article key={event.id} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium">{event.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.venue ?? "Venue pending"}
                        {event.city ? `, ${event.city}` : ""}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${badgeClass("neutral")}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
                    <p>Date: {fmtDate(event.date)}</p>
                    <p>Sold: {fmtNum(event.ticketsSold)}</p>
                    <p>Available: {fmtNum(event.ticketsAvailable)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Action items">
          {openActionItems.length === 0 ? (
            <EmptyState message="No open action items are attached to this campaign." />
          ) : (
            <div className="space-y-3">
              {openActionItems.map((item) => (
                <article key={item.id} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${badgeClass("neutral")}`}>
                      {taskStatusLabel(item.status)}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${badgeClass("priority")}`}>
                      {TASK_PRIORITY_LABELS[item.priority]}
                    </span>
                  </div>
                  {item.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>Assignee: {item.assigneeName ?? "Unassigned"}</span>
                    <span>Due: {fmtDate(item.dueDate)}</span>
                    <span>Updated: {fmtDate(item.updatedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Linked assets">
          {assets.length === 0 ? (
            <EmptyState message="No campaign-linked assets were found in the active asset ledger." />
          ) : (
            <div className="space-y-3">
              {assets.map((asset) => (
                <article key={asset.id} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium">{asset.fileName}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {asset.mediaType ?? "asset"}
                        {asset.placement ? ` · ${asset.placement}` : ""}
                        {asset.format ? ` · ${asset.format}` : ""}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${badgeClass("neutral")}`}>
                      {asset.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Unresolved discussion">
          {unresolvedComments.length === 0 ? (
            <EmptyState message="No unresolved campaign discussion is open right now." />
          ) : (
            <div className="space-y-3">
              {unresolvedComments.map((comment) => (
                <article key={comment.id} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <p className="text-sm leading-6 text-foreground">{comment.content}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {comment.authorName ?? "Unknown author"} · {fmtDate(comment.createdAt)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recent activity">
          {systemEvents.length === 0 ? (
            <EmptyState message="No recent system activity is attached to this campaign." />
          ) : (
            <div className="space-y-3">
              {systemEvents.map((event) => (
                <article key={event.id} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium">{event.summary}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${badgeClass("neutral")}`}>
                      {event.eventName}
                    </span>
                  </div>
                  {event.detail ? (
                    <p className="mt-2 text-sm text-muted-foreground">{event.detail}</p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {fmtDate(event.occurredAt)}
                    {event.actorName ? ` · ${event.actorName}` : ""}
                  </p>
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
