const PROOF_PILLS = ["+370K boletos", "ROAS 13.6x local", "Culture & Data"] as const;

export function LandingHero() {
  return (
    <section className="overflow-hidden rounded-[32px] border border-white/70 bg-[#071427] px-6 py-8 text-white shadow-[0_36px_90px_-40px_rgba(15,23,42,0.55)] sm:px-8 sm:py-10">
      <div className="absolute" />
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(31,94,255,0.24),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(80,22,136,0.18),transparent_22%),linear-gradient(180deg,rgba(8,18,34,0.98)_0%,rgba(5,14,27,0.98)_100%)] px-6 py-8 sm:px-8 sm:py-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
            Resultados reales en Puerto Rico
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl lg:text-[3.65rem] lg:leading-[1.02]">
            Resultados reales en PR. No más “Agency Blackout”.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Estrategia, creatividad y visibilidad total para marcas y operadores que exigen ROI.
            Deja de adivinar. Empieza a escalar con data en tiempo real.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {PROOF_PILLS.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-slate-200"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#audit-form"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f5eff] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] transition-colors hover:bg-[#184de0]"
            >
              Agenda tu auditoría
            </a>
            <a
              href="tel:+13053225709"
              className="text-sm text-slate-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              ¿Prefieres hablar ahora? Llama directa.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
