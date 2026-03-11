"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";

interface ConnectedAccountOption {
  ad_account_id: string;
  ad_account_name: string | null;
}

interface Props {
  accounts: ConnectedAccountOption[];
  campaignId: string;
  initialAccountId: string;
  initialBudgetUsd: string;
  initialName: string;
  initialStatus: "ACTIVE" | "PAUSED";
  slug: string;
}

export function CampaignEditForm({
  accounts,
  campaignId,
  initialAccountId,
  initialBudgetUsd,
  initialName,
  initialStatus,
  slug,
}: Props) {
  const router = useRouter();
  const [adAccountId, setAdAccountId] = useState(initialAccountId);
  const [name, setName] = useState(initialName);
  const [dailyBudgetUsd, setDailyBudgetUsd] = useState(initialBudgetUsd);
  const [status, setStatus] = useState<"ACTIVE" | "PAUSED">(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function centsFromUsd(raw: string) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return NaN;
    return Math.round(parsed * 100);
  }

  function saveDetails() {
    startTransition(() => {
      void (async () => {
        setError(null);
        setNotice(null);

        const dailyBudget = centsFromUsd(dailyBudgetUsd);
        if (!adAccountId) {
          setError("Choose an ad account before updating the campaign.");
          return;
        }
        if (!name.trim()) {
          setError("Campaign name is required.");
          return;
        }
        if (!Number.isFinite(dailyBudget) || dailyBudget < 100) {
          setError("Daily budget must be at least $1.00.");
          return;
        }

        const response = await fetch(`/api/meta/campaigns/${campaignId}`, {
          body: JSON.stringify({
            ad_account_id: adAccountId,
            client_slug: slug,
            daily_budget: dailyBudget,
            name: name.trim(),
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          setError(body?.error ?? "Campaign details could not be updated.");
          return;
        }

        setNotice("Campaign details updated.");
        router.refresh();
      })();
    });
  }

  function toggleStatus() {
    const nextStatus = status === "ACTIVE" ? "PAUSED" : "ACTIVE";

    startTransition(() => {
      void (async () => {
        setError(null);
        setNotice(null);

        if (!adAccountId) {
          setError("Choose an ad account before changing campaign status.");
          return;
        }

        const response = await fetch(`/api/meta/campaigns/${campaignId}/status`, {
          body: JSON.stringify({
            ad_account_id: adAccountId,
            client_slug: slug,
            status: nextStatus,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          setError(body?.error ?? "Campaign status could not be updated.");
          return;
        }

        setStatus(nextStatus);
        setNotice(`Campaign is now ${nextStatus.toLowerCase()}.`);
        router.refresh();
      })();
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Ad account">
          <select
            value={adAccountId}
            onChange={(event) => setAdAccountId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          >
            {accounts.map((account) => (
              <option key={account.ad_account_id} value={account.ad_account_id}>
                {account.ad_account_name ?? account.ad_account_id}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Current status">
          <div className="flex h-[52px] items-center rounded-2xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white">
            {status}
          </div>
        </Field>

        <Field label="Campaign name">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          />
        </Field>

        <Field label="Daily budget (USD)">
          <input
            value={dailyBudgetUsd}
            onChange={(event) => setDailyBudgetUsd(event.target.value)}
            inputMode="decimal"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          />
        </Field>
      </div>

      {notice ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveDetails}
          disabled={isPending}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0b1020] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save details"}
        </button>
        <button
          type="button"
          onClick={toggleStatus}
          disabled={isPending}
          className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/35 hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "ACTIVE" ? "Pause campaign" : "Activate campaign"}
        </button>
      </div>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}
