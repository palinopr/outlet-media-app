import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { BellRing } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { NotificationsCenter } from "@/components/workspace/notifications-center";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { WorkQueueSection } from "@/components/workflow/work-queue-section";
import { getAdminNotificationsCenter } from "@/features/notifications/center";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function AdminNotificationsPage() {
  const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const { userId } = clerkEnabled ? await auth() : { userId: null };
  const center = await getAdminNotificationsCenter({ userId });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notifications"
        description="A dedicated inbox for approvals, discussion, assignments, and routed workflow updates."
      >
        <span className="inline-flex items-center gap-1.5 rounded border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300">
          <BellRing className="h-3.5 w-3.5" />
          Admin inbox
        </span>
      </AdminPageHeader>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <WorkspaceApprovalsPanel
          approvals={center.approvals}
          canDecide
          title="Approvals waiting on you"
          description="Clear decisions you can make directly from the inbox surface."
          emptyState="No approvals are waiting on you right now."
          campaignHrefPrefix="/admin/campaigns"
          crmHrefPrefix="/admin/crm"
          assetHrefPrefix="/admin/assets"
          eventHrefPrefix="/admin/events"
          workspaceHrefPrefix="/admin/workspace"
          showClientSlug
        />
        <WorkQueueSection
          description="The cross-app items already assigned to you, so the inbox stays connected to real execution."
          emptyState="Nothing is assigned to you right now."
          showClientSlug
          showMetrics={false}
          summary={center.assignedWorkQueue}
          title="Assigned to you"
          variant="admin"
        />
      </div>

      <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
        <div className="mb-4">
          <p className="text-sm font-medium text-[#9b9a97]">Inbox</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
            Routed workflow notifications
          </h2>
          <p className="mt-1 text-sm text-[#9b9a97]">
            Approval decisions, comments, assignments, and workflow events routed only to your admin inbox.
          </p>
        </div>
        <NotificationsCenter initialNotifications={center.notifications} viewer="admin" />
      </section>
    </div>
  );
}
