import { CheckCircle2, TriangleAlert } from "lucide-react";

const TRUST_NAMES = [
  "Rauw\nAlejandro",
  "Don\nOmar",
  "Vaqueros\nBayamón",
  "Beamina",
  "Ivy\nQueen",
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
      <div className="border-b border-white/8 px-5 py-5 sm:px-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Trust strip
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {TRUST_NAMES.map((name) => (
            <div
              key={name}
              className="rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-white whitespace-pre-line"
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-white/8 px-5 py-5 sm:px-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          “Agency blackout” problem
        </p>
        <div className="mt-4 rounded-[24px] border border-[#f59e0b]/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-5 shadow-[0_22px_48px_-34px_rgba(245,158,11,0.42)]">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-[#f59e0b]/14 p-3 text-[#fbbf24]">
              <TriangleAlert className="size-5" />
            </div>
            <div>
              <h2 className="text-[1.9rem] font-semibold tracking-tight text-white sm:text-[2rem]">
                ¿Tu agencia te mantiene en la oscuridad?
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
                Inviertes presupuesto, pero recibes reportes genéricos una vez al mes. No sabes
                qué funciona. Tu negocio merece claridad, no excusas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/8 px-5 py-5 sm:px-6">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Differentiator
        </p>
        <div className="mt-4 rounded-[24px] border border-[#61c0ff]/35 bg-[radial-gradient(circle_at_top,rgba(97,192,255,0.24),transparent_26%),linear-gradient(180deg,rgba(9,24,43,1)_0%,rgba(7,20,39,1)_100%)] p-5 shadow-[0_0_0_1px_rgba(97,192,255,0.08),0_28px_60px_-36px_rgba(97,192,255,0.45)]">
          <h3 className="text-center text-[2rem] font-semibold tracking-tight text-white sm:text-[2.2rem]">
            Tu ventaja injusta: visibilidad radical.
          </h3>
          <p className="mt-4 text-center text-[15px] leading-6 text-slate-200 sm:text-base sm:leading-7">
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

      <div className="px-5 pb-7 pt-5 sm:px-6">
        <p className="pb-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Signature results
        </p>
        <div className="-mx-3 flex snap-x items-end gap-2 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {RESULT_CARDS.map((card, index) => (
            <article
              key={card.name}
              className={`min-w-[110px] snap-start rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.05)_100%)] p-4 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] ${index === 0 ? "-rotate-2" : index === 1 ? "translate-y-6" : "rotate-2"}`}
            >
              <p className="text-4xl font-semibold tracking-tight text-slate-400">{card.rank}</p>
              <p className="mt-4 text-[13px] font-semibold uppercase leading-4 tracking-[0.08em] text-white">
                {card.name}
              </p>
              <p className="mt-4 text-[1.65rem] font-bold leading-none tracking-tight text-white">
                {card.stat}
              </p>
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
