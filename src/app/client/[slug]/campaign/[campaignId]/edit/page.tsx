import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleAlert, Settings2 } from "lucide-react";
import { requireInternalMetaManagementPage } from "@/features/client-portal/ownership";
import { getActiveAccountsForSlug } from "@/lib/client-token";
import { fmtUsd } from "@/lib/formatters";
import { supabaseAdmin } from "@/lib/supabase";
import { CampaignEditForm } from "./campaign-edit-form";

interface Props {
  params: Promise<{ campaignId: string; slug: string }>;
  searchParams: Promise<{ ad_account_id?: string; created?: string }>;
}

function centsToUsdString(value: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return (value / 100).toFixed(2);
}

export default async function ClientCampaignEditPage({
  params,
  searchParams,
}: Props) {
  const { slug, campaignId } = await params;
  const { ad_account_id: accountIdFromUrl, created } = await searchParams;
  await requireInternalMetaManagementPage(slug, `/client/${slug}/campaign/${campaignId}`);

  if (!supabaseAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href={`/client/${slug}/campaign/${campaignId}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:border-white/[0.16] hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to campaign detail
          </Link>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm text-amber-50">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
            <div>
              <p className="font-medium">Database connection is not configured.</p>
              <p className="mt-1 text-amber-50/80">
                Campaign edit controls require the Supabase admin connection to load campaign state.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [accounts, campaignRes] = await Promise.all([
    getActiveAccountsForSlug(slug),
    supabaseAdmin
      .from("meta_campaigns")
      .select("campaign_id, client_slug, daily_budget, name, status")
      .eq("campaign_id", campaignId)
      .eq("client_slug", slug)
      .single(),
  ]);

  const campaign = campaignRes.data;
  if (!campaign) notFound();

  const initialAccountId =
    (accountIdFromUrl &&
      accounts.find((account) => account.ad_account_id === accountIdFromUrl)?.ad_account_id) ||
    accounts[0]?.ad_account_id ||
    "";

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/client/${slug}/campaign/${campaignId}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:border-white/[0.16] hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to campaign detail
        </Link>
      </div>

      <section className="rounded-[32px] border border-white/[0.08] bg-white/[0.04] p-8 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.72)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Campaign Controls
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Edit {campaign.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Internal Outlet controls for campaign name, budget, and status changes when live Meta
              execution work needs a direct edit surface.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0b1020]/65 p-4 text-sm text-white/62">
            <div className="flex items-center gap-2 text-white/86">
              <Settings2 className="h-4 w-4 text-cyan-300" />
              Current daily budget
            </div>
            <p className="mt-2 text-lg font-semibold text-white">
              {typeof campaign.daily_budget === "number"
                ? fmtUsd(campaign.daily_budget / 100)
                : "--"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          {created === "1" ? (
            <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              Campaign created successfully. This page is the internal edit and status control surface.
            </div>
          ) : null}

          {accounts.length === 0 ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm text-amber-50">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                <div>
                  <p className="font-medium">No active Meta ad accounts are available.</p>
                  <p className="mt-1 text-amber-50/80">
                    Reconnect the Meta account from settings before updating this campaign.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <CampaignEditForm
              accounts={accounts}
              campaignId={campaignId}
              initialAccountId={initialAccountId}
              initialBudgetUsd={centsToUsdString(campaign.daily_budget)}
              initialName={campaign.name ?? ""}
              initialStatus={campaign.status === "ACTIVE" ? "ACTIVE" : "PAUSED"}
              slug={slug}
            />
          )}
        </div>
      </section>
    </div>
  );
}
