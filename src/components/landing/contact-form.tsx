"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const INPUT_CLS =
  "h-[54px] w-full rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.02] px-[18px] text-[15px] text-white placeholder:text-[color:var(--landing-muted-2)] focus:border-[rgba(30,31,184,0.5)] focus:bg-[rgba(30,31,184,0.04)] focus:outline-none";

const TEXTAREA_CLS =
  "min-h-[118px] w-full rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.02] px-[18px] py-4 text-[15px] text-white placeholder:text-[color:var(--landing-muted-2)] focus:border-[rgba(30,31,184,0.5)] focus:bg-[rgba(30,31,184,0.04)] focus:outline-none";

const RAW_BOOKING_URL = process.env.NEXT_PUBLIC_AUDIT_BOOKING_URL?.trim();
const BOOKING_EMBED_URL = RAW_BOOKING_URL
  ? `${RAW_BOOKING_URL}${RAW_BOOKING_URL.includes("?") ? "&" : "?"}embed=true&theme=dark`
  : null;
const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();

const STAGE_OPTIONS = [
  { value: "never_ran_ads", label: "Nunca he corrido anuncios" },
  { value: "boosting_posts", label: "Boosteo posts pero no veo ventas" },
  { value: "has_ad_account", label: "Tengo cuenta de ads y necesito ayuda" },
  { value: "needs_leads", label: "Necesito leads o citas" },
  { value: "sells_products", label: "Vendo productos online" },
  { value: "sells_tickets", label: "Necesito vender boletos" },
  { value: "run_everything", label: "Quiero que Outlet corra todo" },
] as const;

const OUTCOME_OPTIONS = [
  "Ventas",
  "Leads",
  "Citas",
  "WhatsApp",
  "Boletos",
  "Ecommerce",
  "Setup completo",
] as const;

const BUDGET_OPTIONS = [
  { value: "under_500", label: "< $500/mes" },
  { value: "500_1500", label: "$500 - $1,500/mes" },
  { value: "1500_5000", label: "$1,500 - $5,000/mes" },
  { value: "5000_20000", label: "$5,000 - $20,000/mes" },
  { value: "20000_plus", label: "$20,000+/mes" },
  { value: "not_sure", label: "No sé todavía" },
] as const;

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function recommendOffer(stage: string, monthlyBudget: string) {
  if (stage === "sells_tickets") return "Ticket Sales Sprint - desde $5,000";
  if (stage === "run_everything" || monthlyBudget === "20000_plus") {
    return "Managed Growth Partner - desde $3,000/mes";
  }
  if (stage === "never_ran_ads") {
    return monthlyBudget === "under_500" || monthlyBudget === "not_sure"
      ? "Private Operator Call - $350-$750"
      : "Ads Setup Sprint - desde $1,500";
  }
  if (stage === "boosting_posts") return "Fix My Ads Sprint - desde $2,500";
  if (stage === "needs_leads") return "Lead Engine Sprint - desde $3,500";
  if (stage === "sells_products") return "Ecommerce Revenue Sprint - desde $4,500";
  if (monthlyBudget === "under_500" || monthlyBudget === "not_sure") {
    return "Private Operator Call - $350-$750";
  }
  return "30-Day Revenue Sprint - desde $3,500";
}

function captureAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    fbclid: params.get("fbclid") ?? "",
    gclid: params.get("gclid") ?? "",
  };
}

function trackLandingEvent(eventName: string, payload: Record<string, string>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    dataLayer?: Record<string, string>[];
    fbq?: (eventType: string, name: string, data?: Record<string, string>) => void;
  };
  w.dataLayer?.push({ event: eventName, ...payload });
  w.fbq?.("trackCustom", eventName, payload);
}

export function buildLandingContactPayload(formData: FormData) {
  const name = formString(formData, "name");
  const phone = formString(formData, "phone");
  const email = formString(formData, "email");
  const company = formString(formData, "company");
  const stage = formString(formData, "stage");
  const desiredOutcome = formString(formData, "desiredOutcome");
  const monthlyBudget = formString(formData, "monthlyBudget");
  const hasAdAccount = formString(formData, "hasAdAccount");
  const businessLink = formString(formData, "businessLink");
  const deadline = formString(formData, "deadline");
  const goal = formString(formData, "goal");
  const recommendedOffer =
    formString(formData, "recommendedOffer") || recommendOffer(stage, monthlyBudget);
  const attribution = captureAttribution();

  return {
    name,
    phone,
    email,
    company,
    stage: optionLabel(STAGE_OPTIONS, stage),
    desiredOutcome,
    monthlyBudget: optionLabel(BUDGET_OPTIONS, monthlyBudget),
    hasAdAccount,
    businessLink,
    deadline,
    goal,
    recommendedOffer,
    preferredContact: "Phone / WhatsApp",
    pageContext: "landing-growth-system-funnel",
    ...attribution,
    message: [
      "Growth system request from the Outlet Media segmented funnel.",
      stage ? `Stage: ${optionLabel(STAGE_OPTIONS, stage)}` : "Stage: n/a",
      desiredOutcome ? `Desired outcome: ${desiredOutcome}` : "Desired outcome: n/a",
      monthlyBudget ? `Monthly ad budget: ${optionLabel(BUDGET_OPTIONS, monthlyBudget)}` : "Monthly ad budget: n/a",
      hasAdAccount ? `Has ad account: ${hasAdAccount}` : "Has ad account: n/a",
      businessLink ? `Business link: ${businessLink}` : "Business link: n/a",
      deadline ? `Deadline: ${deadline}` : "Deadline: n/a",
      recommendedOffer ? `Recommended offer: ${recommendedOffer}` : "Recommended offer: n/a",
      goal ? `Notes: ${goal}` : "Notes: n/a",
    ].join("\n"),
  };
}

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState("never_ran_ads");
  const [monthlyBudget, setMonthlyBudget] = useState("not_sure");
  const startedRef = useRef(false);

  const recommendedOffer = useMemo(
    () => recommendOffer(stage, monthlyBudget),
    [stage, monthlyBudget],
  );

  useEffect(() => {
    function handleExternalStage(event: Event) {
      const nextStage = (event as CustomEvent<{ stage?: string }>).detail?.stage;
      if (!nextStage || !STAGE_OPTIONS.some((option) => option.value === nextStage)) {
        return;
      }

      setStage(nextStage);
      const nextOffer = recommendOffer(nextStage, monthlyBudget);
      trackLandingEvent("FunnelStageSelected", {
        stage: optionLabel(STAGE_OPTIONS, nextStage),
        recommendedOffer: nextOffer,
        source: "starting_point_card",
      });
    }

    window.addEventListener("outlet:setLandingStage", handleExternalStage);
    return () => window.removeEventListener("outlet:setLandingStage", handleExternalStage);
  }, [monthlyBudget]);

  function handleStageChange(value: string) {
    setStage(value);
    const nextOffer = recommendOffer(value, monthlyBudget);
    trackLandingEvent("FunnelStageSelected", {
      stage: optionLabel(STAGE_OPTIONS, value),
      recommendedOffer: nextOffer,
    });
    trackLandingEvent("OfferRecommended", {
      stage: optionLabel(STAGE_OPTIONS, value),
      recommendedOffer: nextOffer,
    });
  }

  function handleBudgetChange(value: string) {
    setMonthlyBudget(value);
    trackLandingEvent("OfferRecommended", {
      stage: optionLabel(STAGE_OPTIONS, stage),
      monthlyBudget: optionLabel(BUDGET_OPTIONS, value),
      recommendedOffer: recommendOffer(stage, value),
    });
  }

  function handleFormFocus() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackLandingEvent("LeadFormStarted", { source: "contact_form" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = e.currentTarget;
    const data = buildLandingContactPayload(new FormData(form));
    trackLandingEvent("LeadFormSubmitted", {
      stage: data.stage,
      recommendedOffer: data.recommendedOffer,
      monthlyBudget: data.monthlyBudget,
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Error al enviar");
      }
      setDone(true);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <section
        id="form"
        className="mt-16 scroll-mt-6 rounded-[16px] border border-[color:var(--landing-border)] bg-white/[0.025] p-6 lg:mt-24 lg:p-12"
      >
        <div className="mx-auto max-w-[760px]">
          <div className="text-center">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
              Solicitud recibida
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[3rem]">
              Ya sabemos tu punto de partida.
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
              Revisaremos tu información y te diremos la ruta real: setup, llamada
              privada, sprint o manejo completo. Si todavía no debes comprar, también
              te lo diremos.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {WHATSAPP_URL ? (
              <a
                href={WHATSAPP_URL}
                onClick={() => trackLandingEvent("WhatsAppClicked", { source: "success" })}
                className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] px-5 font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white"
              >
                Enviar link por WhatsApp
              </a>
            ) : null}
            <a
              href="#booking"
              onClick={() => trackLandingEvent("BookingClicked", { source: "success" })}
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.03] px-5 font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white"
            >
              Ver calendario
            </a>
          </div>

          {BOOKING_EMBED_URL ? (
            <div className="mt-8 overflow-hidden rounded-[12px] border border-[color:var(--landing-border)] bg-white/[0.02]">
              <iframe
                src={BOOKING_EMBED_URL}
                title="Agenda una llamada con Jaime Ortiz"
                className="h-[640px] w-full border-0"
                loading="lazy"
              />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <motion.section
        id="form"
        className="mt-8 scroll-mt-6 overflow-hidden rounded-[16px] border border-[color:var(--landing-border)] bg-gradient-to-b from-[rgba(30,31,184,0.08)] to-white/[0.015] p-4 lg:mt-14 lg:p-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
            Diagnóstico gratis · 2 min
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1] tracking-[-0.04em] text-white lg:text-[3rem]">
            Recibe tu ruta gratis.
          </h2>
          <p className="mt-3 max-w-[42ch] text-[14.5px] leading-relaxed text-[color:var(--landing-muted)] lg:mt-4 lg:text-[15px]">
            No tienes que saber Ads Manager. Dinos dónde estás y te digo qué comprar,
            qué no comprar y cuál debe ser el próximo movimiento.
          </p>
          <ul className="mt-4 grid gap-2 text-[13.5px] leading-relaxed text-[color:var(--landing-muted)]">
            <li className="rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.02] px-3 py-2">
              No necesitas tener ad account.
            </li>
            <li className="rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.02] px-3 py-2">
              Si ya boosteas, buscamos la fuga.
            </li>
            <li className="rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.02] px-3 py-2">
              Si no hay fit, no te vendo un sprint.
            </li>
          </ul>

          <div className="mt-5 rounded-[14px] border border-[color:var(--landing-brand-soft)]/35 bg-[rgba(30,31,184,0.12)] p-4 lg:mt-6 lg:p-5">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
              Ruta recomendada
            </p>
            <p className="mt-2 font-[family-name:var(--font-landing-heading)] text-[1.28rem] font-extrabold leading-tight tracking-[-0.025em] text-white lg:text-[1.45rem]">
              {recommendedOffer}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[color:var(--landing-muted)]">
              Esta recomendación puede cambiar después de ver tu oferta, presupuesto,
              urgencia y ruta de conversión.
            </p>
          </div>
        </div>

        <form
          className="grid gap-3 lg:grid-cols-2"
          data-testid="landing-contact-form"
          onFocus={handleFormFocus}
          onSubmit={handleSubmit}
        >
          <select
            name="stage"
            aria-label="Punto de partida"
            value={stage}
            required
            className={`${INPUT_CLS} lg:col-span-2`}
            onChange={(e) => handleStageChange(e.target.value)}
          >
            {STAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="desiredOutcome"
            aria-label="Qué necesitas generar"
            defaultValue=""
            required
            className={INPUT_CLS}
          >
            <option value="">Qué necesitas generar...</option>
            {OUTCOME_OPTIONS.map((outcome) => (
              <option key={outcome}>{outcome}</option>
            ))}
          </select>
          <select
            name="monthlyBudget"
            aria-label="Presupuesto mensual en ads"
            value={monthlyBudget}
            required
            className={INPUT_CLS}
            onChange={(e) => handleBudgetChange(e.target.value)}
          >
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="hasAdAccount"
            aria-label="Tienes cuenta de anuncios"
            defaultValue=""
            required
            className={INPUT_CLS}
          >
            <option value="">Tienes ad account?</option>
            <option>No, empiezo desde cero</option>
            <option>Sí, pero no sé si está bien</option>
            <option>Sí, ya estoy corriendo campañas</option>
            <option>No sé todavía</option>
          </select>
          <input
            type="text"
            name="company"
            placeholder="Negocio / marca / artista / evento"
            autoComplete="organization"
            required
            className={INPUT_CLS}
          />
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            autoComplete="name"
            required
            className={INPUT_CLS}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono / WhatsApp"
            autoComplete="tel"
            required
            className={INPUT_CLS}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            required
            className={INPUT_CLS}
          />
          <details className="rounded-[12px] border border-[color:var(--landing-border)] bg-white/[0.018] p-3 lg:col-span-2">
            <summary className="cursor-pointer list-none font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white marker:hidden">
              Agregar Instagram, fecha o notas
            </summary>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <input
                type="url"
                name="businessLink"
                placeholder="Instagram, website, tienda o ticket link"
                className={`${INPUT_CLS} lg:col-span-2`}
              />
              <input
                type="text"
                name="deadline"
                placeholder="Fecha clave o urgencia"
                className={INPUT_CLS}
              />
              <textarea
                name="goal"
                placeholder="Qué está pasando ahora? Ej: necesito 20 citas, boosteo pero no recibo mensajes..."
                className={`${TEXTAREA_CLS} lg:col-span-2`}
              />
            </div>
          </details>
          <input type="hidden" name="recommendedOffer" value={recommendedOffer} />
          <button
            type="submit"
            disabled={pending}
            className="mt-2 inline-flex h-[58px] w-full items-center justify-center gap-2 rounded-[10px] bg-[color:var(--landing-brand)] px-5 font-[family-name:var(--font-landing-heading)] text-sm font-bold tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(30,31,184,0.55)] disabled:opacity-60 lg:col-span-2"
          >
            {pending ? "Enviando..." : "Recibir mi ruta gratis"}
          </button>
          {error ? (
            <p className="mt-2 text-center text-[13px] text-red-400 lg:col-span-2">{error}</p>
          ) : (
            <p className="mt-2 text-center font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.08em] text-[color:var(--landing-muted-2)] lg:col-span-2">
              Todos pueden empezar · no todos necesitan el mismo servicio
            </p>
          )}
        </form>
      </div>
    </motion.section>
  );
}
