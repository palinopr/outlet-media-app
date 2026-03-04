import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ActivityLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64 hidden sm:block" />
        </div>
        <Skeleton className="h-7 w-32 rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Activity feed card */}
      <Card className="border-border/60">
        {/* Toolbar with filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
          <Skeleton className="h-5 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
        {/* Rows */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-4 w-16 shrink-0" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-4 flex-1 max-w-[200px]" />
              <Skeleton className="h-4 w-40 hidden sm:block" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
