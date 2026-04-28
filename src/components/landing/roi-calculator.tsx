"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const MIN_SPEND = 500;
const MAX_SPEND = 30000;
const STEP = 250;
const LOW_ROAS = 1.5;
const GOOD_ROAS = 3;

function formatMoney(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return `$${n.toLocaleString("en-US")}`;
}

export function LandingROICalculator() {
  const [spend, setSpend] = useState(3000);

  const lowRevenue = spend * LOW_ROAS;
  const goodRevenue = spend * GOOD_ROAS;
  const monthlyDelta = goodRevenue - lowRevenue;
  const yearlyDelta = monthlyDelta * 12;

  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        Calculadora
      </p>
      <h2 className="mt-3 max-w-[22ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white lg:text-[2.75rem]">
        ¿Cuánto estás perdiendo cada mes?
      </h2>
      <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
        Con ROAS promedio de agencia <span className="text-white">(~1.5×)</span> vs ROAS que
        entregamos nosotros <span className="text-white">(3× o más)</span>. Mueve el slider.
      </p>

      <div className="mt-10 rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] p-6 lg:p-10">
        {/* Slider */}
        <div>
          <div className="flex items-baseline justify-between">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-muted-2)]">
              Tu ad spend mensual
            </p>
            <p className="font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-none tracking-[-0.03em] text-white lg:text-[2.5rem]">
              {formatMoney(spend)}
            </p>
          </div>
          <input
            type="range"
            min={MIN_SPEND}
            max={MAX_SPEND}
            step={STEP}
            value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
            aria-label="Ad spend mensual"
            className="landing-roi-slider mt-4 w-full"
          />
          <div className="mt-2 flex justify-between font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
            <span>{formatMoney(MIN_SPEND)}</span>
            <span>{formatMoney(MAX_SPEND)}+</span>
          </div>
        </div>

        {/* Output cards */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-[12px] border border-[color:var(--landing-border)] bg-white/[0.02] p-5">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-muted-2)]">
              Con agencia promedio · ROAS 1.5×
            </p>
            <p className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-none tracking-[-0.03em] text-white lg:text-[2.5rem]">
              {formatMoney(lowRevenue)}
            </p>
            <p className="mt-1.5 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
              ventas / mes
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[12px] border border-[color:var(--landing-brand-soft)]/40 bg-[rgba(30,31,184,0.06)] p-5">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
              Con Outlet · ROAS 3× o más
            </p>
            <p className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-none tracking-[-0.03em] text-[color:var(--landing-brand-soft)] lg:text-[2.5rem]">
              {formatMoney(goodRevenue)}
            </p>
            <p className="mt-1.5 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
              ventas / mes
            </p>
          </div>
        </div>

        {/* Loss callout */}
        <div className="mt-4 rounded-[12px] border border-red-500/20 bg-red-500/[0.04] p-5">
          <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-red-400/80">
            Diferencia — lo que dejas sobre la mesa
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p className="font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] text-white lg:text-[3rem]">
              {formatMoney(monthlyDelta)}
              <span className="ml-2 font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.14em] text-[color:var(--landing-muted)]">
                / mes
              </span>
            </p>
            <p className="font-[family-name:var(--font-landing-heading)] text-[1.25rem] font-bold leading-none tracking-[-0.02em] text-[color:var(--landing-muted)]">
              {formatMoney(yearlyDelta)}
              <span className="ml-2 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
                / año
              </span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href="#form"
          className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[color:var(--landing-brand)] font-[family-name:var(--font-landing-heading)] text-sm font-bold tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(30,31,184,0.55)] sm:w-auto sm:px-8"
        >
          Agenda tu llamada · te mostramos cómo <span aria-hidden>→</span>
        </a>
        <p className="mt-3 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
          ROAS promedio estimado. Resultados reales varían — por eso te auditamos antes.
        </p>
      </div>
    </motion.section>
  );
}
