import Image from "next/image";

const PROOF_PILLS = [
  "Don Omar BCN 30,052 boletos",
  "KYBBA 2.8x ROAS",
  "Portal + agent",
] as const;

const HERO_STATS = [
  { value: "30,052", label: "Don Omar BCN tickets" },
  { value: "2.8x", label: "KYBBA portal ROAS" },
  { value: "8.73x", label: "Alofoke surge" },
] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/8 px-5 pb-7 pt-7 text-white sm:px-6 sm:pb-8 sm:pt-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(31,94,255,0.32),transparent_30%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_24%),linear-gradient(180deg,rgba(8,19,36,1)_0%,rgba(6,15,28,1)_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-x-10 -top-8 h-28 bg-[radial-gradient(circle,rgba(59,130,246,0.28),transparent_70%)] blur-3xl" />
      <div className="absolute inset-x-12 bottom-0 h-32 bg-[radial-gradient(circle,rgba(31,94,255,0.24),transparent_70%)] blur-2xl" />

      <div className="relative text-center">
        <Image
          src="/images/brand/logotype-horizontal-white.png"
          alt="Outlet Media"
          width={170}
          height={28}
          className="mx-auto h-auto w-[150px] sm:w-[170px]"
          priority
        />
        <p className="mx-auto mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          Puerto Rico performance operators
        </p>
        <h1 className="mx-auto mt-4 max-w-[12ch] text-[2.15rem] font-bold leading-[0.92] tracking-[-0.06em] text-white sm:text-[3rem]">
          Resultados reales. Visibilidad real. Sin agency blackout.
        </h1>
        <p className="mx-auto mt-3.5 max-w-[19rem] text-[14px] leading-6 text-slate-300 sm:max-w-[22rem] sm:text-[15px] sm:leading-7">
          Paid media, reporting live y un portal con agente que responde sobre campanas, eventos,
          creativos y proximos pasos usando la misma data que mueve la operacion.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {PROOF_PILLS.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-200 sm:text-[10px]"
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

        <div className="mt-3 text-[13px] text-slate-300 sm:text-sm">
          ¿Prefieres hablar ahora?{" "}
          <a
            href="tel:+13053225709"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
          >
            Llama directa.
          </a>
        </div>

        <div className="mx-auto mt-6 grid max-w-[20.5rem] grid-cols-3 gap-2.5 text-left sm:max-w-[22.5rem]">
          {HERO_STATS.map((item) => (
            <div
              key={item.label}
              className="rounded-[18px] border border-white/8 bg-white/[0.04] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <p className="text-[15px] font-semibold leading-5 text-white sm:text-base">
                {item.value}
              </p>
              <p className="mt-1 text-[10px] uppercase leading-4 tracking-[0.16em] text-slate-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
