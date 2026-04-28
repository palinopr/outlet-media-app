"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
} as const;

export function LandingHero() {
  return (
    <motion.section
      className="pb-10 pt-6 lg:pb-14 lg:pt-10"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
        <div>
          <motion.p
            variants={fadeUp}
            className="font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]"
          >
            Agencia de paid media en Puerto Rico
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 max-w-[12ch] font-[family-name:var(--font-landing-heading)] text-[2.85rem] font-extrabold leading-[0.94] tracking-[-0.035em] text-white sm:text-[3.25rem] lg:max-w-[13ch] lg:text-[4.4rem]"
          >
            Pagas por anuncios. ¿Sabes cuáles venden?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[36ch] text-[16px] leading-relaxed text-[color:var(--landing-muted)] lg:text-[18px]"
          >
            En 24h auditamos tu cuenta y te decimos qué pausar, qué escalar y qué
            mover mañana.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col items-stretch gap-3 sm:max-w-[360px]"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#booking"
                data-hero-cta="true"
                className="inline-flex h-[54px] flex-1 items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] px-6 font-[family-name:var(--font-landing-heading)] text-[15px] font-bold tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(30,31,184,0.55)] transition-shadow hover:shadow-[0_22px_50px_-12px_rgba(30,31,184,0.75)]"
              >
                Agenda tu auditoría gratis
              </a>
              <a
                href="#form"
                className="inline-flex h-[54px] flex-1 items-center justify-center rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.03] px-6 font-[family-name:var(--font-landing-heading)] text-[15px] font-bold tracking-wide text-white transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                Prefiero enviar mi cuenta
              </a>
            </div>
            <p className="font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
              Responde Jaime · sin contrato · cero spam
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="relative aspect-[5/4] w-full overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] lg:aspect-[5/6]"
        >
          <Image
            src="/images/landing/jaime-ortiz-founder.jpg"
            alt="Jaime Ortiz — fundador, Outlet Media"
            fill
            sizes="(max-width: 900px) 100vw, 560px"
            className="object-cover object-[center_20%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
              Opera tu cuenta
            </p>
            <p className="mt-1 font-[family-name:var(--font-landing-heading)] text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-white lg:text-[26px]">
              Jaime Ortiz
            </p>
            <p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.14em] text-white/55">
              Fundador · 7 años operando
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
