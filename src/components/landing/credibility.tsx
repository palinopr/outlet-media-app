import { CheckCircle2, TriangleAlert } from "lucide-react";

const TRUST_NAMES = [
  "Rauw Alejandro",
  "Don Omar",
  "Vaqueros de Bayamón",
  "Beamina",
  "Ivy Queen",
  "Ticketera",
] as const;

const RESULT_CARDS = [
  {
    rank: "1",
    name: "Rauw Alejandro",
    headline: "Sold out global",
    stat: "+370,000 boletos",
  },
  {
    rank: "2",
    name: "Beamina (Ecom)",
    headline: "Escalamiento directo",
    stat: "ROAS 5.2x",
  },
  {
    rank: "3",
    name: "Vaqueros de Bayamón",
    headline: "Récord de ventas local",
    stat: "ROAS 13.6x",
  },
] as const;

const DIFFERENTIATORS = [
  "Mira el ROAS en vivo, no una vez al mes.",
  "Entiende el “por qué” detrás del rendimiento.",
  "Cero “Agency Blackout”. Control total.",
] as const;

export function LandingCredibility() {
  return (
    <section className="text-white">
      <div className="border-b border-white/8 px-4 py-5 sm:px-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
          Trust strip
        </p>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 text-center sm:grid-cols-3">
          {TRUST_NAMES.map((name) => (
            <div key={name} className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-white/8 px-4 py-5 sm:px-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
          “Agency blackout” problem
        </p>
        <div className="mt-4 rounded-[24px] border border-[#f59e0b]/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-5">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-[#f59e0b]/14 p-3 text-[#fbbf24]">
              <TriangleAlert className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                ¿Tu agencia te mantiene en la oscuridad?
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                Inviertes presupuesto, pero recibes reportes genéricos una vez al mes. No sabes
                qué funciona. Tu negocio merece claridad, no excusas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/8 px-4 py-5 sm:px-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
          Differentiator
        </p>
        <div className="mt-4 rounded-[24px] border border-[#61c0ff]/35 bg-[radial-gradient(circle_at_top,rgba(97,192,255,0.24),transparent_26%),linear-gradient(180deg,rgba(9,24,43,1)_0%,rgba(7,20,39,1)_100%)] p-5 shadow-[0_0_0_1px_rgba(97,192,255,0.08),0_28px_60px_-36px_rgba(97,192,255,0.45)]">
          <h3 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-[2.2rem]">
            Tu ventaja injusta: visibilidad radical.
          </h3>
          <p className="mt-4 text-center text-base leading-7 text-slate-200">
            La mayoría de las agencias esconden los datos. Nosotros te damos las llaves.
            Dashboards en tiempo real y reportes impulsados por IA para que veas exactamente qué
            creativo genera revenue.
          </p>
          <div className="mt-6 space-y-3">
            {DIFFERENTIATORS.map((item) => (
              <div key={item} className="flex gap-3 text-sm leading-6 text-slate-100 sm:text-base">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 pt-5 sm:px-5">
        <p className="pb-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
          Signature results
        </p>
        <div className="-mx-9 flex snap-x gap-3 overflow-x-auto px-9 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-12 sm:px-12">
          {RESULT_CARDS.map((card) => (
            <article
              key={card.name}
              className="min-w-[145px] snap-start rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.04)_100%)] p-4 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-w-[160px]"
            >
              <p className="text-4xl font-semibold tracking-tight text-slate-400">{card.rank}</p>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-white">
                {card.name}
              </p>
              <p className="mt-4 text-3xl font-bold leading-none tracking-tight text-white">{card.stat}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#8fd4ff]">
                {card.headline}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
