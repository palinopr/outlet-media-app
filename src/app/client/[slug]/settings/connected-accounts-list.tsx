"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ConnectedAccount } from "./data";

export function ConnectedAccountsList({
  accounts,
  slug,
  connectUrl,
}: {
  accounts: ConnectedAccount[];
  slug: string;
  connectUrl: string;
}) {
  const router = useRouter();
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  async function handleDisconnect(adAccountId: string) {
    setDisconnecting(adAccountId);
    try {
      const res = await fetch("/api/meta/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad_account_id: adAccountId }),
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
        <h2 className="text-lg font-medium">Connected Ad Accounts</h2>
        <a href={connectUrl}>
          <Button>Connect Ad Account</Button>
        </a>
      </div>

      {accounts.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">No ad accounts connected yet.</p>
          <a href={connectUrl}>
            <Button className="mt-4">Connect Your First Ad Account</Button>
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="glass-card p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {account.ad_account_name ?? account.ad_account_id}
                </p>
                <p className="text-sm text-muted-foreground">
                  {account.ad_account_id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    account.status === "active" ? "default" : "destructive"
                  }
                >
                  {account.status}
                </Badge>
                {account.status === "active" && (
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
          ))}
        </div>
      )}
    </div>
  );
}
