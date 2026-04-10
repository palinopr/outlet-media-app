import { BarChart3, Search, Sparkles } from "lucide-react";

const STEPS = [
  {
    title: "1. La auditoría",
    description: "Encontramos las fugas de dinero en tus ads actuales.",
    icon: Search,
  },
  {
    title: "2. La estrategia",
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
    <section className="border-b border-white/8 px-4 py-6 text-white sm:px-5">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
        How we work
      </p>
      <div className="mt-5 space-y-5">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative pl-16">
              {index !== STEPS.length - 1 ? (
                <div className="absolute left-7 top-12 h-14 w-px bg-gradient-to-b from-[#1f5eff] via-[#61c0ff] to-transparent" />
              ) : null}
              <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border border-[#1f5eff]/30 bg-[#0c1c33] text-[#61c0ff] shadow-[0_0_0_1px_rgba(31,94,255,0.08)]">
                <Icon className="size-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-300">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
