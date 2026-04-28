"use client";

import { motion } from "framer-motion";

const MARKETS = [
  {
    city: "Puerto Rico",
    context: "Base principal",
    volume: "80+ eventos operados",
  },
  {
    city: "Miami, FL",
    context: "F1 Miami · eventos",
    volume: "15+ campañas activas",
  },
  {
    city: "Nueva York",
    context: "Giras y tours",
    volume: "20+ eventos operados",
  },
  {
    city: "Barcelona",
    context: "Don Omar · Olímpico",
    volume: "1 estadio olímpico",
  },
  {
    city: "México",
    context: "Tours regionales",
    volume: "10+ fechas operadas",
  },
  {
    city: "+15 ciudades",
    context: "9AM Banger y otros",
    volume: "En expansión continua",
  },
] as const;

export function LandingMarkets() {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Alcance multi-mercado
        </p>
        <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
          PR · USA · Europa · México
        </p>
      </div>

      <h2 className="mt-3 max-w-[22ch] font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[2.8rem]">
        No somos una agencia local. Operamos donde están tus fans.
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {MARKETS.map((market) => (
          <div
            key={market.city}
            className="rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] p-4"
          >
            <p className="font-[family-name:var(--font-landing-heading)] text-[15px] font-bold leading-tight text-white">
              {market.city}
            </p>
            <p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[9.5px] uppercase tracking-[0.14em] text-[color:var(--landing-brand-soft)]">
              {market.context}
            </p>
            <p className="mt-3 font-[family-name:var(--font-landing-heading)] text-[13px] font-bold leading-tight text-white/85">
              {market.volume}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
