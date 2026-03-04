import type { Metadata } from "next";
import { Suspense } from "react";
import { Activity, Users, AlertTriangle, Eye } from "lucide-react";
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
      {/* Header */}
      <AdminPageHeader
        title="Activity"
        description="Admin user activity, actions, and errors"
      >
        {fromDb ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 rounded">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live from Supabase
          </span>
        ) : (
          <span className="text-xs text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded">
            No data
          </span>
        )}
      </AdminPageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Events Today"
          value={String(stats.totalToday)}
          icon={Activity}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Active Users"
          value={String(stats.activeUsersToday)}
          icon={Users}
          accent="from-violet-500/20 to-purple-500/20"
          iconColor="text-violet-400"
        />
        <StatCard
          label="Errors Today"
          value={String(stats.errorsToday)}
          icon={AlertTriangle}
          accent={stats.errorsToday > 0 ? "from-red-500/20 to-red-600/20" : "from-white/[0.02] to-transparent"}
          iconColor={stats.errorsToday > 0 ? "text-red-400" : "text-muted-foreground"}
        />
        <StatCard
          label="Most Active Page"
          value={stats.mostActivePage?.replace("/admin/", "") ?? "--"}
          icon={Eye}
          accent="from-amber-500/20 to-orange-500/20"
          iconColor="text-amber-400"
        />
      </div>

      {/* Feed */}
      <Card className="border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
          <p className="text-sm font-semibold">
            Activity feed
            <span className="text-muted-foreground font-normal ml-1.5">({rows.length})</span>
          </p>
          <Suspense>
            <ActivityFilters
              users={users}
            />
          </Suspense>
        </div>
        <ActivityTable rows={rows} />
      </Card>
    </div>
  );
}
