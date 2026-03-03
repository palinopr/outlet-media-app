"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AgentJob } from "@/app/admin/agents/data";
import { fmtDate } from "@/lib/formatters";
import { agentName } from "./constants";
import { StatusBadge } from "./status-badge";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { DataTablePagination } from "@/components/admin/data-table/data-table-pagination";

interface Props {
  jobs: AgentJob[];
}

function durationMs(started: string | null, finished: string | null): number | null {
  if (!started || !finished) return null;
  return new Date(finished).getTime() - new Date(started).getTime();
}

function fmtDuration(ms: number | null): string {
  if (ms == null) return "\u2014";
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60000)}m`;
}

function outputText(job: AgentJob): string | null {
  return job.error || job.result || null;
}

const columns: ColumnDef<AgentJob>[] = [
  {
    id: "expand",
    enableSorting: false,
    enableHiding: false,
    header: () => null,
    cell: () => null, // placeholder -- real rendering happens in the table body
    size: 24,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <ColumnHeader column={column} title="Started" />,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {fmtDate(row.original.created_at)}
      </span>
    ),
  },
  {
    accessorKey: "agent_id",
    header: ({ column }) => <ColumnHeader column={column} title="Agent" />,
    cell: ({ row }) => (
      <span className="text-xs font-medium">{agentName(row.original.agent_id)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "duration",
    accessorFn: (row) => durationMs(row.started_at, row.finished_at),
    header: ({ column }) => <ColumnHeader column={column} title="Duration" />,
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {fmtDuration(getValue<number | null>())}
      </span>
    ),
    sortUndefined: "last",
  },
  {
    id: "preview",
    enableSorting: false,
    header: () => (
      <span className="text-xs font-medium text-muted-foreground">Output preview</span>
    ),
    cell: ({ row }) => {
      const text = outputText(row.original);
      const preview = text ? text.slice(0, 120).replace(/\n/g, " ") : null;
      return (
        <span className="text-xs text-muted-foreground max-w-xs truncate block">
          {preview ?? "\u2014"}
        </span>
      );
    },
  },
];

export function JobHistory({ jobs }: Props) {
  const data = useMemo(
    () => jobs.filter((j) => j.agent_id !== "assistant" && j.agent_id !== "heartbeat"),
    [jobs],
  );

  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  function toggleRow(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        Automated Run History
        <span className="text-muted-foreground font-normal ml-2">({data.length})</span>
      </h2>
      <Card className="border-border/60">
        {data.length === 0 ? (
          <div className="py-10 text-center text-xs text-muted-foreground">
            No automated runs yet -- the agent runs Meta sync every 6h and think cycles every 30m
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-border/60 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={header.id === "expand" ? { width: 24 } : undefined}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-xs text-muted-foreground">
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    const job = row.original;
                    const output = outputText(job);
                    const isExpanded = expandedRows.has(job.id);

                    return (
                      <ExpandableRow
                        key={row.id}
                        row={row}
                        output={output}
                        isExpanded={isExpanded}
                        onToggle={() => toggleRow(job.id)}
                        columnCount={columns.length}
                      />
                    );
                  })
                )}
              </TableBody>
            </Table>
            <DataTablePagination table={table} />
          </>
        )}
      </Card>
    </div>
  );
}

// Separate component to keep the table body clean.
// Renders the data row and, when expanded, an additional row with full output.
import type { Row } from "@tanstack/react-table";

interface ExpandableRowProps {
  row: Row<AgentJob>;
  output: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  columnCount: number;
}

function ExpandableRow({ row, output, isExpanded, onToggle, columnCount }: ExpandableRowProps) {
  return (
    <>
      <TableRow
        className="border-border/60 cursor-pointer hover:bg-muted/30"
        onClick={onToggle}
      >
        {row.getVisibleCells().map((cell) => {
          if (cell.column.id === "expand") {
            return (
              <TableCell key={cell.id} className="w-6 text-muted-foreground">
                {output
                  ? isExpanded
                    ? <ChevronDown className="h-3 w-3" />
                    : <ChevronRight className="h-3 w-3" />
                  : null}
              </TableCell>
            );
          }
          return (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </TableRow>
      {isExpanded && output && (
        <TableRow className="border-border/60 bg-muted/20">
          <TableCell colSpan={columnCount} className="py-3 px-4">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
              {output}
            </pre>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
