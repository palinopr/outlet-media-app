import { BarChart3, Search, Sparkles } from "lucide-react";

const STEPS = [
  {
    title: "1. La Auditoría",
    description: "Encontramos las fugas de dinero en tus ads actuales.",
    icon: Search,
  },
  {
    title: "2. La Estrategia",
    description: "Diseñamos el ángulo creativo y el funnel de conversión.",
    icon: Sparkles,
  },
  {
    title: "3. Escalamiento",
    description: "Lanzamos con visibilidad total en dashboards.",
    icon: BarChart3,
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section className="border-b border-white/8 px-5 py-6 text-white sm:px-6">
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
        How we work
      </p>
      <div className="mt-6 space-y-7">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative text-center">
              {index !== STEPS.length - 1 ? (
                <div className="absolute left-1/2 top-12 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-[#1f5eff] via-[#61c0ff] to-transparent" />
              ) : null}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#1f5eff]/30 bg-[#0c1c33] text-[#61c0ff] shadow-[0_0_0_1px_rgba(31,94,255,0.08)]">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-[1.65rem] font-semibold text-white">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[15rem] text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
