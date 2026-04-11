import campaignMobileCreatives from "../../../docs/screenshots/campaign-mobile-creatives.png";
import Image from "next/image";
import {
  Bot,
  ChartColumnIncreasing,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { LandingSampleMetricCard } from "@/components/landing/sample-metric-card";

const AGENT_FEATURES = [
  {
    title: "Conversational reporting",
    body: "Responde sobre campanas y eventos reales.",
    icon: Bot,
  },
  {
    title: "Creative intelligence",
    body: "Puede apoyarse en ROAS, creatives y breakdowns.",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Next-step visibility",
    body: "Resume discussion, requests y follow-through.",
    icon: MessageSquareText,
  },
  {
    title: "Client-safe",
    body: "Read-only y sin exponer setup interno ni estrategia oculta.",
    icon: ShieldCheck,
  },
] as const;

export function LandingFeatures() {
  return (
    <section className="border-b border-white/8 px-5 pb-7 pt-7 text-white sm:px-6">
      <div className="overflow-hidden rounded-[28px] border border-[#61c0ff]/20 bg-[radial-gradient(circle_at_top,rgba(97,192,255,0.12),transparent_28%),linear-gradient(180deg,#0a172a_0%,#081220_100%)] shadow-[0_0_0_1px_rgba(97,192,255,0.06),0_30px_64px_-36px_rgba(36,99,235,0.5)]">
        <div className="relative aspect-[1.05/0.9] border-b border-white/10">
          <Image
            src="/images/landing/jaime-ortiz-founder.jpg"
            alt="Jaime Ortiz"
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className="object-cover object-[center_18%]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(97,192,255,0.14),transparent_26%),linear-gradient(180deg,rgba(3,9,21,0.06)_0%,rgba(3,9,21,0.28)_38%,rgba(8,20,33,0.98)_100%)]" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#07111d]/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
            Jaime Ortiz
          </div>
          <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-[#07111d]/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
            Founder / operator
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap gap-1.5">
            {[
              "Paid media",
              "Ticketing",
              "Reporting",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300"
              >
                {chip}
              </span>
            ))}
          </div>
          <h2 className="mt-4 max-w-[11ch] text-[1.95rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.15rem]">
            Soy Jaime. Operacion antes que pose.
          </h2>
          <div className="mt-4 max-w-[28rem] space-y-3.5 text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
            <p>
              No arme Outlet para vender dashboards bonitos. Lo arme porque estaba cansado de ver
              equipos gastando sin saber que pieza cerraba, donde se fugaba el dinero y que hacer
              despues.
            </p>
            <p>
              Si entramos, entramos a operar: media, ticketing, reporting, contexto compartido y
              seguimiento claro para cliente y equipo.
            </p>
          </div>
        </div>
      </div>

      <div className="landing-card-hover mt-5 overflow-hidden rounded-[28px] border border-[#61c0ff]/20 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#0a172a_0%,#081220_100%)] shadow-[0_0_0_1px_rgba(97,192,255,0.06),0_30px_64px_-36px_rgba(36,99,235,0.5)]">
        <div className="relative aspect-[1.04/0.86] border-b border-white/10">
          <Image
            src={campaignMobileCreatives}
            alt="Creative performance portal view"
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className="scale-[1.03] object-cover object-top blur-[2px]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,21,0.18)_0%,rgba(3,9,21,0.3)_36%,rgba(8,20,33,0.98)_100%)]" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#07111d]/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
            Portal + agent
          </div>

          <div className="absolute bottom-3 left-3 w-[9rem]">
            <LandingSampleMetricCard
              label="sample creative"
              value="4.1x"
              caption="roas signal"
              delta="+13%"
              accent="violet"
              track="media"
              size="compact"
              trendPoints="6,28 20,24 34,23 48,18 62,16 78,12 94,9"
            />
          </div>

          <div className="absolute bottom-3 right-3 w-[9rem]">
            <LandingSampleMetricCard
              label="sample spend"
              value="$8.4K"
              caption="tracked view"
              delta="+6%"
              accent="amber"
              track="ticketing"
              size="compact"
              trendPoints="6,29 20,26 34,25 48,21 62,18 78,14 94,12"
            />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <h3 className="max-w-[14ch] text-[1.9rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.05rem]">
            Preguntale al portal que cambio, que esta ganando y que sigue.
          </h3>
          <p className="mt-4 max-w-[28rem] text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
            El agente no improvisa. Lee la misma data, requests, approvals y timeline que sostiene
            la operacion. Por eso responde con contexto, no con humo.
          </p>
          <p className="mt-3 max-w-[28rem] text-[12px] uppercase tracking-[0.14em] text-slate-400">
            Metricas ilustrativas. Vista real del sistema.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Que cambio hoy?",
              "Que creativo vende?",
              "Que sigue despues?",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {AGENT_FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="landing-card-hover rounded-[20px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <Icon className="size-5 text-[#8fd4ff]" />
                  <p className="mt-3 text-[14px] font-semibold text-white">{feature.title}</p>
                  <p className="mt-1 text-[13px] leading-6 text-slate-300">{feature.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
