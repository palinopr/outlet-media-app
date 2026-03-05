"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtUsd, statusBadge, roasColor } from "@/lib/formatters";
import type { ClientDetail } from "@/app/admin/clients/data";

export function CampaignsSection({ campaigns }: { campaigns: ClientDetail["campaigns"] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Assigned Campaigns</h2>
      </div>

      <Card className="border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">
                Campaign Name
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">
                Spend
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">
                ROAS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-sm text-muted-foreground"
                >
                  No campaigns assigned to this client.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id} className="border-border/60">
                  <TableCell className="text-sm font-medium">
                    {c.name}
                  </TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums">
                    {fmtUsd(c.spend)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}
                    >
                      {c.roas > 0 ? c.roas.toFixed(1) + "x" : "\u2014"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
