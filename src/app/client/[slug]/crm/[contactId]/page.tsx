import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, Flame, Share2, UserRound } from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { CrmContactsPanel } from "@/components/crm/crm-contacts-panel";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getCrmContactById } from "@/features/crm/server";
import { requireClientAccess } from "@/features/client-portal/access";
import { listSystemEvents } from "@/features/system-events/server";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import { StatCard } from "../../components/stat-card";

interface Props {
  params: Promise<{ contactId: string; slug: string }>;
}

export default async function ClientCrmContactPage({ params }: Props) {
  const { slug, contactId } = await params;
  await requireClientAccess(slug, "crm");

  const contact = await getCrmContactById(contactId, {
    audience: "shared",
    clientSlug: slug,
  });
  if (!contact) notFound();

  const [events, agentOutcomes] = await Promise.all([
    listSystemEvents({
      audience: "shared",
      clientSlug: slug,
      entityId: contact.id,
      entityType: "crm_contact",
      limit: 8,
    }),
    listAgentOutcomes({
      audience: "shared",
      clientSlug: slug,
      crmContactId: contact.id,
      limit: 4,
    }),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href={`/client/${slug}/crm`}
        className="inline-flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-white/80"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to CRM
      </Link>

      <div className="space-y-2">
        <p className="section-label">CRM</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">{contact.fullName}</h1>
        <p className="max-w-3xl text-sm text-white/55">
          Shared CRM context and relationship activity for this contact.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Flame}
          iconColor="bg-rose-500/10 ring-1 ring-rose-500/20 text-rose-400"
          label="Lead score"
          value={contact.leadScore != null ? String(contact.leadScore) : "--"}
        />
        <StatCard
          icon={CalendarClock}
          iconColor="bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400"
          label="Next follow-up"
          value={
            contact.nextFollowUpAt
              ? new Date(contact.nextFollowUpAt).toLocaleDateString("en-US")
              : "None"
          }
        />
        <StatCard
          icon={Share2}
          iconColor="bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400"
          label="Visibility"
          value="Shared"
        />
        <StatCard
          icon={UserRound}
          iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
          label="Owner"
          value={contact.ownerName ?? "Outlet Team"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <CrmContactsPanel
            contacts={[contact]}
            title="Contact details"
            description="The current shared CRM context for this relationship."
            emptyState="This CRM contact is not available."
            variant="client"
          />

          <AgentOutcomesPanel
            outcomes={agentOutcomes}
            title="CRM follow-through"
            description="Shared agent recommendations tied to this relationship."
            emptyState="No shared CRM follow-through is available for this contact yet."
            variant="client"
          />
        </div>

        <WorkspaceActivityFeed
          events={events}
          basePath={`/client/${slug}/crm`}
          title="Contact activity"
          description="Shared CRM updates for this contact."
          emptyState="CRM updates for this contact will appear here."
        />
      </div>

      <ClientPortalFooter dataSource="supabase" />
    </div>
  );
}
