import Link from "next/link";
import { ArrowLeft, CircleAlert, Link2, Plus, ShieldCheck } from "lucide-react";
import {
  getConnectedAccountHealth,
  type ConnectedAccount,
} from "@/features/settings/connected-accounts";
import { requireInternalMetaManagementPage } from "@/features/client-portal/ownership";
import { fmtDate, slugToLabel } from "@/lib/formatters";
import { supabaseAdmin } from "@/lib/supabase";
import { DisconnectAccountButton } from "./disconnect-account-button";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ connected?: string; error?: string }>;
}

function bannerCopy(error?: string, connected?: string) {
  if (connected) {
    return {
      tone: "success" as const,
      text: `Meta account ${connected} connected successfully. Campaign tools are ready to use.`,
    };
  }

  switch (error) {
    case "no_ad_accounts":
      return {
        tone: "warning" as const,
        text: "Meta returned a valid login, but no ad accounts were available for this business user.",
      };
    case "oauth_failed":
      return {
        tone: "warning" as const,
        text: "The Meta login returned to Outlet, but the account could not be linked successfully.",
      };
    default:
      return null;
  }
}

export default async function ClientMetaSettingsPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { connected, error } = await searchParams;
  await requireInternalMetaManagementPage(slug);

  const databaseReady = !!supabaseAdmin;
  let data: ConnectedAccount[] | null = null;
  if (supabaseAdmin) {
    data = (
      await supabaseAdmin
        .from("client_accounts")
        .select(
          "id, client_slug, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at",
        )
        .eq("client_slug", slug)
        .order("connected_at", { ascending: false })
    ).data as ConnectedAccount[] | null;
  }

  const accounts = (data ?? []).filter(
    (account) => account.status === "active" || account.status === "expired" || account.status === "revoked",
  );
  const banner = bannerCopy(error, connected);
  const clientName = slugToLabel(slug);
  const businessLoginEnabled = !!process.env.META_FACEBOOK_LOGIN_CONFIG_ID;
  const pageIdConfigured = !!process.env.META_PAGE_ID;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href={`/client/${slug}/campaigns`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:border-white/[0.16] hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to campaigns
          </Link>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Meta Settings
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {clientName} account connections
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">
              Internal Outlet control for connecting the client&apos;s Meta ad accounts, confirming link
              health, and reaching the campaign management flow when live setup work is needed.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={`/api/meta/connect?slug=${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0b1020] transition hover:bg-white/90"
          >
            <Link2 className="h-4 w-4" />
            Connect Meta account
          </a>
          {accounts.length > 0 && pageIdConfigured ? (
            <Link
              href={`/client/${slug}/campaigns/new`}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/35 hover:bg-cyan-400/15"
            >
              <Plus className="h-4 w-4" />
              New campaign
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/35">
              <Plus className="h-4 w-4" />
              New campaign
            </span>
          )}
        </div>
      </div>

      {banner ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            banner.tone === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-50"
              : "border-amber-400/20 bg-amber-400/10 text-amber-50"
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      {!databaseReady ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
            <div>
              <p className="font-medium">Database connection is not configured.</p>
              <p className="mt-1 text-amber-50/80">
                Meta account storage and reviewer verification depend on a working Supabase admin connection.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!businessLoginEnabled ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
            <div>
              <p className="font-medium">Facebook Login for Business config is not set.</p>
              <p className="mt-1 text-amber-50/80">
                The app will fall back to classic OAuth until `META_FACEBOOK_LOGIN_CONFIG_ID` is configured.
                Meta recommends the business login flow for agency-style app review.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!pageIdConfigured ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
            <div>
              <p className="font-medium">Campaign creation is not fully configured.</p>
              <p className="mt-1 text-amber-50/80">
                `META_PAGE_ID` is required by the campaign creation flow so ads can be attached to a Facebook Page.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.7)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
                Connected accounts
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Live Meta business links
              </h2>
            </div>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-white/55">
              {accounts.length} linked
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {accounts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-6 text-sm text-white/55">
                {databaseReady
                  ? "No Meta ad accounts are linked to this client yet. Start with the connect button above, approve the requested permissions, and then choose the correct ad account."
                  : "Connect account history cannot load until the Supabase admin connection is available."}
              </div>
            ) : (
              accounts.map((account) => {
                const health = getConnectedAccountHealth(account);

                return (
                  <div
                    key={account.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0d1529]/70 p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {account.ad_account_name ?? account.ad_account_id}
                        </p>
                        <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-white/45">
                          {health.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/40">{account.ad_account_id}</p>
                      <p className="mt-3 text-sm leading-6 text-white/62">{health.detail}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                        <span>Connected {fmtDate(account.connected_at)}</span>
                        <span>Expires {fmtDate(account.token_expires_at)}</span>
                        <span>Last used {fmtDate(account.last_used_at ?? account.connected_at)}</span>
                      </div>
                    </div>
                    <DisconnectAccountButton
                      accountId={account.ad_account_id}
                      slug={slug}
                    />
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
                  Review readiness
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">What the reviewer needs</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-6 text-white/62">
              <p>1. Connect a Meta business account.</p>
              <p>2. Choose the correct ad account if multiple accounts are returned.</p>
              <p>3. Create a campaign from the custom campaign builder.</p>
              <p>4. Open the campaign detail view and move into the edit screen to change status or budget.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
              Current flow
            </p>
            <div className="mt-4 space-y-3 text-sm text-white/62">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="font-medium text-white/86">Auth mode</p>
                <p className="mt-1">
                  {businessLoginEnabled
                    ? "Facebook Login for Business configuration is enabled in this environment."
                    : "Classic OAuth fallback is active until the business login config is added."}
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="font-medium text-white/86">Campaign builder</p>
                <p className="mt-1">
                  {accounts.length > 0 && pageIdConfigured
                    ? "This client can reach the campaign creation flow right now."
                    : "Connect at least one active ad account and confirm Meta page configuration before launching campaigns."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
