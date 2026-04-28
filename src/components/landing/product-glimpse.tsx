"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const BULLETS = [
  "ROAS, spend, boletos vendidos y creatividades top — en una sola pantalla.",
  "Pregúntale al agente AI: \"¿qué campaña subo este fin de semana?\" y te responde con números.",
  "Acceso para tu equipo. Sin reuniones para ver cómo va la cuenta.",
] as const;

export function LandingProductGlimpse() {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        El portal del cliente
      </p>
      <h2 className="mt-3 max-w-[24ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white lg:text-[2.75rem]">
        Ábrelo mañana a las 9am y en 10 segundos sabes si estás ganando dinero.
      </h2>

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div className="mx-auto w-[240px]">
          <div className="relative aspect-[9/19] rounded-[32px] border border-[#1a1a1a] bg-black p-2.5 shadow-[0_50px_100px_-40px_rgba(30,31,184,0.25)]">
            <div className="absolute left-1/2 top-2 z-[2] h-[18px] w-[80px] -translate-x-1/2 rounded-b-[12px] bg-black" />
            <div className="relative size-full overflow-hidden rounded-[24px] bg-[color:var(--landing-bg)]">
              <Image
                src="/images/landing/portal-mobile.png"
                alt="Portal"
                fill
                sizes="240px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
        <ul className="space-y-4">
          {BULLETS.map((line) => (
            <li key={line} className="flex items-start gap-3 text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
              <span
                aria-hidden
                className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-[color:var(--landing-brand-soft)]"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
