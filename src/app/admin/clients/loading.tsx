import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ClientsLoading() {
  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 hidden sm:block" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-20 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/60">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-border/60">
          <Skeleton className="h-9 flex-1 max-w-sm rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        {/* Rows */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-16 rounded" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
