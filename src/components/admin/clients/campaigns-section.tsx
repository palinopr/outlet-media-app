"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export function CampaignsSection({
  campaigns,
  clientSlug,
}: {
  campaigns: ClientDetail["campaigns"];
  clientSlug: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Assigned Campaigns</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            These are the campaigns clients can see when their member visibility allows it.
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="h-8 w-fit text-xs">
          <Link href={`/admin/campaigns?client=${encodeURIComponent(clientSlug)}`}>
            Manage in Campaigns
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60">
        <div className="overflow-x-auto">
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
                    No campaigns assigned to this client. Use Campaigns → Needs assignment to connect Meta campaigns.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((c) => (
                  <TableRow key={c.id} className="border-border/60">
                    <TableCell className="text-sm font-medium">
                      <Link href={`/admin/campaigns/${c.id}`} className="transition-colors hover:text-primary">
                        {c.name}
                      </Link>
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
        </div>
      </Card>
    </div>
  );
}
