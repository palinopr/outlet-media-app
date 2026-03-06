"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Link2 } from "lucide-react";
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
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-violet-500/[0.08] to-transparent blur-3xl" />

          <div className="relative flex flex-col gap-3">
            <button
              type="button"
              onClick={() => router.push(`/client/${slug}/settings`)}
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to settings
            </button>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
              <Link2 className="h-4 w-4 text-cyan-400/70" />
              Meta Connect
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                No ad accounts found
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-white/60">
                We couldn&apos;t find any Meta ad accounts on this Facebook profile. Try another Meta login or return to settings.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 text-center">
          <p className="text-sm text-white/60">
            The account you connected does not currently have accessible ad accounts.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push(`/client/${slug}/settings`)}
          >
            Back to Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-violet-500/[0.08] to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push(`/client/${slug}/settings`)}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to settings
          </button>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <Link2 className="h-4 w-4 text-cyan-400/70" />
            Meta Connect
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Choose an ad account
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/60">
              Select the Meta ad account you want to link to this client portal. You can disconnect it later from settings.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60">
            <BadgeCheck className="h-3.5 w-3.5" />
            {accounts.length} account{accounts.length === 1 ? "" : "s"} available
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-3">
        {accounts.map((account) => (
          <button
            key={account.id}
            onClick={() => handleSelect(account.id)}
            disabled={submitting}
            className={`glass-card w-full p-4 text-left transition-colors hover:border-cyan-400/40 ${
              selected === account.id ? "border-cyan-400/60" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white/90">
                  {account.name}
                </p>
                <p className="mt-1 text-sm text-white/50">{account.id}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/60">
                Status {account.account_status}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="glass-card mx-auto max-w-2xl p-4">
        <p className="text-sm text-white/60">
          When you select an account, we store the secure Meta connection for this client portal and return you to settings.
        </p>
      </div>
    </div>
  );
}
