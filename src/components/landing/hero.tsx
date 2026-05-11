"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LandingTrackedLink } from "./tracked-link";

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
  const diagnosticItems = [
    "Cuenta y tracking",
    "Oferta y creativo",
    "WhatsApp, checkout o boletos",
    "Presupuesto recomendado",
  ] as const;

  return (
    <motion.section
      className="pb-6 pt-4 lg:pb-10 lg:pt-10"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.82fr] lg:gap-14">
        <div>
          <motion.h1
            variants={fadeUp}
            className="max-w-[13ch] font-[family-name:var(--font-landing-heading)] text-[2.48rem] font-extrabold leading-[0.94] tracking-[-0.035em] text-white min-[390px]:text-[2.8rem] sm:text-[3.35rem] lg:max-w-[13.5ch] lg:text-[4.35rem]"
          >
            Convierte tus anuncios en clientes reales en Puerto Rico.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-[42ch] text-[16px] leading-relaxed text-[color:var(--landing-muted)] lg:mt-5 lg:max-w-[48ch] lg:text-[18px]"
          >
            Si estás empezando, boosteando posts o ya comprando ads, revisamos tu
            cuenta, oferta y ruta a WhatsApp, citas, checkout o boletos para decirte
            qué arreglar primero y cuánto hace sentido invertir.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-col items-stretch gap-3 sm:max-w-[450px] lg:mt-7"
          >
            <div className="grid gap-3 sm:grid-cols-[1.25fr_0.9fr]">
              <LandingTrackedLink
                href="#form"
                data-hero-cta="true"
                eventPayload={{ source: "hero_primary", target: "form" }}
                className="inline-flex h-[60px] items-center justify-center whitespace-nowrap rounded-[12px] bg-white px-6 font-[family-name:var(--font-landing-heading)] text-[16px] font-extrabold tracking-wide text-[#0d0d0d] shadow-[0_20px_44px_-18px_rgba(255,255,255,0.75)] transition-transform hover:scale-[1.015]"
              >
                Recibir diagnóstico gratis
              </LandingTrackedLink>
              <LandingTrackedLink
                href="#offers"
                eventPayload={{ source: "hero_secondary", target: "offers" }}
                className="inline-flex h-[60px] items-center justify-center rounded-[12px] border border-white/18 bg-white/[0.06] px-6 font-[family-name:var(--font-landing-heading)] text-[16px] font-bold tracking-wide text-white transition-colors hover:border-white/28 hover:bg-white/[0.09]"
              >
                Ver rutas y precios
              </LandingTrackedLink>
            </div>
            <div className="rounded-[12px] border border-white/10 bg-white/[0.045] px-4 py-3 text-center font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white/82">
              Gratis · sin compromiso · respuesta humana en menos de 24h laborables
            </div>
            <div className="flex items-center gap-3 rounded-[12px] border border-white/12 bg-[#f3f1e8] p-3 text-[#101010] lg:hidden">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-[#d9d7cf]">
                <Image
                  src="/images/landing/jaime-ortiz-founder.jpg"
                  alt="Jaime Ortiz — operador de campañas en Puerto Rico"
                  fill
                  sizes="48px"
                  className="object-cover object-[center_20%]"
                  priority
                />
              </div>
              <div>
                <p className="font-[family-name:var(--font-landing-heading)] text-[16px] font-extrabold leading-tight">
                  Jaime revisa tu caso.
                </p>
                <p className="mt-0.5 font-[family-name:var(--font-landing-mono)] text-[9px] uppercase tracking-[0.14em] text-[#56534b]">
                  Operador de campañas en PR
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="hidden rounded-[18px] border border-white/12 bg-[#f3f1e8] p-4 text-[#101010] shadow-[0_32px_90px_-54px_rgba(255,255,255,0.65)] lg:block lg:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[14px] bg-[#d9d7cf]">
              <Image
                src="/images/landing/jaime-ortiz-founder.jpg"
                alt="Jaime Ortiz — operador de campañas en Puerto Rico"
                fill
                sizes="72px"
                className="object-cover object-[center_20%]"
                priority
              />
            </div>
            <div>
              <p className="font-[family-name:var(--font-landing-heading)] text-[20px] font-extrabold leading-tight tracking-[-0.02em]">
                Jaime revisa tu caso.
              </p>
              <p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[#56534b]">
                Operador de campañas en PR
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {diagnosticItems.map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-[#d8d8d0] bg-white px-3.5 py-3"
              >
                <span className="font-[family-name:var(--font-landing-heading)] text-[15px] font-bold">
                  {item}
                </span>
                <span className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-brand)]">
                  0{index + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[14px] bg-[#101010] p-4 text-white">
            <p className="font-[family-name:var(--font-landing-heading)] text-[1.25rem] font-extrabold leading-tight tracking-[-0.02em]">
              Sales con una decisión clara.
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/68">
              Setup, arreglo de campañas, sprint de ventas o manejo mensual. Si
              todavía no debes gastar, también te lo decimos.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
