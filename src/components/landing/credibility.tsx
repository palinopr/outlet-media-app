import Image from "next/image";
import { CheckCircle2, TriangleAlert } from "lucide-react";

const TRUST_ITEMS = [
  {
    name: "Gallimbo Studios",
    src: "/images/landing/gallimbo-studios.png",
    imageClassName: "object-contain p-4",
  },
  {
    name: "9AM",
    src: "/images/landing/9am.png",
    imageClassName: "object-contain p-4",
  },
  {
    name: "Duars Live",
    src: "/images/landing/duars-live.png",
    imageClassName: "object-contain p-4",
  },
  {
    name: "Rauw Alejandro",
    src: "/images/landing/rauw-shauring.png",
    imageClassName: "object-cover",
  },
  {
    name: "Luis Miguel",
    src: "/images/landing/luis-miguel.png",
    imageClassName: "object-cover",
  },
  {
    name: "Young Miko",
    src: "/images/landing/young-miko-poster.png",
    imageClassName: "object-cover",
  },
] as const;

const RESULT_CARDS = [
  {
    name: "Rauw Alejandro",
    headline: "Sold out global",
    stat: "+370,000 boletos",
    src: "/images/landing/rauw-shauring.png",
    imageClassName: "object-cover",
  },
  {
    name: "Beamina (Ecom)",
    headline: "Escalamiento directo",
    stat: "ROAS 5.2x",
    monogram: "B",
  },
  {
    name: "Vaqueros de Bayamón",
    headline: "Récord de ventas local",
    stat: "ROAS 13.6x",
    monogram: "VB",
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
      <div className="border-b border-white/8 px-5 py-7 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Marcas, tours y operadores
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
          {TRUST_ITEMS.map((item) => (
            <article
              key={item.name}
              className="relative overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <div className="relative h-22 border-b border-white/6 bg-[#08111f] sm:h-24">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 33vw, 160px"
                  className={item.imageClassName}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,18,0.02)_20%,rgba(4,10,18,0.62)_100%)]" />
              </div>
              <p className="px-2 py-2 text-center text-[9px] font-semibold uppercase leading-4 tracking-[0.14em] text-slate-300 sm:text-[10px]">
                {item.name}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="border-b border-white/8 px-5 py-7 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/70">
          Si no ves la data en vivo, estás operando a ciegas.
        </p>
        <div className="mt-4 rounded-[24px] border border-[#f59e0b]/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-5 shadow-[0_22px_48px_-34px_rgba(245,158,11,0.42)]">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-[#f59e0b]/14 p-3 text-[#fbbf24]">
              <TriangleAlert className="size-5" />
            </div>
            <div className="max-w-[24rem]">
              <h2 className="text-[1.8rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2rem]">
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

      <div className="border-b border-white/8 px-5 py-7 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8fd4ff]">
          La diferencia
        </p>
        <div className="mt-4 rounded-[24px] border border-[#61c0ff]/35 bg-[radial-gradient(circle_at_top,rgba(97,192,255,0.24),transparent_26%),linear-gradient(180deg,rgba(9,24,43,1)_0%,rgba(7,20,39,1)_100%)] p-5 shadow-[0_0_0_1px_rgba(97,192,255,0.08),0_28px_60px_-36px_rgba(97,192,255,0.45)]">
          <h3 className="mx-auto max-w-[13ch] text-center text-[1.95rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.15rem]">
            Tu ventaja injusta: visibilidad radical.
          </h3>
          <p className="mx-auto mt-4 max-w-[19rem] text-center text-[15px] leading-6 text-slate-200 sm:max-w-[22rem] sm:text-base sm:leading-7">
            La mayoría de las agencias esconden los datos. Nosotros te damos las llaves.
            Dashboards en tiempo real y reportes impulsados por IA para que veas exactamente qué
            creativo genera revenue.
          </p>
          <div className="mt-6 space-y-3.5">
            {DIFFERENTIATORS.map((item) => (
              <div key={item} className="flex gap-2.5 text-[15px] leading-6 text-slate-100 sm:text-base">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-8 pt-7 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Resultados firmados por data
        </p>
        <p className="mx-auto mt-4 max-w-[19rem] text-center text-[14px] leading-6 text-slate-300 sm:max-w-[22rem] sm:text-[15px]">
          Casos donde el performance no se quedó en un deck. Se sintió en ventas, tickets y
          claridad operativa.
        </p>
        <div className="-mx-1 mt-6 flex snap-x gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {RESULT_CARDS.map((card) => (
            <article
              key={card.name}
              className="min-w-[198px] snap-start rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_100%)] p-4 shadow-[0_22px_44px_-26px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              <div className="relative h-28 overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,#101d32_0%,#0a1424_100%)]">
                {"src" in card ? (
                  <>
                    <Image
                      src={card.src}
                      alt={card.name}
                      fill
                      sizes="220px"
                      className={card.imageClassName}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,19,0.12)_10%,rgba(5,11,19,0.78)_100%)]" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_62%)]">
                    <span className="text-4xl font-semibold tracking-[-0.08em] text-white/90">
                      {card.monogram}
                    </span>
                  </div>
                )}
                <p className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#081220]/88 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                  Caso real
                </p>
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#8fd4ff]">
                {card.headline}
              </p>
              <p className="mt-2 text-[15px] font-semibold leading-5 text-white sm:text-[16px]">
                {card.name}
              </p>
              <p className="mt-3.5 text-[2rem] font-bold leading-none tracking-tight text-white">
                {card.stat}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
