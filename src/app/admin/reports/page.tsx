import { AdminPageHeader } from "@/components/admin/page-header";
import { ReportsSurface } from "@/features/reports/components/reports-surface";
import { getReportsData, getReportsWorkflowData } from "@/features/reports/server";

export default async function AdminReportsPage() {
  const [reportsData, workflowData] = await Promise.all([
    getReportsData(),
    getReportsWorkflowData({ mode: "admin" }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Campaign, event, and operating signals from the shared reporting backbone"
      />
      <ReportsSurface data={reportsData} mode="admin" workflow={workflowData} />
    </div>
  );
}
