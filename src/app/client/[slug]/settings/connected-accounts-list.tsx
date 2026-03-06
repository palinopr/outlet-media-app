"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  buildConnectedAccountsSummary,
  getConnectedAccountHealth,
  type ConnectedAccount,
} from "@/features/settings/connected-accounts";

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

function formatDate(value: string | null) {
  if (!value) return "Not yet";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ConnectedAccountsList({
  accounts,
  canManage,
  slug,
  connectUrl,
}: {
  accounts: ConnectedAccount[];
  canManage: boolean;
  slug: string;
  connectUrl: string;
}) {
  const router = useRouter();
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const summary = buildConnectedAccountsSummary(accounts);

  async function handleDisconnect(adAccountId: string) {
    setDisconnecting(adAccountId);
    try {
      const res = await fetch("/api/meta/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad_account_id: adAccountId, slug }),
      });
      if (!res.ok) throw new Error("Disconnect failed");
      toast.success("Ad account disconnected");
      router.refresh();
    } catch {
      toast.error("Failed to disconnect account");
    } finally {
      setDisconnecting(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Connected Ad Accounts</h2>
          <p className="mt-1 text-sm text-white/50">
            Watch connection health so campaign work does not stall when a Meta link goes stale or expires.
          </p>
        </div>
        {canManage ? (
          <a href={connectUrl}>
            <Button>Connect Ad Account</Button>
          </a>
        ) : null}
      </div>

      {accounts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
              Client
            </p>
            <p className="mt-1 text-sm font-medium text-white/85">{slug}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
              Healthy
            </p>
            <p className="mt-1 text-sm font-medium text-emerald-300">{summary.healthyCount}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
              Expiring soon
            </p>
            <p className="mt-1 text-sm font-medium text-amber-300">{summary.expiringSoonCount}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
              Needs attention
            </p>
            <p className="mt-1 text-sm font-medium text-red-300">{summary.attentionCount}</p>
          </div>
        </div>
      ) : null}

      {accounts.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">No ad accounts connected yet.</p>
          {canManage ? (
            <a href={connectUrl}>
              <Button className="mt-4">Connect Your First Ad Account</Button>
            </a>
          ) : (
            <p className="mt-4 text-sm text-white/45">
              Ask a team owner to connect the first Meta ad account for {slug}.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => {
            const health = getConnectedAccountHealth(account);

            return (
              <div
                key={account.id}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-white/90">
                      {account.ad_account_name ?? account.ad_account_id}
                    </p>
                    <p className="text-sm text-white/45">
                      {account.ad_account_id}
                    </p>
                    <p className="mt-2 text-xs text-white/50">
                      Connected {formatDate(account.connected_at)} • Last used {formatDate(account.last_used_at)}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      Token expires {formatDate(account.token_expires_at)}
                    </p>
                    <p className="mt-2 text-sm text-white/60">{health.detail}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge
                      variant={
                        account.status === "active" ? "default" : "destructive"
                      }
                    >
                      {account.status}
                    </Badge>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneForHealth(health.key)}`}
                    >
                      {health.label}
                    </span>
                    {canManage && account.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={disconnecting === account.ad_account_id}
                        onClick={() => handleDisconnect(account.ad_account_id)}
                      >
                        {disconnecting === account.ad_account_id
                          ? "Disconnecting..."
                          : "Disconnect"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!canManage ? (
        <p className="text-xs text-white/35">
          Only team owners can connect or disconnect Meta ad accounts for this client portal.
        </p>
      ) : null}
    </div>
  );
}
