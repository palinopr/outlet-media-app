"use client";

import Image from "next/image";
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

const PROOF_CARDS = [
  {
    vertical: "Tour",
    name: "Rauw Alejandro",
    result: "370K+ boletos",
    detail: "Boletos vendidos",
    image: "/images/landing/rauw-shauring.png",
    objectPosition: "center 12%",
  },
  {
    vertical: "Campaña",
    name: "Young Miko",
    result: "Coca-Cola Music Hall",
    detail: "Puerto Rico",
    image: "/images/landing/young-miko-poster.png",
    objectPosition: "center top",
  },
  {
    vertical: "Tour USA",
    name: "Luis Miguel",
    result: "Sold out",
    detail: "Fechas múltiples",
    image: "/images/landing/luis-miguel.png",
    objectPosition: "center 30%",
  },
  {
    vertical: "Evento",
    name: "Gilberto Santa Rosa",
    result: "Sold out",
    detail: "Campaña digital",
    image: "/images/landing/gilberto-santa-rosa.png",
    objectPosition: "center 20%",
  },
  {
    vertical: "Cliente",
    name: "Gallimbo Studios",
    result: "Contenido",
    detail: "Performance",
    logo: "/images/landing/gallimbo-studios.png",
  },
  {
    vertical: "Cliente",
    name: "9AM",
    result: "Negocio local",
    detail: "Paid media",
    logo: "/images/landing/9am.png",
  },
] as const;

const RAW_BOOKING_URL = process.env.NEXT_PUBLIC_AUDIT_BOOKING_URL?.trim();
const BOOKING_EMBED_URL = RAW_BOOKING_URL
  ? `${RAW_BOOKING_URL}${RAW_BOOKING_URL.includes("?") ? "&" : "?"}embed=true&theme=dark`
  : null;
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

export function LandingProofCarousel() {
  return (
    <motion.section className="mt-16 lg:mt-24" {...reveal}>
      <div className="text-center">
        <p className="font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Prueba real
        </p>
        <h2 className="mx-auto mt-3 max-w-[22ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[3rem]">
          Hemos vendido boletos, productos y servicios con ads.
        </h2>
      </div>

      <ul className="-mx-5 mt-7 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-6 lg:gap-4 [&::-webkit-scrollbar]:hidden">
        {PROOF_CARDS.map((card) => (
          <li
            key={card.name}
            className="group relative flex aspect-[4/5] min-w-[72%] snap-start overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] sm:min-w-0 lg:aspect-[3/4]"
          >
            {"image" in card ? (
              <Image
                src={card.image}
                alt={card.name}
                fill
                sizes="(max-width: 640px) 80vw, 360px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: card.objectPosition }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(30,31,184,0.22),transparent_60%),linear-gradient(180deg,#141414_0%,#0d0d0d_100%)]">
                <Image
                  src={card.logo}
                  alt={card.name}
                  width={200}
                  height={100}
                  className="h-auto max-h-[38%] w-auto max-w-[68%] object-contain opacity-90"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/55 to-transparent" />
            <div className="relative z-10 mt-auto p-5 lg:p-6">
              <p className="font-[family-name:var(--font-landing-mono)] text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
                {card.vertical}
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-landing-heading)] text-[18px] font-extrabold leading-tight tracking-[-0.02em] text-white lg:text-[20px]">
                {card.name}
              </p>
              <p className="mt-2 font-[family-name:var(--font-landing-heading)] text-[15px] font-bold text-white">
                {card.result}
              </p>
              <p className="mt-0.5 font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.12em] text-white/55">
                {card.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
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

export function LandingFounderTrust() {
  return (
    <motion.section
      className="mt-16 overflow-hidden rounded-[16px] border border-[color:var(--landing-border)] bg-white/[0.025] lg:mt-24 lg:grid lg:grid-cols-[38%_1fr] lg:items-stretch"
      {...reveal}
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

export function LandingScarcitySection() {
  return (
    <motion.section
      className="mt-5 rounded-[16px] border border-[color:var(--landing-brand-soft)]/30 bg-[linear-gradient(180deg,rgba(30,31,184,0.12)_0%,rgba(30,31,184,0.04)_100%)] p-5 lg:mt-6 lg:p-7"
      {...reveal}
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

      {BOOKING_EMBED_URL ? (
        <div className="mt-6 overflow-hidden rounded-[12px] border border-[color:var(--landing-border)] bg-[#080808]">
          <iframe
            src={BOOKING_EMBED_URL}
            title="Agenda una llamada con Jaime Ortiz"
            className="h-[620px] w-full border-0 sm:h-[680px]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mx-auto mt-7 max-w-[520px] rounded-[14px] border border-[color:var(--landing-border)] bg-white/[0.025] p-5 text-center">
          <p className="font-[family-name:var(--font-landing-heading)] text-[1.35rem] font-bold tracking-[-0.02em] text-white">
            Escríbenos y coordinamos el bloque.
          </p>
          <p className="mx-auto mt-2 max-w-[34ch] text-[14px] leading-relaxed text-[color:var(--landing-muted)]">
            Mientras conectamos el calendario, usa el formulario y coordinamos el bloque por
            teléfono o email.
          </p>
          <a
            href="#form"
            className="mx-auto mt-5 inline-flex h-12 items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] px-5 font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white"
          >
            Enviar mi cuenta
          </a>
        </div>
      )}

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
