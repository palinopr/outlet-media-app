"use client";

import { Fragment, useState } from "react";
import type { ActivityRow } from "@/app/admin/activity/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TYPE_STYLES: Record<string, { label: string; classes: string }> = {
  page_view: { label: "Page View", classes: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  action: { label: "Action", classes: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  error: { label: "Error", classes: "text-red-400 bg-red-500/10 border-red-500/20" },
  session_start: { label: "Session", classes: "text-white/60 bg-white/[0.06] border-white/10" },
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function ActivityTable({ rows }: { rows: ActivityRow[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No activity found for the selected filters.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Time</TableHead>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[160px]">Page</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const style = TYPE_STYLES[row.event_type] ?? TYPE_STYLES.page_view;
              const isExpanded = expandedId === row.id;
              const hasMetadata = row.metadata && Object.keys(row.metadata).length > 0;

              return (
                <Fragment key={row.id}>
                  <TableRow
                    className={hasMetadata ? "cursor-pointer hover:bg-white/[0.02]" : ""}
                    onClick={() => hasMetadata && setExpandedId(isExpanded ? null : row.id)}
                  >
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {formatTime(row.created_at)}
                    </TableCell>
                    <TableCell className="text-xs truncate max-w-[200px]">
                      {row.user_email}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${style.classes}`}
                      >
                        {style.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {row.page ?? "--"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.detail ?? "--"}
                    </TableCell>
                  </TableRow>
                  {isExpanded && hasMetadata && (
                    <TableRow key={`${row.id}-meta`}>
                      <TableCell colSpan={5} className="bg-white/[0.02] px-6 py-3">
                        <pre className="text-[11px] text-muted-foreground font-mono whitespace-pre-wrap break-all">
                          {JSON.stringify(row.metadata, null, 2)}
                        </pre>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border/40">
        {rows.map((row) => {
          const style = TYPE_STYLES[row.event_type] ?? TYPE_STYLES.page_view;
          return (
            <div key={row.id} className="px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${style.classes}`}
                >
                  {style.label}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {formatTime(row.created_at)}
                </span>
              </div>
              <p className="text-xs truncate text-foreground">{row.user_email}</p>
              {row.page && (
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  {row.page}
                </p>
              )}
              {row.detail && (
                <p className="text-xs text-muted-foreground">{row.detail}</p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
