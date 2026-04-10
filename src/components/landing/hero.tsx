const PROOF_PILLS = ["+370K boletos", "ROAS 13.6x local", "Culture & Data"] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/8 px-4 pb-6 pt-16 text-white sm:px-5 sm:pt-18">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(31,94,255,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_24%),linear-gradient(180deg,rgba(10,23,43,0.98)_0%,rgba(7,17,32,0.98)_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
          Resultados reales en Puerto Rico
        </p>
        <h1 className="mx-auto mt-4 max-w-[14ch] text-4xl font-bold tracking-[-0.05em] text-white sm:text-[3.25rem] sm:leading-[1.02]">
          Resultados reales en PR. No más “Agency Blackout”.
        </h1>
        <p className="mx-auto mt-4 max-w-[28rem] text-sm leading-7 text-slate-300 sm:text-base">
          Estrategia, creatividad y visibilidad total para marcas y operadores que exigen ROI.
          Deja de adivinar. Empieza a escalar con data en tiempo real.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {PROOF_PILLS.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-200"
            >
              {pill}
            </span>
          ))}
        </div>

        <a
          href="#audit-form"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#1f5eff] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] transition-colors hover:bg-[#184de0]"
        >
          Agenda tu auditoría
        </a>

        <div className="mt-3 text-sm text-slate-300">
          ¿Prefieres hablar ahora?{" "}
          <a
            href="tel:+13053225709"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
          >
            Llama directa.
          </a>
        </div>
      </div>
    </section>
  );
}
