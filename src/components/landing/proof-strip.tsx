"use client";

import { motion } from "framer-motion";
import { NumberTicker } from "./ui/number-ticker";

const STATS = [
  { prefix: "$", value: 100, suffix: "M+", label: "en ventas generadas", accent: false },
  { prefix: "$", value: 12, suffix: "M+", label: "de ad spend bajo manejo", accent: true },
  { prefix: "", value: 500, suffix: "K+", label: "boletos vendidos", accent: false },
  { prefix: "", value: 7, suffix: "+", label: "años operando, no improvisando", accent: false },
] as const;

export function LandingProofStrip() {
  return (
    <motion.section
      className="grid grid-cols-2 gap-6 border-t border-[color:var(--landing-border)] pt-10 lg:grid-cols-4 lg:gap-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      {STATS.map((stat) => (
        <div key={stat.label}>
          <p
            className={`flex items-baseline font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] ${
              stat.accent ? "text-[color:var(--landing-brand-soft)]" : "text-white"
            }`}
          >
            {stat.prefix}
            <NumberTicker value={stat.value} />
            {stat.suffix}
          </p>
          <p className="mt-2.5 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-muted-2)]">
            {stat.label}
          </p>
        </div>
      ))}
    </motion.section>
  );
}
