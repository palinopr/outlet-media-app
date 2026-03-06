import type { Metadata } from "next";
import { BellRing } from "lucide-react";
import { NotificationsCenter } from "@/components/workspace/notifications-center";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { WorkQueueSection } from "@/components/workflow/work-queue-section";
import { getClientNotificationsCenter } from "@/features/notifications/center";
import { requireClientAccess } from "@/features/client-portal/access";
import { slugToLabel } from "@/lib/formatters";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Notifications`,
    description: `The routed inbox for ${clientName} workflow updates`,
  };
}

export default async function ClientNotificationsPage({ params }: Props) {
  const { slug } = await params;
  const { scope, userId } = await requireClientAccess(slug);
  const center = await getClientNotificationsCenter({
    clientSlug: slug,
    scope,
    userId,
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-violet-500/[0.08] to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <BellRing className="h-4 w-4 text-cyan-400/70" />
            Notifications
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Routed inbox
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/60">
              Shared approval requests, comments, assignments, and workflow updates for this client account only.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <WorkspaceApprovalsPanel
          approvals={center.approvals}
          canDecide
          title="Approvals waiting on you"
          description="Clear decisions you can make without leaving the client inbox."
          emptyState="No shared approvals are waiting on you right now."
          campaignHrefPrefix={`/client/${slug}/campaign`}
          crmHrefPrefix={`/client/${slug}/crm`}
          assetHrefPrefix={`/client/${slug}/assets`}
          eventHrefPrefix={`/client/${slug}/event`}
          workspaceHrefPrefix={`/client/${slug}/workspace`}
        />
        <WorkQueueSection
          description="The cross-app items already assigned to you, so the inbox stays connected to the real work."
          emptyState="Nothing is assigned to you right now."
          showMetrics={false}
          summary={center.assignedWorkQueue}
          title="Assigned to you"
          variant="client"
        />
      </div>

      <section className="glass-card p-5">
        <div className="mb-4">
          <p className="text-sm font-medium text-white/50">Inbox</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Shared notifications
          </h2>
          <p className="mt-1 text-sm text-white/50">
            This inbox is scoped to {slugToLabel(slug)} so client-facing users only see shared workflow context for this account.
          </p>
        </div>
        <NotificationsCenter
          fallbackClientSlug={slug}
          initialNotifications={center.notifications}
          viewer="client"
        />
      </section>
    </div>
  );
}
