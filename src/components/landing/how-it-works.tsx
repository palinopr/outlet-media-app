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
    description: "Lanzamos con reporting live, approvals visibles y follow-through claro.",
    icon: BarChart3,
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section className="border-b border-white/8 px-5 py-7 text-white sm:px-6">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        Así operamos
      </p>
      <h2 className="mt-3 text-center text-[1.95rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.1rem]">
        Tres movimientos. Cero teatro.
      </h2>
      <p className="mx-auto mt-3 max-w-[18rem] text-center text-[14px] leading-6 text-slate-300 sm:max-w-[20rem] sm:text-[15px]">
        Auditamos rápido, definimos el ángulo y dejamos la operación visible desde el primer día.
      </p>
      <div className="mt-7 space-y-8">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative text-center">
              {index !== STEPS.length - 1 ? (
                <div className="absolute left-1/2 top-12 h-[4.5rem] w-px -translate-x-1/2 bg-gradient-to-b from-[#1f5eff] via-[#61c0ff] to-transparent" />
              ) : null}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#1f5eff]/30 bg-[#0c1c33] text-[#61c0ff] shadow-[0_0_0_1px_rgba(31,94,255,0.08)]">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-3 text-[1.45rem] font-semibold leading-[1.05] text-white sm:text-[1.6rem]">
                {step.title}
              </h3>
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
