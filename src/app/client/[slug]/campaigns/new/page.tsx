import Link from "next/link";
import { ArrowLeft, CircleAlert, Rocket } from "lucide-react";
import { requireClientOwnerPage } from "@/features/client-portal/ownership";
import { getActiveAccountsForSlug } from "@/lib/client-token";
import { slugToLabel } from "@/lib/formatters";
import { CampaignCreateForm } from "./campaign-create-form";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientCampaignCreatePage({ params }: Props) {
  const { slug } = await params;
  await requireClientOwnerPage(slug);

  const accounts = await getActiveAccountsForSlug(slug);
  const clientName = slugToLabel(slug);
  const pageIdConfigured = !!process.env.META_PAGE_ID;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/client/${slug}/campaigns`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:border-white/[0.16] hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to campaigns
        </Link>
      </div>

      <section className="rounded-[32px] border border-white/[0.08] bg-white/[0.04] p-8 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.72)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Campaign Builder
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Create a Meta campaign for {clientName}
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/62">
              This owner-only flow creates a campaign, ad set, and ad through Outlet&apos;s custom UI so
              Meta reviewers can verify campaign management directly in the product.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0b1020]/65 p-4 text-sm text-white/62">
            <div className="flex items-center gap-2 text-white/86">
              <Rocket className="h-4 w-4 text-cyan-300" />
              Campaign launches paused by default
            </div>
            <p className="mt-2 max-w-xs text-white/55">
              The route creates campaign objects in Meta and leaves them paused so the reviewer can still
              inspect and update them safely.
            </p>
          </div>
        </div>

        <div className="mt-8">
          {accounts.length === 0 ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm text-amber-50">
              No connected Meta ad accounts are available for this client yet. Connect one from{" "}
              <Link href={`/client/${slug}/settings`} className="font-semibold underline underline-offset-4">
                Meta settings
              </Link>
              .
            </div>
          ) : !pageIdConfigured ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm text-amber-50">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                <div>
                  <p className="font-medium">`META_PAGE_ID` is required for campaign creation.</p>
                  <p className="mt-1 text-amber-50/80">
                    Configure the Facebook Page ID used for ad creative objects, then return to this page.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <CampaignCreateForm accounts={accounts} slug={slug} />
          )}
        </div>
      </section>
    </div>
  );
}
