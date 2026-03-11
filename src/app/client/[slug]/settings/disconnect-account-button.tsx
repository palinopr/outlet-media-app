"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  accountId: string;
  slug: string;
}

export function DisconnectAccountButton({ accountId, slug }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDisconnect() {
    const confirmed = window.confirm(
      "Disconnect this Meta ad account? This will stop campaign actions until it is reconnected.",
    );
    if (!confirmed) return;

    startTransition(() => {
      void (async () => {
        setError(null);
        const response = await fetch("/api/meta/disconnect", {
          body: JSON.stringify({ ad_account_id: accountId, slug }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          setError(body?.error ?? "Failed to disconnect this Meta account.");
          return;
        }

        router.refresh();
      })();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDisconnect}
        disabled={isPending}
        className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 transition hover:border-red-400/35 hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Disconnecting..." : "Disconnect"}
      </button>
      {error ? <p className="max-w-xs text-right text-xs text-red-200">{error}</p> : null}
    </div>
  );
}
