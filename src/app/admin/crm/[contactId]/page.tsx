import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, Flame, Share2, UserRound } from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { CrmContactsPanel } from "@/components/crm/crm-contacts-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getCrmContactById } from "@/features/crm/server";
import { listSystemEvents } from "@/features/system-events/server";
import { slugToLabel } from "@/lib/formatters";

interface Props {
  params: Promise<{ contactId: string }>;
}

export default async function AdminCrmContactPage({ params }: Props) {
  const { contactId } = await params;
  const contact = await getCrmContactById(contactId, { audience: "all" });
  if (!contact) notFound();

  const [events, agentOutcomes] = await Promise.all([
    listSystemEvents({
      audience: "all",
      clientSlug: contact.clientSlug,
      entityId: contact.id,
      entityType: "crm_contact",
      limit: 8,
    }),
    listAgentOutcomes({
      audience: "all",
      clientSlug: contact.clientSlug,
      crmContactId: contact.id,
      limit: 4,
    }),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/crm"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to CRM
      </Link>

      <AdminPageHeader
        title={contact.fullName}
        description={`CRM record for ${slugToLabel(contact.clientSlug)}.`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {slugToLabel(contact.clientSlug)}
          </span>
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {contact.lifecycleStage}
          </span>
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {contact.visibility === "shared" ? "Shared with client" : "Admin only"}
          </span>
        </div>
      </AdminPageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Lead score"
          value={contact.leadScore != null ? String(contact.leadScore) : "--"}
          icon={Flame}
          accent="from-rose-500/20 to-orange-500/20"
          iconColor="text-rose-400"
        />
        <StatCard
          label="Next follow-up"
          value={
            contact.nextFollowUpAt
              ? new Date(contact.nextFollowUpAt).toLocaleDateString("en-US")
              : "None"
          }
          icon={CalendarClock}
          accent="from-amber-500/20 to-yellow-500/20"
          iconColor="text-amber-400"
        />
        <StatCard
          label="Visibility"
          value={contact.visibility === "shared" ? "Shared" : "Private"}
          icon={Share2}
          accent="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          label="Owner"
          value={contact.ownerName ?? "Unassigned"}
          icon={UserRound}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <CrmContactsPanel
            canManage
            contacts={[contact]}
            title="Contact details"
            description="Update stage and mark follow-ups complete from the CRM contact record."
            emptyState="CRM contact not found."
            variant="admin"
          />

          <AgentOutcomesPanel
            outcomes={agentOutcomes}
            title="CRM follow-through"
            description="Bounded agent triage and recommendations tied directly to this CRM contact."
            emptyState="No CRM follow-through has been queued for this contact yet."
            variant="admin"
          />
        </div>

        <WorkspaceActivityFeed
          events={events}
          basePath="/admin/crm"
          title="Contact activity"
          description="Shared timeline for this CRM record."
          emptyState="CRM updates for this contact will appear here."
        />
      </div>
    </div>
  );
}
