import type { Metadata } from "next";
import { Suspense } from "react";
import { Activity, AlertTriangle, Users, Waypoints } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Card } from "@/components/ui/card";
import { getActivity } from "./data";
import { ActivityFilters } from "@/components/admin/activity/activity-filters";
import { ActivityTable } from "@/components/admin/activity/activity-table";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Activity" };

interface Props {
  searchParams: Promise<{ user?: string; type?: string; range?: string }>;
}

function formatPageLabel(page: string | null) {
  if (!page) return "--";
  return page.replace(/^\/admin\//, "");
}

export default async function ActivityPage({ searchParams }: Props) {
  const { user, type, range } = await searchParams;
  const selectedUser = user ?? "all";
  const selectedType = type ?? "all";
  const selectedRange = range ?? "7d";

  const { rows, stats, users, fromDb } = await getActivity({
    user: selectedUser !== "all" ? selectedUser : null,
    eventType: selectedType !== "all" ? selectedType : null,
    range: selectedRange,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Activity"
        description="Direct admin audit trail for page views, actions, sessions, and errors."
      >
        {fromDb ? (
          <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live audit log
          </span>
        ) : (
          <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
            Audit log unavailable
          </span>
        )}
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Events today"
          value={String(stats.totalToday)}
          icon={Activity}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Active users"
          value={String(stats.activeUsersToday)}
          icon={Users}
          accent="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          label="Errors today"
          value={String(stats.errorsToday)}
          icon={AlertTriangle}
          accent="from-amber-500/20 to-orange-500/20"
          iconColor="text-amber-400"
        />
        <StatCard
          label="Most active page"
          value={formatPageLabel(stats.mostActivePage)}
          icon={Waypoints}
          accent="from-violet-500/20 to-purple-500/20"
          iconColor="text-violet-400"
        />
      </div>

      <Card className="border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
          <div>
            <p className="text-sm font-semibold">
              Admin audit log
              <span className="ml-1.5 font-normal text-muted-foreground">({rows.length})</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use this to see which admin users are active, where they are working, and whether errors are surfacing.
            </p>
          </div>
          <Suspense>
            <ActivityFilters users={users} />
          </Suspense>
        </div>
        <ActivityTable rows={rows} />
      </Card>
    </div>
  );
}
