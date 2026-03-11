"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface MetaAccount {
  account_status?: number;
  id: string;
  name: string;
}

interface Props {
  accounts: MetaAccount[];
  slug: string;
}

export function AccountPicker({ accounts, slug }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingAccountId, setPendingAccountId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function connectAccount(adAccountId: string) {
    startTransition(() => {
      void (async () => {
        setError(null);
        setPendingAccountId(adAccountId);

        const response = await fetch("/api/meta/connect/finalize", {
          body: JSON.stringify({ ad_account_id: adAccountId, slug }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          setError(body?.error ?? "The account could not be linked.");
          setPendingAccountId(null);
          return;
        }

        router.push(`/client/${slug}/settings?connected=${encodeURIComponent(adAccountId)}`);
      })();
    });
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => {
        const selected = pendingAccountId === account.id && isPending;
        return (
          <div
            key={account.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0d1529]/70 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{account.name}</p>
              <p className="mt-1 text-xs text-white/40">{account.id}</p>
              {typeof account.account_status === "number" ? (
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">
                  Meta status {account.account_status}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => connectAccount(account.id)}
              disabled={isPending}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0b1020] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {selected ? "Connecting..." : "Use this ad account"}
            </button>
          </div>
        );
      })}

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
    </div>
  );
}
