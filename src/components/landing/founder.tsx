"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LandingFounder() {
  return (
    <motion.section
      className="mt-16 overflow-hidden rounded-[16px] border border-[color:var(--landing-border)] bg-white/[0.025] lg:mt-24 lg:grid lg:grid-cols-[38%_1fr] lg:items-stretch"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden lg:aspect-auto">
        <Image
          src="/images/landing/jaime-ortiz.png"
          alt="Jaime Ortiz"
          fill
          sizes="(max-width: 900px) 100vw, 420px"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent lg:hidden" />
      </div>
      <div className="p-6 lg:p-8">
        <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Fundador & operador
        </p>
        <h2 className="mt-3 max-w-[12ch] font-[family-name:var(--font-landing-heading)] text-[2.15rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[3rem]">
          Trabajas directo con quien opera la cuenta.
        </h2>
        <p className="mt-2 font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
          Jaime Ortiz · Outlet Media
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
          No hay juniors. No hay handoff. Yo reviso la estrategia, los números y las
          decisiones que mueven ventas.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
          Hablemos claro y en números que entiendes. Así es como generamos resultados
          reales para negocios, artistas y marcas en Puerto Rico y Latinoamérica.
        </p>
      </div>
    </motion.section>
  );
}
