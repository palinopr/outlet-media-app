"use client";

import { motion } from "framer-motion";

export function LandingScarcityBanner() {
  return (
    <motion.section
      className="mt-5 rounded-[16px] border border-[color:var(--landing-brand-soft)]/30 bg-[linear-gradient(180deg,rgba(30,31,184,0.12)_0%,rgba(30,31,184,0.04)_100%)] p-5 lg:mt-6 lg:p-7"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
            No tomamos cuentas ilimitadas
          </p>
          <h2 className="mt-3 max-w-[14ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[2.5rem]">
            Este mes abrimos 5 espacios para auditorías nuevas.
          </h2>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
            Queremos darte la atención y el enfoque que tu cuenta merece.
          </p>
        </div>
        <div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((slot) => (
              <span
                key={slot}
                className={`flex size-9 items-center justify-center rounded-full border text-[12px] ${
                  slot < 3
                    ? "border-[color:var(--landing-brand-soft)] bg-[color:var(--landing-brand)] text-white"
                    : "border-white/15 bg-white/[0.03] text-white/45"
                }`}
              >
                {slot + 1}
              </span>
            ))}
          </div>
          <a
            href="#booking"
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] px-5 font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white lg:w-auto"
          >
            Agenda gratis
          </a>
        </div>
      </div>
    </motion.section>
  );
}
