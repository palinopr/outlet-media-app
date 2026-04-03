import { AdminPageHeader } from "@/components/admin/page-header";
import { ReportsSurface } from "@/features/reports/components/reports-surface";
import { getReportsData, getReportsWorkflowData } from "@/features/reports/server";

export default async function AdminReportsPage() {
  const [data, workflow] = await Promise.all([
    getReportsData(),
    getReportsWorkflowData({
      limit: 4,
      mode: "admin",
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Shared campaign, revenue, and event reporting across the admin operating surface."
      />

      <ReportsSurface data={data} mode="admin" workflow={workflow} />
    </div>
  );
}
