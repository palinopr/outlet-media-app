import Link from "next/link";
import { AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";

const ERROR_COPY: Record<string, { detail: string; title: string }> = {
  access_denied: {
    detail:
      "Meta returned an access denied response before the business assets could be shared with Outlet.",
    title: "Permission was denied",
  },
  invalid_state: {
    detail:
      "The security state for this login attempt could not be verified. Start the connect flow again from the app.",
    title: "Secure connect check failed",
  },
  missing_params: {
    detail:
      "Meta redirected back without the code or state the app needs to finish account linking.",
    title: "Meta login did not finish cleanly",
  },
  not_configured: {
    detail:
      "The Meta app configuration is incomplete on this environment. Add the required Meta app secrets and try again.",
    title: "Meta is not configured",
  },
  oauth_failed: {
    detail:
      "Meta returned to the app, but the account could not be linked successfully. Try the connect flow again.",
    title: "Account linking failed",
  },
};

interface Props {
  searchParams: Promise<{ code?: string; error?: string }>;
}

export default async function ConnectErrorPage({ searchParams }: Props) {
  const { code, error } = await searchParams;
  const key = (code ?? error ?? "").toLowerCase();
  const copy = ERROR_COPY[key] ?? {
    detail:
      "The app could not complete the Meta connect flow. Return to the client portal and try again.",
    title: "Meta connect error",
  };
  const detail =
    error && error.toLowerCase() !== key ? error : copy.detail;

  return (
    <main className="min-h-screen bg-[#0a0f1b] px-6 py-16 text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
          <ShieldCheck className="h-3.5 w-3.5" />
          Meta Connect Review
        </div>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.75)]">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3">
              <AlertTriangle className="h-6 w-6 text-amber-300" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                  Connect Flow Status
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  {copy.title}
                </h1>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/68">
                {detail}
              </p>
              {code ? (
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Error code: {code}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0a0f1b] transition hover:bg-white/90"
            >
              Return to sign in
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-white/72 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
