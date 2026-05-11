"use client";

import { motion } from "framer-motion";

const QA = [
  {
    q: "Nunca he corrido anuncios. ¿Esto es para mí?",
    a: "Sí. Si no tienes base, no te empujamos manejo mensual. Primero vemos si necesitas setup, una llamada privada o un primer lanzamiento simple.",
  },
  {
    q: "¿Outlet corre los anuncios o me enseña?",
    a: "La oferta principal es que Outlet configure, lance y opere. La llamada privada existe para negocios que todavía no están listos para un sprint.",
  },
  {
    q: "¿Por qué no vender solo manejo de ads?",
    a: "Porque muchas cuentas no fallan por el anuncio. Fallan por oferta, tracking, landing, WhatsApp, seguimiento o falta de decisiones. Outlet mira el sistema completo.",
  },
  {
    q: "¿Esto es solo para eventos?",
    a: "No. Eventos y música son prueba fuerte porque requieren urgencia y ejecución rápida. La misma disciplina aplica a productos, leads, citas, WhatsApp y negocios locales.",
  },
  {
    q: "¿Cuánto tarda el próximo paso?",
    a: "Después del diagnóstico respondemos en menos de 24h laborables con la ruta recomendada: setup, arreglo, sprint, manejo o llamada privada.",
  },
  {
    q: "¿Me van a vender aunque no esté listo?",
    a: "No. Si tu oferta, presupuesto o ruta de conversión todavía no aguanta ads, te decimos qué arreglar primero. Eso protege tu dinero y nuestra reputación.",
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
        Preguntas honestas
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold tracking-[-0.035em] text-white lg:text-[3rem]">
        Lo que debe quedar claro antes de pagar.
      </h2>
      <div className="mt-8 border-t border-[color:var(--landing-border)]">
        {QA.map(({ q, a }) => (
          <details
            key={q}
            className="group border-b border-[color:var(--landing-border)] py-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-landing-heading)] text-[17px] font-semibold text-white marker:hidden">
              <span className="flex-1">{q}</span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--landing-border)] font-[family-name:var(--font-landing-heading)] text-lg font-normal text-[color:var(--landing-brand-soft)] transition-transform group-open:rotate-45">
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
