"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Megaphone, ChevronRight } from "lucide-react";
import { fmtUsd, fmtNum, roasColor } from "@/lib/formatters";
import { getCampaignStatusCfg } from "@/lib/status";
import type { CampaignCard } from "../types";
import { getRangeQuery, type CampaignRangeInput } from "@/lib/constants";

export function CampaignsTable({
  campaigns,
  range,
  slug,
}: {
  campaigns: CampaignCard[];
  range: CampaignRangeInput;
  slug: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const campaignDetailHref = (campaignId: string) => `/client/${slug}/campaign/${campaignId}?${getRangeQuery(range)}`;

  const queryLower = query.toLowerCase();
  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(queryLower),
  );

  const hasRevenue = campaigns.some((c) => c.revenue != null || c.roas != null);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-[#07111f]/72 px-4 py-3 shadow-[0_14px_48px_rgba(0,0,0,0.18)]">
        <Search className="h-4 w-4 text-blue-300/60 shrink-0" />
        <input
          type="text"
          id="campaign-search"
          name="campaign-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search campaigns..."
          aria-label="Search campaigns"
          className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/30 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-white/42 hover:text-white/70 shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-3.5 w-3.5 text-blue-300/70" />
          <span className="text-sm font-semibold text-white">All Campaigns</span>
        </div>
        <span className="text-xs text-white/45">
          {filtered.length} of {campaigns.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.09] bg-[#07111f]/72 p-12 text-center">
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
          <div className="hidden overflow-hidden rounded-2xl border border-white/[0.09] bg-[#07111f]/72 shadow-[0_16px_60px_rgba(0,0,0,0.22)] md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.015]">
                  <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Campaign</th>
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">Spend</th>
                  {hasRevenue ? (
                    <>
                      <th className="text-right text-xs font-medium text-white/40 px-4 py-3">Revenue</th>
                      <th className="text-right text-xs font-medium text-white/40 px-4 py-3">ROAS</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right text-xs font-medium text-white/40 px-4 py-3">Clicks</th>
                      <th className="text-right text-xs font-medium text-white/40 px-4 py-3">CPC</th>
                    </>
                  )}
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">Impressions</th>
                  <th className="text-right text-xs font-medium text-white/40 px-4 py-3">CTR</th>
                  <th className="w-8 px-2 py-3" aria-label="Open campaign" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const statusCfg = getCampaignStatusCfg(c.status);
                  return (
                    <tr
                      key={c.campaignId}
                      onClick={() => router.push(campaignDetailHref(c.campaignId))}
                      className="border-b border-white/[0.06] last:border-0 hover:bg-blue-500/[0.06] transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                          <div>
                            <p className="text-sm text-white/90 font-medium group-hover:text-white transition-colors">{c.name}</p>
                            <p className="text-xs text-white/40">{statusCfg.label}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right px-4 py-3 text-sm text-white/90 font-medium tabular-nums">
                        {fmtUsd(c.spend)}
                      </td>
                      {hasRevenue ? (
                        <>
                          <td className="text-right px-4 py-3 text-sm text-white/90 font-medium tabular-nums">
                            {c.revenue != null ? fmtUsd(c.revenue) : "--"}
                          </td>
                          <td className="text-right px-4 py-3">
                            <span className={`text-sm font-semibold tabular-nums ${roasColor(c.roas)}`}>
                              {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="text-right px-4 py-3 text-sm text-white/55 tabular-nums">
                            {fmtNum(c.clicks)}
                          </td>
                          <td className="text-right px-4 py-3 text-sm text-white/55 tabular-nums">
                            {c.cpc != null ? fmtUsd(c.cpc) : "--"}
                          </td>
                        </>
                      )}
                      <td className="text-right px-4 py-3 text-sm text-white/50 tabular-nums">
                        {fmtNum(c.impressions)}
                      </td>
                      <td className="text-right px-4 py-3 text-sm text-white/50 tabular-nums">
                        {c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}
                      </td>
                      <td className="w-8 px-2 py-3">
                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-white/50" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card stack */}
          <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#07111f]/72 md:hidden">
            {filtered.map((c) => {
              const statusCfg = getCampaignStatusCfg(c.status);
              return (
                <Link key={c.campaignId} href={campaignDetailHref(c.campaignId)} className="block px-4 py-3 hover:bg-white/[0.04] transition-colors">
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
                    {hasRevenue ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-xs text-white/40">Revenue</span>
                          <span className="text-white/90 font-medium tabular-nums">
                            {c.revenue != null ? fmtUsd(c.revenue) : "--"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-white/40">ROAS</span>
                          <span className={`font-semibold tabular-nums ${roasColor(c.roas)}`}>
                            {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-xs text-white/40">Clicks</span>
                          <span className="tabular-nums text-white/50">{fmtNum(c.clicks)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-white/40">CPC</span>
                          <span className="tabular-nums text-white/50">
                            {c.cpc != null ? fmtUsd(c.cpc) : "--"}
                          </span>
                        </div>
                      </>
                    )}
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
                    {hasRevenue ? (
                      <div className="flex justify-between">
                        <span className="text-xs text-white/40">CPC</span>
                        <span className="tabular-nums text-white/50">
                          {c.cpc != null ? fmtUsd(c.cpc) : "--"}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
