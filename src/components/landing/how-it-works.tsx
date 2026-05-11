"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    label: "1",
    title: "Dices qué necesitas",
    body: "Ventas, leads, citas, WhatsApp, productos o boletos. Empezamos por el resultado.",
  },
  {
    label: "2",
    title: "Detectamos la fuga",
    body: "Revisamos oferta, cuenta, tracking, landing, WhatsApp, campañas y seguimiento.",
  },
  {
    label: "3",
    title: "Te digo qué hacer",
    body: "Setup, llamada, sprint o manejo completo. Si no debes comprar todavía, te lo digo claro.",
  },
] as const;

export function LandingHowItWorks() {
  return (
    <motion.section
      className="mt-16 lg:mt-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-center font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        Cómo se convierte
      </p>
      <h2 className="mt-3 text-center font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold tracking-[-0.035em] text-white lg:text-[3rem]">
        Primero diagnosticamos. Después vendemos.
      </h2>
      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-7">
        {STEPS.map((step) => (
          <div
            key={step.label}
            className="flex gap-4 border-l border-[color:var(--landing-border)] py-2 pl-4 lg:block lg:border-l-0 lg:border-t lg:py-0 lg:pt-6"
          >
            <p className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--landing-brand)]/25 font-[family-name:var(--font-landing-heading)] text-[16px] font-extrabold text-white shadow-[0_0_34px_-10px_rgba(30,31,184,0.9)] lg:size-auto lg:justify-start lg:rounded-none lg:bg-transparent lg:font-[family-name:var(--font-landing-mono)] lg:text-[13px] lg:font-normal lg:tracking-[0.18em] lg:text-[color:var(--landing-brand-soft)] lg:shadow-none">
              {step.label}
            </p>
            <div>
              <h3 className="font-[family-name:var(--font-landing-heading)] text-[1.25rem] font-bold tracking-[-0.02em] text-white lg:mt-3.5 lg:text-[1.35rem]">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--landing-muted)]">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
