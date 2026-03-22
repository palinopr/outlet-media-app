import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReportsSurface } from "@/features/reports/components/reports-surface";
import { getReportsData, getReportsWorkflowData } from "@/features/reports/server";
import { requireClientReportsAccess } from "@/features/client-portal/access";
import { getClientPortalConfig } from "@/features/client-portal/config";

interface ClientReportsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ClientReportsPage({ params }: ClientReportsPageProps) {
  const { slug } = await params;
  const [{ scope }, portalConfig, user] = await Promise.all([
    requireClientReportsAccess(slug),
    getClientPortalConfig(slug),
    currentUser().catch(() => null),
  ]);

  if (!portalConfig?.reportsEnabled) {
    redirect(`/client/${slug}`);
  }

  const [reportsData, workflowData] = await Promise.all([
    getReportsData({ clientSlug: slug, scope }),
    getReportsWorkflowData({ clientSlug: slug, mode: "client", scope }),
  ]);

  const title = portalConfig.brandName ?? user?.firstName ?? "Client";

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Reports
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          {title} reporting
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          Performance, revenue, and next-step signals across the client portal package.
        </p>
      </header>

      <ReportsSurface data={reportsData} mode="client" workflow={workflowData} />
    </div>
  );
}
