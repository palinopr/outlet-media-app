import Link from "next/link";
import { ArrowLeft, CheckSquare, Link2 } from "lucide-react";
import { requireClientOwnerPage } from "@/features/client-portal/ownership";
import { slugToLabel } from "@/lib/formatters";
import { AccountPicker } from "./account-picker";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ accounts?: string }>;
}

interface MetaAccount {
  account_status?: number;
  id: string;
  name: string;
}

function parseAccounts(raw?: string): MetaAccount[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const account = entry as Record<string, unknown>;
      if (typeof account.id !== "string" || typeof account.name !== "string") return [];
      return [
        {
          account_status:
            typeof account.account_status === "number" ? account.account_status : undefined,
          id: account.id,
          name: account.name,
        },
      ];
    });
  } catch {
    return [];
  }
}

export default async function ClientMetaConnectPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { accounts: encodedAccounts } = await searchParams;
  await requireClientOwnerPage(slug);

  const accounts = parseAccounts(encodedAccounts);
  const clientName = slugToLabel(slug);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/client/${slug}/settings`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:border-white/[0.16] hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Meta settings
        </Link>
      </div>

      <section className="rounded-[32px] border border-white/[0.08] bg-white/[0.04] p-8 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.72)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Meta Account Selection
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Choose the ad account for {clientName}
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Meta returned more than one ad account for this business user. Select the account that
              should be linked to Outlet so the reviewer can continue into campaign creation and edit flows.
            </p>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/[0.08] bg-[#0b1020]/65 p-4 text-sm text-white/62">
            <div className="flex items-center gap-2 text-white/86">
              <Link2 className="h-4 w-4 text-cyan-300" />
              Connect business
            </div>
            <div className="flex items-center gap-2 text-white/86">
              <CheckSquare className="h-4 w-4 text-cyan-300" />
              Select ad account
            </div>
            <div className="flex items-center gap-2 text-white/86">
              <CheckSquare className="h-4 w-4 text-cyan-300" />
              Create and edit campaign
            </div>
          </div>
        </div>

        <div className="mt-8">
          {accounts.length === 0 ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm text-amber-50">
              No account list was available on this page. Restart the Meta connect flow from settings.
            </div>
          ) : (
            <AccountPicker accounts={accounts} slug={slug} />
          )}
        </div>
      </section>
    </div>
  );
}
