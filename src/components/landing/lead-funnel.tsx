"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LandingTrackedLink } from "./tracked-link";

const STATS = [
  { value: "$12M+", label: "ad spend operado" },
  { value: "$100M+", label: "ventas atribuidas" },
  { value: "150+", label: "sold outs trabajados" },
  { value: "7 años", label: "operando" },
] as const;

const STARTING_POINTS = [
  {
    stage: "never_ran_ads",
    title: "Empiezo desde cero",
    body: "Montamos Business Manager, cuenta, tracking, ruta a WhatsApp o landing y primera campaña medible.",
    route: "Setup de anuncios",
  },
  {
    stage: "boosting_posts",
    title: "Boosteo posts y no vendo",
    body: "Separamos likes de ventas: mensaje, objetivo, audiencia, tracking y seguimiento.",
    route: "Arreglo de anuncios",
  },
  {
    stage: "has_ad_account",
    title: "Ya tengo campañas",
    body: "Revisamos qué pausar, qué escalar y qué probar para dejar de gastar a ciegas.",
    route: "Sprint de ventas",
  },
  {
    stage: "needs_leads",
    title: "Necesito leads o citas",
    body: "Creamos una ruta clara de anuncio a formulario o WhatsApp, cualificación y seguimiento.",
    route: "Sprint de leads",
  },
  {
    stage: "sells_products",
    title: "Vendo productos online",
    body: "Ajustamos creativos, conversiones, retargeting y presupuesto alrededor del margen.",
    route: "Sprint de ecommerce",
  },
  {
    stage: "sells_tickets",
    title: "Necesito vender boletos",
    body: "Trabajamos urgencia, pacing por fecha, creativos, tracking y mercados clave.",
    route: "Sprint de boletos",
  },
] as const;

const SYSTEM_STEPS = [
  {
    title: "Oferta",
    body: "Definimos qué se vende, a quién, por qué ahora y cuánto margen hay.",
  },
  {
    title: "Base",
    body: "Business Manager, cuenta publicitaria, pixel, tracking, landing, WhatsApp o checkout.",
  },
  {
    title: "Campañas",
    body: "Estructura para probar, medir, pausar perdedores y escalar lo que produce.",
  },
  {
    title: "Decisiones",
    body: "Reporte simple: qué pasó, qué movimos y qué necesita el cliente.",
  },
] as const;

const PROOF_CARDS = [
  {
    vertical: "Operación de pauta",
    name: "Rauw Alejandro",
    result: "370K+ boletos",
    detail: "Pacing, creativos y demanda",
    image: "/images/landing/rauw-shauring.png",
    objectPosition: "center 12%",
  },
  {
    vertical: "Demanda local",
    name: "Young Miko",
    result: "Coca-Cola Music Hall",
    detail: "Mercado PR y venta por fecha",
    image: "/images/landing/young-miko-poster.png",
    objectPosition: "center top",
  },
  {
    vertical: "Tour USA",
    name: "Luis Miguel",
    result: "Sold out",
    detail: "Presupuesto y timing",
    image: "/images/landing/luis-miguel.png",
    objectPosition: "center 30%",
  },
  {
    vertical: "Funnel de evento",
    name: "Gilberto Santa Rosa",
    result: "Sold out",
    detail: "Anuncio a compra",
    image: "/images/landing/gilberto-santa-rosa.png",
    objectPosition: "center 20%",
  },
  {
    vertical: "Creativo local",
    name: "Gallimbo Studios",
    result: "Content",
    detail: "Piezas para performance",
    logo: "/images/landing/gallimbo-studios.png",
  },
  {
    vertical: "Funnel local",
    name: "9AM",
    result: "Ticket clicks",
    detail: "Meta a ticket link",
    logo: "/images/landing/9am.png",
  },
] as const;

const OFFERS = [
  {
    name: "Llamada privada",
    price: "$350-$750",
    fit: "Para decidir qué hacer antes de gastar más. Sales con diagnóstico, prioridades y presupuesto recomendado.",
  },
  {
    name: "Setup de anuncios",
    price: "desde $1,500",
    fit: "Para negocios que empiezan desde cero: cuenta, tracking, estructura inicial y primera campaña lista para medir.",
  },
  {
    name: "Arreglo de anuncios",
    price: "desde $2,500",
    fit: "Para cuentas que ya gastan pero no convierten: auditoría, reparación de funnel y nueva estructura de campaña.",
  },
  {
    name: "Sprint de ventas 30 días",
    price: "desde $3,500",
    fit: "Para probar oferta, creativos, landing o WhatsApp y tomar decisiones de presupuesto con seguimiento.",
  },
  {
    name: "Sprint de boletos / ecom / leads",
    price: "desde $5,000",
    fit: "Para campañas con fecha, inventario, margen o meta clara donde hay que mover rápido.",
  },
  {
    name: "Manejo mensual",
    price: "desde $3,000/mes",
    fit: "Para negocios listos para que Outlet opere, mida y optimice el sistema todos los meses.",
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
    <motion.section className="mt-2 lg:mt-0" {...reveal}>
      <p className="mb-3 max-w-[62ch] text-[13.5px] leading-relaxed text-[color:var(--landing-muted)] lg:text-[15px]">
        La prueba grande viene de campañas con presión real. La misma disciplina se
        baja a negocios locales: cuenta correcta, tracking claro, creativo,
        seguimiento y presupuesto con criterio.
      </p>
      <div className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-white/[0.025] lg:grid-cols-4">
        {STATS.map((stat, idx) => (
          <div
            key={stat.label}
            className={`p-3.5 sm:p-5 lg:p-6 ${
              idx % 2 === 0 ? "border-r border-[color:var(--landing-border)]" : ""
            } ${idx < 2 ? "border-b border-[color:var(--landing-border)] lg:border-b-0" : ""} ${
              idx > 0 ? "lg:border-l lg:border-[color:var(--landing-border)]" : ""
            }`}
          >
            <p className="font-[family-name:var(--font-landing-heading)] text-[1.65rem] font-extrabold leading-none tracking-[-0.035em] text-white sm:text-[1.9rem] lg:text-[2.35rem]">
              {stat.value}
            </p>
            <p className="mt-1.5 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export function LandingPathSelector() {
  function selectStartingPoint(stage: string) {
    window.dispatchEvent(
      new CustomEvent("outlet:setLandingStage", { detail: { stage } }),
    );
  }

  return (
    <motion.section id="starting-point" className="mt-10 scroll-mt-6 lg:mt-20" {...reveal}>
      <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
        <div>
          <h2 className="font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[0.98] tracking-[-0.04em] text-white min-[390px]:text-[2.25rem] lg:text-[3.4rem]">
            Escoge tu punto de partida.
          </h2>
          <p className="mt-3 max-w-[43ch] text-[14.5px] leading-relaxed text-[color:var(--landing-muted)] lg:mt-4 lg:text-[17px]">
            Cada negocio llega con una fuga distinta: cuenta mal montada, posts
            boosteados, mensajes sin seguimiento, tienda que no convierte o evento
            con fecha encima.
          </p>
        </div>
        <p className="rounded-[14px] border border-[color:var(--landing-border)] bg-white/[0.025] p-4 text-[13.5px] leading-relaxed text-[color:var(--landing-muted)] lg:p-5 lg:text-[14px]">
          No necesitas hablar en jerga de marketing. Solo dinos qué vendes, cuánto
          puedes invertir y qué resultado necesitas.
        </p>
      </div>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:mt-7 lg:grid-cols-3">
        {STARTING_POINTS.map((point) => (
          <a
            key={point.title}
            href="#form"
            onClick={() => selectStartingPoint(point.stage)}
            className="group rounded-[14px] border border-white/12 bg-white/[0.045] p-3.5 transition-colors hover:border-[color:var(--landing-brand-soft)]/60 hover:bg-[rgba(30,31,184,0.1)] lg:min-h-[168px] lg:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-[family-name:var(--font-landing-heading)] text-[17px] font-bold leading-tight tracking-[-0.02em] text-white lg:text-[18px]">
                {point.title}
              </h3>
              <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 font-[family-name:var(--font-landing-mono)] text-[9px] uppercase tracking-[0.12em] text-white/58">
                {point.route}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--landing-muted)] lg:text-[13.5px]">
              {point.body}
            </p>
            <p className="mt-3 inline-flex min-h-9 items-center rounded-full bg-white px-3 font-[family-name:var(--font-landing-heading)] text-[12.5px] font-extrabold text-[#101010]">
              Usar este punto
            </p>
          </a>
        ))}
      </div>
    </motion.section>
  );
}

export function LandingProblemSection() {
  return (
    <motion.section className="mt-16 lg:mt-24" {...reveal}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <h2 className="font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-[1] tracking-[-0.04em] text-white lg:text-[3.25rem]">
            El problema casi nunca es solo el anuncio.
          </h2>
          <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[color:var(--landing-muted)] lg:text-[17px]">
            Si una persona toca el ad y se pierde entre Instagram, WhatsApp, checkout,
            formulario o seguimiento, estás pagando por atención que no se convierte.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            "No tienes cuenta o tracking bien configurado.",
            "Boosteas contenido sin saber qué vendió.",
            "Los mensajes llegan, pero nadie los cualifica ni los cierra.",
            "Hay clicks, pero el landing, tienda o ticket link pierde compradores.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[12px] border border-[color:var(--landing-border)] bg-white/[0.025] p-4 text-[14px] leading-relaxed text-[color:var(--landing-muted)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function LandingAuditDeliverables() {
  return (
    <motion.section className="mt-16 lg:mt-24" {...reveal}>
      <div className="text-center">
        <h2 className="mx-auto max-w-[18ch] font-[family-name:var(--font-landing-heading)] text-[2.35rem] font-extrabold leading-[1] tracking-[-0.04em] text-white lg:max-w-[22ch] lg:text-[3.25rem]">
          Lo que revisamos antes de venderte algo.
        </h2>
        <p className="mx-auto mt-4 max-w-[58ch] text-[15px] leading-relaxed text-[color:var(--landing-muted)] lg:text-[17px]">
          No sirve correr anuncios si la oferta, el tracking o el WhatsApp pierden gente.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {SYSTEM_STEPS.map((item) => (
          <article
            key={item.title}
            className="rounded-[14px] border border-[color:var(--landing-border)] bg-[linear-gradient(180deg,rgba(30,31,184,0.1),rgba(255,255,255,0.018))] p-5"
          >
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
              {item.title}
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[color:var(--landing-muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export function LandingProofCarousel() {
  return (
    <motion.section className="mt-16 lg:mt-24" {...reveal}>
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div>
          <h2 className="font-[family-name:var(--font-landing-heading)] text-[2.35rem] font-extrabold leading-[1] tracking-[-0.04em] text-white lg:text-[3.25rem]">
            Los eventos prueban la disciplina.
          </h2>
        </div>
        <p className="text-[15px] leading-relaxed text-[color:var(--landing-muted)] lg:text-[17px]">
          Los boletos obligan a medir rápido: creativo, tracking, presupuesto y fecha.
          Esa misma disciplina funciona para productos, leads, citas y negocios locales.
        </p>
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
      <LandingTrackedLink
        href="#form"
        eventPayload={{ source: "mid_page", target: "form" }}
        className="inline-flex h-[54px] w-full max-w-[320px] items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] px-7 font-[family-name:var(--font-landing-heading)] text-[15px] font-bold tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(30,31,184,0.65)] transition-shadow hover:shadow-[0_22px_50px_-12px_rgba(30,31,184,0.78)]"
      >
        Encontrar mi próximo paso
      </LandingTrackedLink>
      <LandingTrackedLink
        href="#offers"
        eventPayload={{ source: "mid_page", target: "offers" }}
        className="mt-3 font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)] underline decoration-white/10 underline-offset-4 transition-colors hover:text-white"
      >
        Ver rutas y precios
      </LandingTrackedLink>
    </motion.section>
  );
}

export function LandingFounderTrust() {
  return (
    <motion.section
      className="mt-16 rounded-[16px] border border-[color:var(--landing-border)] bg-white/[0.025] p-5 lg:mt-24 lg:p-7"
      {...reveal}
    >
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-[12px] bg-white/10">
              <Image
                src="/images/landing/jaime-ortiz-founder.jpg"
                alt="Jaime Ortiz"
                fill
                sizes="56px"
                className="object-cover object-[center_20%]"
              />
            </div>
            <div>
              <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
                Fundador & operador
              </p>
              <p className="mt-1 font-[family-name:var(--font-landing-heading)] text-[18px] font-extrabold tracking-[-0.02em] text-white">
                Jaime Ortiz · Outlet Media
              </p>
            </div>
          </div>
          <h2 className="mt-5 max-w-[14ch] font-[family-name:var(--font-landing-heading)] text-[2.15rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[3rem]">
            No compras una plantilla. Compras criterio.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
            La ventaja de Outlet es saber cuándo una cuenta necesita setup, cuándo un
            funnel está roto y cuándo sí hace sentido correr ads agresivamente.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            "Puedes empezar sin cuenta publicitaria.",
            "El presupuesto de anuncios es separado de los fees de Outlet.",
            "Tus activos, cuenta y data deben quedar bajo tu negocio.",
            "No prometemos resultados falsos; medimos, decidimos y ajustamos.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[12px] border border-[color:var(--landing-border)] bg-[#101010] p-4 text-[14px] leading-relaxed text-[color:var(--landing-muted)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function LandingScarcitySection() {
  return (
    <motion.section
      id="offers"
      className="mt-5 scroll-mt-6 rounded-[16px] border border-[color:var(--landing-border)] bg-white/[0.025] p-5 lg:mt-6 lg:p-7"
      {...reveal}
    >
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <h2 className="max-w-[14ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[2.6rem]">
            Rutas para empezar sin sentirte fuera.
          </h2>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
            No ponemos a un negocio desde cero en el mismo paquete que una cuenta con
            $20K de presupuesto mensual en ads. Cada nivel tiene un rol.
          </p>
          <p className="mt-4 max-w-[42ch] text-[13.5px] leading-relaxed text-[color:var(--landing-muted-2)]">
            Empieza con el diagnóstico. Te decimos cuál aplica, qué no debes comprar
            todavía y cuánto presupuesto mínimo hace sentido.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {OFFERS.map((offer) => (
            <article
              key={offer.name}
              className="rounded-[12px] border border-[color:var(--landing-border)] bg-[#101010] p-4"
            >
              <p className="font-[family-name:var(--font-landing-heading)] text-[16px] font-bold tracking-[-0.02em] text-white">
                {offer.name}
              </p>
              <p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.12em] text-[color:var(--landing-brand-soft)]">
                {offer.price}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--landing-muted)]">
                {offer.fit}
              </p>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function LandingBookingSection() {
  const rawBookingUrl = process.env.NEXT_PUBLIC_AUDIT_BOOKING_URL?.trim();
  const bookingEmbedUrl = rawBookingUrl
    ? `${rawBookingUrl}${rawBookingUrl.includes("?") ? "&" : "?"}embed=true&theme=dark`
    : null;

  return (
    <motion.section
      id="booking"
      className="mt-16 scroll-mt-6 rounded-[16px] border border-[color:var(--landing-border)] bg-[linear-gradient(180deg,rgba(30,31,184,0.08),rgba(255,255,255,0.018))] p-5 lg:mt-24 lg:p-8"
      {...reveal}
    >
      <div className="mx-auto max-w-[720px] text-center">
        <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Para cuentas con fit
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white lg:text-[2.75rem]">
          Si hay oportunidad real, hablamos del sprint correcto.
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
          Primero completa el diagnóstico. Si el negocio tiene urgencia, margen o una
          fuga clara entre ads y clientes, coordinamos la llamada.
        </p>
      </div>

      {bookingEmbedUrl ? (
        <div className="mt-6 overflow-hidden rounded-[12px] border border-[color:var(--landing-border)] bg-[#080808]">
          <iframe
            src={bookingEmbedUrl}
            title="Agenda una llamada con Jaime Ortiz"
            className="h-[620px] w-full border-0 sm:h-[680px]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mx-auto mt-7 max-w-[520px] rounded-[14px] border border-[color:var(--landing-border)] bg-white/[0.025] p-5 text-center">
          <p className="font-[family-name:var(--font-landing-heading)] text-[1.35rem] font-bold tracking-[-0.02em] text-white">
            El diagnóstico es el primer paso.
          </p>
          <p className="mx-auto mt-2 max-w-[36ch] text-[14px] leading-relaxed text-[color:var(--landing-muted)]">
            El calendario se muestra cuando esté conectado. Mientras tanto, el formulario
            guarda la ruta recomendada y tus datos clave.
          </p>
          <LandingTrackedLink
            href="#form"
            eventPayload={{ source: "booking_fallback", target: "form" }}
            className="mx-auto mt-5 inline-flex h-12 items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] px-5 font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white"
          >
            Completar diagnóstico
          </LandingTrackedLink>
        </div>
      )}
    </motion.section>
  );
}
