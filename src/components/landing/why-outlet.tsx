"use client";

import { motion } from "framer-motion";

const ROWS = [
  {
    idx: "01",
    title: "Te decimos qué mover, no solo qué pasó.",
    body: "La mayoría de reportes explican la semana pasada. Nosotros te decimos qué subir, pausar o duplicar mañana — antes de que pierdas dinero.",
  },
  {
    idx: "02",
    title: "Ves la cuenta en vivo, no un resumen.",
    body: "Portal con ROAS, spend, audiencias y creatividades en tiempo real. Lo mismo que vemos nosotros desde dentro.",
  },
  {
    idx: "03",
    title: "Operador humano + agentes AI propios.",
    body: "Jaime opera tu cuenta. Un sistema de agentes propios vigila cada campaña 24/7 y avisa antes de que algo se rompa.",
  },
] as const;

export function LandingWhyOutlet() {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        Por qué Outlet
      </p>
      <h2 className="mt-3 max-w-[16ch] font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[3rem]">
        Lo que no te da una agencia normal.
      </h2>

      <div className="mt-9 grid gap-8 lg:grid-cols-3 lg:gap-7">
        {ROWS.map((row) => (
          <div key={row.idx} className="border-t border-[color:var(--landing-border)] pt-5">
            <p className="font-[family-name:var(--font-landing-mono)] text-[11px] tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
              {row.idx}
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[1.05rem] font-bold leading-tight tracking-[-0.01em] text-white">
              {row.title}
            </h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-[color:var(--landing-muted)]">
              {row.body}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
