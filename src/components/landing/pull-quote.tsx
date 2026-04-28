"use client";

import { motion } from "framer-motion";

export function LandingPullQuote() {
  return (
    <motion.section
      className="mt-28 border-y border-[color:var(--landing-border)] py-16 lg:py-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        Operador · no gerente de cuentas
      </p>
      <p className="mt-5 max-w-[28ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-white lg:text-[3.5rem]">
        <span className="text-[color:var(--landing-brand-soft)]">&ldquo;</span>
        Cobramos por mover números — no por mandarte un reporte.
        <span className="text-[color:var(--landing-brand-soft)]">&rdquo;</span>
      </p>
      <p className="mt-6 font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.18em] text-[color:var(--landing-muted-2)]">
        Jaime Ortiz · fundador, outlet media
      </p>
    </motion.section>
  );
}
