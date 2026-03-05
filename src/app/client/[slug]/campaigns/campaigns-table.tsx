"use client";

import { useState } from "react";
import { Search, Megaphone } from "lucide-react";
import { fmtUsd, fmtNum, roasColor } from "@/lib/formatters";
import { getCampaignStatusCfg } from "@/lib/status";

interface Campaign {
  campaignId: string;
  name: string;
  status: string;
  spend: number;
  revenue: number | null;
  roas: number | null;
  impressions: number;
  ctr: number | null;
  cpc: number | null;
}

export function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  const [query, setQuery] = useState("");

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="glass-card flex items-center gap-3 px-4 py-3">
        <Search className="h-4 w-4 text-white/30 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/30 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-white/40 hover:text-white/60 shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-3.5 w-3.5 text-white/50" />
          <span className="section-label">All Campaigns</span>
        </div>
        <span className="text-xs text-white/45">
          {filtered.length} of {campaigns.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-3">
            <Megaphone className="h-5 w-5 text-white/40" />
          </div>
          <p className="text-sm text-white/60">
            {campaigns.length === 0
              ? "No campaign data yet"
              : "No campaigns match your search"}
          </p>
          <p className="text-xs text-white/30 mt-1">
            {campaigns.length === 0
              ? "Data refreshes on page load"
              : "Try a different search term"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Campaign</th>
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">Spend</th>
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">Revenue</th>
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">ROAS</th>
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">Impressions</th>
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">CTR</th>
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">CPC</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const statusCfg = getCampaignStatusCfg(c.status);
                  return (
                    <tr
                      key={c.campaignId}
                      className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                          <div>
                            <p className="text-sm text-white/90 font-medium">{c.name}</p>
                            <p className="text-xs text-white/40">{statusCfg.label}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right px-4 py-3 text-sm text-white/90 font-medium tabular-nums">
                        {fmtUsd(c.spend)}
                      </td>
                      <td className="text-right px-4 py-3 text-sm text-white/90 font-medium tabular-nums">
                        {fmtUsd(c.revenue)}
                      </td>
                      <td className="text-right px-4 py-3">
                        <span className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}>
                          {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
                        </span>
                      </td>
                      <td className="text-right px-4 py-3 text-sm text-white/50 tabular-nums">
                        {fmtNum(c.impressions)}
                      </td>
                      <td className="text-right px-4 py-3 text-sm text-white/50 tabular-nums">
                        {c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}
                      </td>
                      <td className="text-right px-4 py-3 text-sm text-white/50 tabular-nums">
                        {c.cpc != null ? "$" + c.cpc.toFixed(2) : "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card stack */}
          <div className="md:hidden glass-card divide-y divide-white/[0.06] overflow-hidden">
            {filtered.map((c) => {
              const statusCfg = getCampaignStatusCfg(c.status);
              return (
                <div key={c.campaignId} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                    <p className="text-sm text-white/90 font-medium truncate">{c.name}</p>
                    <span className="text-xs text-white/40 ml-auto shrink-0">{statusCfg.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Spend</span>
                      <span className="text-white/90 font-medium tabular-nums">{fmtUsd(c.spend)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Revenue</span>
                      <span className="text-white/90 font-medium tabular-nums">{fmtUsd(c.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">ROAS</span>
                      <span className={`font-semibold tabular-nums ${roasColor(c.roas)}`}>
                        {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">CTR</span>
                      <span className="tabular-nums text-white/50">
                        {c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">Impressions</span>
                      <span className="tabular-nums text-white/50">{fmtNum(c.impressions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-white/40">CPC</span>
                      <span className="tabular-nums text-white/50">
                        {c.cpc != null ? "$" + c.cpc.toFixed(2) : "--"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
