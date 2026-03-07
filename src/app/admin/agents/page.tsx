import { getInitialData } from "./data";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { ChatPanel } from "@/components/admin/agents/chat-panel";
import { AgentCommandSummarySection } from "@/components/admin/agents/command-summary";
import { AgentSidebar } from "@/components/admin/agents/agent-sidebar";
import { JobHistory } from "@/components/admin/agents/job-history";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

import { AdminPageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const { commandSummary, jobs, isOnline, lastSeen, outcomes } = await getInitialData();

  // Chat panel gets only assistant jobs, in ascending order
  const chatJobs = [...jobs]
    .filter((j) => j.agent_id === "assistant")
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <div className="space-y-6">

      <AdminPageHeader
        title="Agent Command Center"
        description="Talk to the assistant, inspect live runtime pressure, and turn agent output into tracked follow-through."
      />

      <AgentCommandSummarySection
        attentionJobs={commandSummary.attentionJobs}
        summary={commandSummary}
      />

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:grid grid-cols-[1fr_272px] gap-6 items-start">
        <div className="rounded-xl border border-border/60 bg-card h-[640px] flex flex-col overflow-hidden">
          <ChatPanel initialJobs={chatJobs} />
        </div>
        <AgentSidebar isOnline={isOnline} lastSeen={lastSeen} />
      </div>

      {/* Mobile: chat opens as full-screen sheet */}
      <div className="lg:hidden space-y-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <MessageSquare className="h-4 w-4" />
              Open Agent Chat
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[100dvh] p-0">
            <SheetTitle className="sr-only">Agent Chat</SheetTitle>
            <SheetDescription className="sr-only">Chat with the AI agent</SheetDescription>
            <div className="h-full flex flex-col overflow-hidden">
              <ChatPanel initialJobs={chatJobs} />
            </div>
          </SheetContent>
        </Sheet>
        <AgentSidebar isOnline={isOnline} lastSeen={lastSeen} />
      </div>

      <AgentOutcomesPanel
        canCreateActionItems
        campaignHrefPrefix="/admin/campaigns"
        crmHrefPrefix="/admin/crm"
        assetHrefPrefix="/admin/assets"
        eventHrefPrefix="/admin/events"
        description="Recent agent requests, what came back, and whether they have already been turned into tracked next steps."
        emptyState="No agent follow-through is attached yet."
        outcomes={outcomes}
        title="Recent agent follow-through"
        variant="admin"
      />

      <JobHistory jobs={jobs} />

    </div>
  );
}
