"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const METRICS = [
  { v: "$12.1K", l: "revenue" },
  { v: "425K", l: "impressions" },
  { v: "$0.41", l: "cpc" },
] as const;

export function LandingSignatureResult() {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        Caso vivo · hoy mismo
      </p>
      <h2 className="mt-3 max-w-[20ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white lg:text-[2.75rem]">
        Así se ve cuando una campaña sí está vendiendo.
      </h2>

      <div className="relative mt-7 aspect-[4/5] overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[#111] lg:aspect-[16/10]">
        <Image
          src="/images/landing/young-miko-poster.png"
          alt="KYBBA Miami"
          fill
          sizes="(max-width: 900px) 100vw, 1040px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent" />

        <div className="absolute right-4 top-4 rounded-md bg-[color:var(--landing-brand)] px-2.5 py-1.5 font-[family-name:var(--font-landing-mono)] text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          Activo ahora
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
          <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
            KYBBA · Miami · activo ahora
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold tracking-[-0.035em] text-white lg:text-[2.5rem]">
            2.9× ROAS en 7 días
          </p>
          <p className="mt-2 max-w-[40ch] text-[14px] leading-relaxed text-white/80">
            Por cada $1 invertido, $2.90 de vuelta. Esto es lo que deberías estar viendo cada semana.
          </p>
          <div className="mt-4 flex flex-wrap gap-6">
            {METRICS.map((m) => (
              <div key={m.l}>
                <p className="font-[family-name:var(--font-landing-heading)] text-[1.2rem] font-extrabold tracking-[-0.02em] text-white">
                  {m.v}
                </p>
                <p className="mt-0.5 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted)]">
                  {m.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
