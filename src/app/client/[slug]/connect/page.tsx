"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdAccount {
  id: string;
  name: string;
  account_status: number;
}

export default function ConnectPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  let accounts: AdAccount[] = [];
  try {
    accounts = JSON.parse(searchParams.get("accounts") ?? "[]");
  } catch {
    accounts = [];
  }

  async function handleSelect(accountId: string) {
    setSelected(accountId);
    setSubmitting(true);
    try {
      const res = await fetch("/api/meta/connect/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad_account_id: accountId,
          slug,
        }),
      });
      if (!res.ok) throw new Error("Failed to connect");
      toast.success("Ad account connected");
      router.push(`/client/${slug}/settings?connected=${accountId}`);
    } catch {
      toast.error("Failed to connect account");
      setSubmitting(false);
      setSelected(null);
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="space-y-4 text-center py-12">
        <h1 className="text-2xl font-semibold">No Ad Accounts Found</h1>
        <p className="text-muted-foreground">
          We couldn&apos;t find any ad accounts on your Facebook profile.
        </p>
        <Button onClick={() => router.push(`/client/${slug}/settings`)}>
          Back to Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Select an Ad Account</h1>
        <p className="text-muted-foreground mt-1">
          Choose which ad account to connect to your portal.
        </p>
      </div>
      <div className="space-y-3">
        {accounts.map((account) => (
          <button
            key={account.id}
            onClick={() => handleSelect(account.id)}
            disabled={submitting}
            className={`glass-card p-4 w-full text-left transition-colors hover:border-primary/50 ${
              selected === account.id ? "border-primary" : ""
            }`}
          >
            <p className="font-medium">{account.name}</p>
            <p className="text-sm text-muted-foreground">{account.id}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
