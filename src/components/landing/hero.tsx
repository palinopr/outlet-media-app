const PROOF_PILLS = ["+370K boletos", "ROAS 13.6x local", "Culture & Data"] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/8 px-5 pb-7 pt-8 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(31,94,255,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_24%),linear-gradient(180deg,rgba(8,19,36,1)_0%,rgba(6,15,28,1)_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-x-12 bottom-0 h-32 bg-[radial-gradient(circle,rgba(31,94,255,0.2),transparent_70%)] blur-2xl" />

      <div className="relative text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Hero</p>
        <h1 className="mx-auto mt-4 max-w-[12ch] text-[2.2rem] font-bold leading-[0.96] tracking-[-0.06em] text-white sm:text-[2.9rem]">
          Resultados reales en PR. No más “Agency Blackout”.
        </h1>
        <p className="mx-auto mt-4 max-w-[18rem] text-[13px] leading-6 text-slate-300 sm:max-w-[20rem] sm:text-[15px] sm:leading-7">
          Estrategia, creatividad y visibilidad total para marcas y operadores que exigen ROI.
          Deja de adivinar. Empieza a escalar con data en tiempo real.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {PROOF_PILLS.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-200"
            >
              <span className="size-1.5 rounded-full bg-[#fbbf24]" />
              {pill}
            </span>
          ))}
        </div>

        <a
          href="#audit-form"
          className="mt-6 inline-flex h-12 w-full max-w-[18rem] items-center justify-center rounded-full bg-[#1f5eff] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_38px_-18px_rgba(31,94,255,0.9)] transition-colors hover:bg-[#184de0]"
        >
          Agenda tu auditoría
        </a>

        <div className="mt-4 text-[13px] text-slate-300 sm:text-sm">
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
