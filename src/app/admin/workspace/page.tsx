import { getWorkspacePages } from "@/features/workspace/server";
import { PageList } from "@/components/workspace/page-list";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { listApprovalRequests } from "@/features/approvals/server";
import { listSystemEvents } from "@/features/system-events/server";

export default async function WorkspacePage() {
  const [{ pages }, events, approvals] = await Promise.all([
    getWorkspacePages(),
    listSystemEvents({ audience: "all", limit: 12 }),
    listApprovalRequests({ audience: "all", status: "pending", limit: 8 }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <p className="text-sm font-medium text-[#9b9a97]">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2f2f2f]">
          Documents and knowledge
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#787774]">
          Your internal pages, briefs, and working notes in one place.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <PageList pages={pages} basePath="/admin/workspace" />
        <div className="space-y-6">
          <WorkspaceApprovalsPanel approvals={approvals} canDecide />
          <WorkspaceActivityFeed
            assetHrefPrefix="/admin/assets"
            campaignHrefPrefix="/admin/campaigns"
            crmHrefPrefix="/admin/crm"
            events={events}
            basePath="/admin/workspace"
            eventHrefPrefix="/admin/events"
            showClientSlug
          />
        </div>
      </div>
    </div>
  );
}
