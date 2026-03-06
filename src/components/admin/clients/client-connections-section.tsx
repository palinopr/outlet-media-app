"use client";

import { Link2, TriangleAlert } from "lucide-react";
import {
  buildConnectedAccountsSummary,
  getConnectedAccountHealth,
  type ConnectedAccount,
} from "@/features/settings/connected-accounts";
import { fmtDate } from "@/lib/formatters";

interface ClientConnectionsSectionProps {
  accounts: ConnectedAccount[];
}

function toneForHealth(key: ReturnType<typeof getConnectedAccountHealth>["key"]) {
  switch (key) {
    case "healthy":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "expiring_soon":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "stale":
      return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    case "needs_reconnection":
      return "border-red-500/20 bg-red-500/10 text-red-300";
  }
}

export function ClientConnectionsSection({
  accounts,
}: ClientConnectionsSectionProps) {
  const summary = buildConnectedAccountsSummary(accounts);
  const attentionAccounts = accounts
    .map((account) => ({
      account,
      health: getConnectedAccountHealth(account),
    }))
    .filter(({ health }) => health.key !== "healthy");

  return (
    <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-[#787774]">Meta connections</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
          Connection health
        </h2>
        <p className="mt-1 text-sm text-[#9b9a97]">
          Keep ad account links healthy so campaign work does not silently stall for this client.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9b9a97]">Connected accounts</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#2f2f2f]">{summary.totalCount}</p>
          <p className="mt-1 text-xs text-[#9b9a97]">Meta ad accounts linked to this client.</p>
        </div>
        <div className="rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9b9a97]">Healthy</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">{summary.healthyCount}</p>
          <p className="mt-1 text-xs text-[#9b9a97]">Ready for campaign work.</p>
        </div>
        <div className="rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9b9a97]">Expiring soon</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600">{summary.expiringSoonCount}</p>
          <p className="mt-1 text-xs text-[#9b9a97]">Reconnect before the token expires.</p>
        </div>
        <div className="rounded-2xl border border-[#ece8df] bg-[#fcfbf8] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9b9a97]">Needs attention</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#c45500]">{summary.attentionCount}</p>
          <p className="mt-1 text-xs text-[#9b9a97]">Stale, expiring, or disconnected links.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {accounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
            No Meta ad accounts are connected to this client yet.
          </div>
        ) : attentionAccounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
            All connected Meta ad accounts look healthy right now.
          </div>
        ) : (
          attentionAccounts.map(({ account, health }) => (
            <div
              key={account.id}
              className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[#0f7b6c]" />
                    <p className="truncate text-sm font-medium text-[#2f2f2f]">
                      {account.ad_account_name ?? account.ad_account_id}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-[#9b9a97]">{account.ad_account_id}</p>
                  <p className="mt-2 text-sm text-[#6f6a63]">{health.detail}</p>
                  <p className="mt-2 text-xs text-[#9b9a97]">
                    Token expires {fmtDate(account.token_expires_at)} • Last used {fmtDate(account.last_used_at ?? account.connected_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneForHealth(health.key)}`}>
                    {health.label}
                  </span>
                  <TriangleAlert className="h-4 w-4 text-amber-500" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
