import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { slugToLabel } from "@/lib/formatters";
import { requireClientReportsAccess } from "@/features/client-portal/access";
import { ReportsSurface } from "@/features/reports/components/reports-surface";
import { getReportsData, getReportsWorkflowData } from "@/features/reports/server";

interface ClientReportsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ClientReportsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);

  return {
    title: `${clientName} Reports`,
    description: `Performance reports for ${clientName}`,
  };
}

export default async function ClientReportsPage({ params }: ClientReportsPageProps) {
  const { slug } = await params;
  const { scope } = await requireClientReportsAccess(slug);

  const [data, workflow] = await Promise.all([
    getReportsData({ clientSlug: slug, scope }),
    getReportsWorkflowData({
      clientSlug: slug,
      limit: 4,
      mode: "client",
      scope,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-violet-500/[0.08] to-transparent blur-3xl" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400/70" />
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              Reports
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {slugToLabel(slug)} Reports
          </h1>
          <p className="mt-1.5 text-sm text-white/60">
            Shared campaign, revenue, and event reporting for this client account.
          </p>
        </div>
      </div>

      <ReportsSurface data={data} mode="client" workflow={workflow} />
    </div>
  );
}
