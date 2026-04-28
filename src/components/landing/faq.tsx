"use client";

import { motion } from "framer-motion";

const QA = [
  {
    q: "¿Cuánto cuesta?",
    a: "La auditoría inicial es gratis. Si decidimos trabajar juntos, el fee es mes a mes y escala con tu ad spend. Sin retainer anual ni letras chiquitas.",
  },
  {
    q: "¿Y si ya tengo agencia?",
    a: "No tienes que romper con nadie para pedirnos la auditoría. Te damos una segunda opinión y los números hablan. Si tu agencia actual está haciendo un trabajo mejor, te lo decimos nosotros mismos.",
  },
  {
    q: "¿Qué recibo en la auditoría?",
    a: "Un video corto con prioridades claras: qué campañas pausar, qué anuncios están funcionando, dónde mover presupuesto y qué probar en los próximos 7 días.",
  },
  {
    q: "¿Manejan eventos, ecommerce o leads?",
    a: "Los tres. $12M+ movidos entre giras de artistas (Rauw Alejandro, Don Omar, KYBBA), ecommerce/D2C y negocios en Puerto Rico. Si vendes boleto, producto o servicio, encajas.",
  },
  {
    q: "¿Cuánto tarda?",
    a: "La llamada queda agendada al momento. Si envías la cuenta por formulario, respondemos en menos de 24h laborables.",
  },
] as const;

export function LandingFAQ() {
  return (
    <motion.section
      className="mt-16 lg:mt-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        Preguntas
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold tracking-[-0.035em] text-white lg:text-[3rem]">
        Lo que preguntan antes de arrancar.
      </h2>
      <div className="mt-8 border-t border-[color:var(--landing-border)]">
        {QA.map(({ q, a }) => (
          <details
            key={q}
            className="group border-b border-[color:var(--landing-border)] py-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-landing-heading)] text-[17px] font-semibold text-white marker:hidden">
              <span className="flex-1">{q}</span>
              <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-full border border-[color:var(--landing-border)] font-[family-name:var(--font-landing-heading)] text-lg font-normal text-[color:var(--landing-brand-soft)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3.5 max-w-[60ch] text-[14px] leading-relaxed text-[color:var(--landing-muted)]">
              {a}
            </p>
          </details>
        ))}
      </div>
    </motion.section>
  );
}
