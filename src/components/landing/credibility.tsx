import campaignDesktop from "../../../docs/screenshots/campaign-desktop.png";
import campaignMobileViewport from "../../../docs/screenshots/campaign-mobile-viewport.png";
import Image from "next/image";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { LandingSampleMetricCard } from "@/components/landing/sample-metric-card";

const FEATURED_VISUALS = [
  {
    name: "Rauw Alejandro",
    src: "/images/landing/rauw-shauring.png",
    imageClassName: "object-cover object-left",
    layoutClassName: "col-span-2 sm:col-span-4",
    label: "Tour creative",
    motionClassName: "landing-float-soft",
  },
  {
    name: "Young Miko",
    src: "/images/landing/young-miko-poster.png",
    imageClassName: "object-cover object-top",
    layoutClassName: "sm:col-span-2 sm:row-span-2",
    label: "Poster creative",
    motionClassName: "landing-float-delayed",
  },
  {
    name: "Luis Miguel",
    src: "/images/landing/luis-miguel.png",
    imageClassName: "object-cover object-center",
    layoutClassName: "sm:col-span-2",
    label: "Artist campaign",
    motionClassName: "landing-card-hover",
  },
  {
    name: "Gilberto Santa Rosa",
    src: "/images/landing/gilberto-santa-rosa.png",
    imageClassName: "object-cover object-center",
    layoutClassName: "sm:col-span-2",
    label: "Event promo",
    motionClassName: "landing-card-hover",
  },
] as const;

const PARTNER_ITEMS = [
  {
    name: "Gallimbo Studios",
    src: "/images/landing/gallimbo-studios.png",
  },
  {
    name: "9AM",
    src: "/images/landing/9am.png",
  },
  {
    name: "Duars Live",
    src: "/images/landing/duars-live.png",
  },
] as const;

const DIFFERENTIATORS = [
  "Mira el ROAS en vivo, no una vez al mes.",
  "Entiende el por que detras del rendimiento.",
  'Cero "Agency Blackout". Control total.',
] as const;

const QUICK_WINS = [
  {
    name: "Launch week",
    stat: "4.2x",
    detail: "sample blended ROAS",
    delta: "+16%",
    accent: "blue",
    trendPoints: "6,27 20,23 34,22 48,18 62,14 78,10 94,8",
  },
  {
    name: "Retargeting",
    stat: "$18.4K",
    detail: "sample tracked revenue",
    delta: "+12%",
    accent: "emerald",
    trendPoints: "6,28 20,24 34,22 48,19 62,16 78,11 94,7",
  },
  {
    name: "Creative A",
    stat: "3.7x",
    detail: "sample creative ROAS",
    delta: "+9%",
    accent: "violet",
    trendPoints: "6,27 20,24 34,20 48,21 62,17 78,13 94,10",
  },
  {
    name: "Offer shift",
    stat: "+26%",
    detail: "sample CTR lift",
    delta: "+6%",
    accent: "amber",
    trendPoints: "6,29 20,27 34,24 48,19 62,18 78,12 94,9",
  },
] as const;

const PORTAL_METRICS = [
  {
    value: "3.9x",
    label: "sample roas",
    caption: "portal preview",
    delta: "+11%",
    accent: "blue",
    trendPoints: "6,26 20,24 34,20 48,18 62,14 78,10 94,8",
  },
  {
    value: "$48.2K",
    label: "sample revenue",
    caption: "tracked gross",
    delta: "+22%",
    accent: "emerald",
    trendPoints: "6,28 20,25 34,21 48,18 62,15 78,10 94,6",
  },
  {
    value: "118K",
    label: "sample clicks",
    caption: "7d volume",
    delta: "+8%",
    accent: "violet",
    trendPoints: "6,27 20,24 34,20 48,21 62,17 78,13 94,11",
  },
  {
    value: "2.4%",
    label: "sample ctr",
    caption: "quality signal",
    delta: "+5%",
    accent: "amber",
    trendPoints: "6,29 20,27 34,24 48,19 62,18 78,12 94,9",
  },
] as const;

const TOUR_METRICS = [
  {
    value: "37.4K",
    label: "sample actions",
    caption: "onsale week",
    delta: "+19%",
    accent: "blue",
    trendPoints: "6,26 20,23 34,22 48,19 62,16 78,10 94,7",
  },
  {
    value: "$182K",
    label: "sample gross",
    caption: "tracked sales",
    delta: "+14%",
    accent: "emerald",
    trendPoints: "6,28 20,26 34,23 48,18 62,16 78,11 94,8",
  },
  {
    value: "4.6x",
    label: "sample blend",
    caption: "paid efficiency",
    delta: "+10%",
    accent: "violet",
    trendPoints: "6,27 20,25 34,22 48,20 62,16 78,12 94,9",
  },
  {
    value: "18.2%",
    label: "sample conversion",
    caption: "demand signal",
    delta: "+7%",
    accent: "amber",
    trendPoints: "6,29 20,28 34,25 48,20 62,18 78,13 94,10",
  },
] as const;

export function LandingCredibility() {
  return (
    <section className="text-white">
      <div className="border-b border-white/8 px-5 py-7 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Marcas, tours y operadores
        </p>

        <div className="mt-5 grid auto-rows-[8.75rem] grid-cols-2 gap-3 sm:grid-cols-6 sm:auto-rows-[7.75rem]">
          {FEATURED_VISUALS.map((item) => (
            <article
              key={item.name}
              className={`relative overflow-hidden rounded-[20px] border border-white/8 bg-[#08111f] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${item.layoutClassName} ${item.motionClassName}`}
            >
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, 260px"
                className={item.imageClassName}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,18,0.08)_12%,rgba(4,10,18,0.68)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8fd4ff]">
                  {item.label}
                </p>
                <p className="mt-1 text-[13px] font-semibold leading-4 text-white sm:text-[14px]">
                  {item.name}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {PARTNER_ITEMS.map((item) => (
            <article
              key={item.name}
              className="landing-card-hover relative flex h-20 items-center justify-center overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 33vw, 160px"
                className="object-contain p-4"
              />
            </article>
          ))}
        </div>
      </div>

      <div className="border-b border-white/8 px-5 py-7 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/70">
          Si no ves la data en vivo, estas operando a ciegas.
        </p>
        <div className="mt-4 rounded-[24px] border border-[#f59e0b]/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-5 shadow-[0_22px_48px_-34px_rgba(245,158,11,0.42)]">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-[#f59e0b]/14 p-3 text-[#fbbf24]">
              <TriangleAlert className="size-5" />
            </div>
            <div className="max-w-[24rem]">
              <h2 className="text-[1.8rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2rem]">
                Tu agencia te mantiene en la oscuridad?
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
                Inviertes presupuesto, pero recibes reportes genericos una vez al mes. No sabes
                que funciona. Tu negocio merece claridad, no excusas.
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
            La mayoría te manda un PDF. Nosotros abrimos el sistema para que veas qué creativo
            gana, qué canal escala y qué está bloqueando el siguiente paso.
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
          Operacion real. Metricas ilustrativas.
        </p>
        <p className="mx-auto mt-4 max-w-[19rem] text-center text-[14px] leading-6 text-slate-300 sm:max-w-[22rem] sm:text-[15px]">
          Los visuales son reales. Los numeros debajo son ilustrativos para mostrar el tipo de
          lectura sin exponer datos de clientes.
        </p>

        <div className="mt-6 space-y-4">
          <article className="landing-card-hover overflow-hidden rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.05)_100%)] shadow-[0_22px_44px_-26px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="grid gap-3 border-b border-white/10 p-3 sm:grid-cols-[0.72fr_1.28fr]">
              <div className="relative h-[18rem] overflow-hidden rounded-[18px] border border-white/10 bg-[#08111f] sm:h-[23rem]">
                <Image
                  src={campaignMobileViewport}
                  alt="Actual client portal mobile view"
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="scale-[1.03] object-cover object-top blur-[2px]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,19,0.2)_18%,rgba(5,11,19,0.82)_100%)]" />
                <p className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#081220]/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                  Mobile portal
                </p>

                <div className="absolute bottom-3 left-3 right-3">
                  <LandingSampleMetricCard
                    label="sample roas"
                    value="3.9x"
                    caption="mobile read"
                    delta="+11%"
                    accent="blue"
                    size="compact"
                    trendPoints="6,26 20,24 34,20 48,18 62,14 78,10 94,8"
                  />
                </div>
              </div>

              <div className="relative h-[18rem] overflow-hidden rounded-[18px] border border-white/10 bg-[#08111f] sm:h-[23rem]">
                <Image
                  src={campaignDesktop}
                  alt="Actual client portal desktop view"
                  fill
                  sizes="(max-width: 640px) 100vw, 560px"
                  className="scale-[1.01] object-cover object-top blur-[2px]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,19,0.16)_8%,rgba(5,11,19,0.86)_100%)]" />
                <p className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#081220]/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                  Desktop reporting surface
                </p>

                <div className="absolute right-3 top-12 w-[10rem]">
                  <LandingSampleMetricCard
                    label="sample revenue"
                    value="$48.2K"
                    caption="desktop trend"
                    delta="+22%"
                    accent="emerald"
                    size="compact"
                    trendPoints="6,28 20,25 34,21 48,18 62,15 78,10 94,6"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#8fd4ff]">Sample portal view</p>
              <h3 className="mt-2 text-[1.55rem] font-semibold leading-[1.02] text-white sm:text-[1.8rem]">
                Reporting live que se lee bien en mobile y desktop.
              </h3>
              <p className="mt-3 max-w-[28rem] text-[14px] leading-6 text-slate-300 sm:text-[15px]">
                Mismo sistema, dos modos de lectura: cliente en mobile para claridad inmediata y
                equipo en desktop para breakdowns, trends, creatives e insights accionables.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PORTAL_METRICS.map((item) => (
                  <LandingSampleMetricCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    caption={item.caption}
                    delta={item.delta}
                    accent={item.accent}
                    trendPoints={item.trendPoints}
                    className="landing-card-hover"
                    size="compact"
                  />
                ))}
              </div>
            </div>
          </article>

          <article className="landing-card-hover rounded-[24px] border border-[#61c0ff]/18 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_32%),linear-gradient(180deg,#0a1526_0%,#08111f_100%)] p-5 shadow-[0_22px_44px_-26px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8fd4ff]">Sample event snapshot</p>
            <h3 className="mt-2 max-w-[13ch] text-[1.7rem] font-semibold leading-[1.02] text-white sm:text-[1.95rem]">
              Asi se ve una lectura rapida cuando el sistema esta bien instrumentado.
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {TOUR_METRICS.map((item) => (
                <LandingSampleMetricCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  caption={item.caption}
                  delta={item.delta}
                  accent={item.accent}
                  trendPoints={item.trendPoints}
                  className="landing-card-hover"
                  size="compact"
                />
              ))}
            </div>
          </article>

          <div className="grid grid-cols-2 gap-3">
            {QUICK_WINS.map((item) => (
              <LandingSampleMetricCard
                key={item.name}
                label={item.name}
                value={item.stat}
                caption={item.detail}
                delta={item.delta}
                accent={item.accent}
                trendPoints={item.trendPoints}
                className="landing-card-hover"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
