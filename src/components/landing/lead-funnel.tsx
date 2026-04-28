"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "$12M+", label: "ad spend" },
  { value: "$100M+", label: "ventas" },
  { value: "150+", label: "sold out" },
  { value: "7 años", label: "operando" },
] as const;

const PROBLEMS = [
  {
    title: "Recibes reportes, pero no decisiones",
    body: "Te mandan datos. No te dicen qué mover.",
  },
  {
    title: "Ves clicks, pero no sabes qué vendió",
    body: "Mucho tráfico. Poca claridad.",
  },
  {
    title: "Subes presupuesto a ciegas",
    body: "No sabes si estás escalando o quemando dinero.",
  },
] as const;

const DELIVERABLES = [
  {
    title: "Qué campañas pausar hoy",
    body: "Detectamos lo que no está funcionando y te decimos qué cortar.",
  },
  {
    title: "Qué anuncios están vendiendo",
    body: "Identificamos tus creativos ganadores y por qué están funcionando.",
  },
  {
    title: "Qué presupuesto mover esta semana",
    body: "Redistribuimos tu inversión hacia resultados, no hacia gasto.",
  },
  {
    title: "Qué probar en los próximos 7 días",
    body: "Te dejamos pruebas claras para escalar con menos riesgo.",
  },
] as const;

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.45 },
} as const;

export function LandingProofStats() {
  return (
    <motion.section
      className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-white/[0.025] lg:grid-cols-4"
      {...reveal}
    >
      {STATS.map((stat, idx) => (
        <div
          key={stat.label}
          className={`p-4 sm:p-5 lg:p-6 ${
            idx % 2 === 0 ? "border-r border-[color:var(--landing-border)]" : ""
          } ${idx < 2 ? "border-b border-[color:var(--landing-border)] lg:border-b-0" : ""} ${
            idx > 0 ? "lg:border-l lg:border-[color:var(--landing-border)]" : ""
          }`}
        >
          <p className="font-[family-name:var(--font-landing-heading)] text-[1.9rem] font-extrabold leading-none tracking-[-0.035em] text-white lg:text-[2.35rem]">
            {stat.value}
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
            {stat.label}
          </p>
        </div>
      ))}
    </motion.section>
  );
}

export function LandingProblemSection() {
  return (
    <motion.section className="mt-16 lg:mt-24" {...reveal}>
      <p className="text-center font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        El problema
      </p>
      <h2 className="mx-auto mt-3 max-w-[18ch] text-center font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white lg:max-w-[26ch] lg:text-[3rem]">
        El problema no es gastar en ads. Es gastar sin saber qué está funcionando.
      </h2>

      <div className="mt-7 grid gap-3 lg:grid-cols-3 lg:gap-4">
        {PROBLEMS.map((problem) => (
          <article
            key={problem.title}
            className="rounded-[14px] border border-[color:var(--landing-border)] bg-white/[0.025] p-5"
          >
            <h3 className="font-[family-name:var(--font-landing-heading)] text-[17px] font-bold leading-tight tracking-[-0.015em] text-white">
              {problem.title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--landing-muted)]">
              {problem.body}
            </p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export function LandingAuditDeliverables() {
  return (
    <motion.section className="mt-16 lg:mt-24" {...reveal}>
      <p className="text-center font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
        Tu auditoría gratis
      </p>
      <h2 className="mx-auto mt-3 max-w-[16ch] text-center font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white lg:max-w-none lg:text-[3rem]">
        En 24h recibes un plan claro.
      </h2>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {DELIVERABLES.map((item) => (
          <article
            key={item.title}
            className="rounded-[14px] border border-[color:var(--landing-border)] bg-[linear-gradient(180deg,rgba(30,31,184,0.08),rgba(255,255,255,0.018))] p-5"
          >
            <h3 className="font-[family-name:var(--font-landing-heading)] text-[16px] font-bold leading-tight tracking-[-0.015em] text-white">
              {item.title}
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[color:var(--landing-muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-5 text-center text-[13px] leading-relaxed text-[color:var(--landing-muted)]">
        Video de 8-12 minutos revisando tu cuenta. Sin pitch largo.
      </p>
    </motion.section>
  );
}

export function LandingMidPageCTA() {
  return (
    <motion.section className="mt-10 flex flex-col items-center text-center" {...reveal}>
      <a
        href="#booking"
        className="inline-flex h-[54px] w-full max-w-[310px] items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] px-7 font-[family-name:var(--font-landing-heading)] text-[15px] font-bold tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(30,31,184,0.65)] transition-shadow hover:shadow-[0_22px_50px_-12px_rgba(30,31,184,0.78)]"
      >
        Agenda tu auditoría gratis
      </a>
      <a
        href="#form"
        className="mt-3 font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)] underline decoration-white/10 underline-offset-4 transition-colors hover:text-white"
      >
        Prefiero enviar mi cuenta
      </a>
    </motion.section>
  );
}

export function LandingBookingSection() {
  return (
    <motion.section
      id="booking"
      className="mt-16 scroll-mt-6 rounded-[16px] border border-[color:var(--landing-border)] bg-[linear-gradient(180deg,rgba(30,31,184,0.08),rgba(255,255,255,0.018))] p-5 lg:mt-24 lg:p-8"
      {...reveal}
    >
      <div className="mx-auto max-w-[720px] text-center">
        <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Auditoría 100% gratis
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white lg:text-[2.75rem]">
          Agenda tu llamada de 15 minutos.
        </h2>
        <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
          Revisamos tu cuenta en vivo, detectamos prioridades y te decimos si hay fit para
          operar contigo.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-[12px] border border-[color:var(--landing-border)] bg-[#080808]">
        <iframe
          src="https://cal.com/jaimeortiz/15min?embed=true&theme=dark"
          title="Agenda una llamada con Jaime Ortiz"
          className="h-[620px] w-full border-0 sm:h-[680px]"
          loading="lazy"
        />
      </div>

      <p className="mt-5 text-center font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.08em] text-[color:var(--landing-muted-2)]">
        ¿No puedes escoger hora ahora?{" "}
        <a
          href="#form"
          className="text-[color:var(--landing-brand-soft)] underline decoration-[color:var(--landing-brand-soft)]/40 underline-offset-4"
        >
          Envía tu cuenta
        </a>
      </p>
    </motion.section>
  );
}
