"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { trackLandingEvent } from "./analytics";

const INPUT_CLS =
  "h-[60px] w-full rounded-[12px] border border-[#d8d8d0] bg-white px-[18px] text-[16px] font-medium text-[#101010] placeholder:text-[#77756d] focus:border-[color:var(--landing-brand)] focus:bg-white focus:outline-none";

const TEXTAREA_CLS =
  "min-h-[124px] w-full rounded-[12px] border border-[#d8d8d0] bg-white px-[18px] py-4 text-[16px] font-medium text-[#101010] placeholder:text-[#77756d] focus:border-[color:var(--landing-brand)] focus:bg-white focus:outline-none";

const FIELD_CLS = "grid gap-1.5";
const LABEL_CLS =
  "font-[family-name:var(--font-landing-heading)] text-[13px] font-extrabold text-[#2f2d27]";

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
  if (stage === "sells_tickets") return "Sprint de boletos - desde $5,000";
  if (stage === "run_everything" || monthlyBudget === "20000_plus") {
    return "Manejo mensual - desde $3,000/mes";
  }
  if (stage === "never_ran_ads") {
    return monthlyBudget === "under_500" || monthlyBudget === "not_sure"
      ? "Llamada privada - $350-$750"
      : "Setup de anuncios - desde $1,500";
  }
  if (stage === "boosting_posts") return "Arreglo de anuncios - desde $2,500";
  if (stage === "needs_leads") return "Sprint de leads - desde $3,500";
  if (stage === "sells_products") return "Sprint de ecommerce - desde $4,500";
  if (monthlyBudget === "under_500" || monthlyBudget === "not_sure") {
    return "Llamada privada - $350-$750";
  }
  return "Sprint de ventas 30 días - desde $3,500";
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
    trackLandingEvent("LeadFormSubmitAttempt", {
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
      trackLandingEvent("LeadFormSubmitted", {
        stage: data.stage,
        recommendedOffer: data.recommendedOffer,
        monthlyBudget: data.monthlyBudget,
      });
      form.reset();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error al enviar";
      trackLandingEvent("LeadFormSubmitFailed", {
        stage: data.stage,
        recommendedOffer: data.recommendedOffer,
        error: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <section
        id="form"
        className="mt-16 scroll-mt-6 rounded-[18px] border border-white/10 bg-[#f3f1e8] p-6 text-[#101010] shadow-[0_30px_80px_-48px_rgba(255,255,255,0.5)] lg:mt-24 lg:p-12"
      >
        <div className="mx-auto max-w-[760px]">
          <div className="text-center">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand)]">
              Solicitud recibida
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-[1] tracking-[-0.035em] text-[#101010] lg:text-[3rem]">
              Ya sabemos tu punto de partida.
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[#4b4942]">
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
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#d8d8d0] bg-white px-5 font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-[#101010]"
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
        className="mt-8 scroll-mt-6 overflow-hidden rounded-[18px] border border-white/10 bg-[#f3f1e8] p-4 text-[#101010] shadow-[0_30px_90px_-54px_rgba(255,255,255,0.55)] lg:mt-14 lg:p-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-brand)]">
            Diagnóstico gratis · 2 min
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2.12rem] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#101010] lg:text-[3rem]">
            Dinos dónde se está perdiendo la venta.
          </h2>
          <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-[#4b4942] lg:mt-4">
            No tienes que saber Ads Manager. Marca tu punto de partida y te devolvemos
            una recomendación concreta: setup, arreglo de campañas, sprint de 30 días
            o manejo mensual.
          </p>
          <ul className="mt-4 grid gap-2 text-[14px] leading-relaxed text-[#3e3c35]">
            <li className="rounded-[10px] border border-[#d8d8d0] bg-white px-3 py-2">
              Puedes empezar sin cuenta publicitaria.
            </li>
            <li className="rounded-[10px] border border-[#d8d8d0] bg-white px-3 py-2">
              Si ya inviertes, revisamos campaña, oferta y seguimiento.
            </li>
            <li className="rounded-[10px] border border-[#d8d8d0] bg-white px-3 py-2">
              La recomendación no te obliga a comprar.
            </li>
          </ul>

          <div className="mt-5 rounded-[14px] border border-[rgba(30,31,184,0.18)] bg-white p-4 shadow-[0_18px_50px_-38px_rgba(13,13,13,0.7)] lg:mt-6 lg:p-5">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-brand)]">
              Ruta que probablemente aplica
            </p>
            <p className="mt-2 font-[family-name:var(--font-landing-heading)] text-[1.32rem] font-extrabold leading-tight tracking-[-0.025em] text-[#101010] lg:text-[1.45rem]">
              {recommendedOffer}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#5d5a52]">
              Esta recomendación puede cambiar después de ver tu oferta, presupuesto,
              urgencia y ruta de conversión.
            </p>
          </div>
        </div>

        <form
          className="grid gap-4"
          data-testid="landing-contact-form"
          onFocus={handleFormFocus}
          onSubmit={handleSubmit}
        >
          <div className="grid gap-3 lg:grid-cols-2">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-brand)] lg:col-span-2">
              1. Qué necesitas
            </p>
            <label className={`${FIELD_CLS} lg:col-span-2`}>
              <span className={LABEL_CLS}>Punto de partida</span>
              <select
                name="stage"
                value={stage}
                required
                className={INPUT_CLS}
                onChange={(e) => handleStageChange(e.target.value)}
              >
                {STAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={FIELD_CLS}>
              <span className={LABEL_CLS}>Resultado que necesitas</span>
              <select
                name="desiredOutcome"
                defaultValue=""
                required
                className={INPUT_CLS}
              >
                <option value="">Selecciona uno...</option>
                {OUTCOME_OPTIONS.map((outcome) => (
                  <option key={outcome}>{outcome}</option>
                ))}
              </select>
            </label>
            <label className={FIELD_CLS}>
              <span className={LABEL_CLS}>Presupuesto mensual en ads</span>
              <select
                name="monthlyBudget"
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
            </label>
            <label className={FIELD_CLS}>
              <span className={LABEL_CLS}>Teléfono / WhatsApp</span>
              <input
                type="tel"
                name="phone"
                placeholder="787 000 0000"
                autoComplete="tel"
                required
                className={INPUT_CLS}
              />
            </label>
            <label className={FIELD_CLS}>
              <span className={LABEL_CLS}>Cuenta de anuncios</span>
              <select name="hasAdAccount" defaultValue="" className={INPUT_CLS}>
                <option value="">No sé todavía</option>
                <option>No, empiezo desde cero</option>
                <option>Sí, pero no sé si está bien</option>
                <option>Sí, ya estoy corriendo campañas</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 border-t border-[#d8d8d0] pt-4 lg:grid-cols-2">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-brand)] lg:col-span-2">
              2. Datos para responderte
            </p>
            <label className={FIELD_CLS}>
              <span className={LABEL_CLS}>Negocio / marca / evento</span>
              <input
                type="text"
                name="company"
                placeholder="Nombre del negocio"
                autoComplete="organization"
                required
                className={INPUT_CLS}
              />
            </label>
            <label className={FIELD_CLS}>
              <span className={LABEL_CLS}>Tu nombre</span>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                autoComplete="name"
                required
                className={INPUT_CLS}
              />
            </label>
            <label className={`${FIELD_CLS} lg:col-span-2`}>
              <span className={LABEL_CLS}>Email</span>
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                autoComplete="email"
                required
                className={INPUT_CLS}
              />
            </label>
          </div>

          <details className="rounded-[12px] border border-[#d8d8d0] bg-white p-3">
            <summary className="cursor-pointer list-none font-[family-name:var(--font-landing-heading)] text-[15px] font-extrabold text-[#101010] marker:hidden">
              Agregar Instagram, fecha o notas
            </summary>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <label className={`${FIELD_CLS} lg:col-span-2`}>
                <span className={LABEL_CLS}>Instagram, website, tienda o ticket link</span>
                <input
                  type="text"
                  name="businessLink"
                  placeholder="@negocio o https://..."
                  className={INPUT_CLS}
                />
              </label>
              <label className={FIELD_CLS}>
                <span className={LABEL_CLS}>Fecha clave o urgencia</span>
                <input
                  type="text"
                  name="deadline"
                  placeholder="Ej: junio 15, este mes, ASAP"
                  className={INPUT_CLS}
                />
              </label>
              <label className={`${FIELD_CLS} lg:col-span-2`}>
                <span className={LABEL_CLS}>Qué está pasando ahora</span>
                <textarea
                  name="goal"
                  placeholder="Ej: necesito 20 citas, boosteo pero no recibo mensajes..."
                  className={TEXTAREA_CLS}
                />
              </label>
            </div>
          </details>
          <input type="hidden" name="recommendedOffer" value={recommendedOffer} />
          <button
            type="submit"
            disabled={pending}
            className="mt-1 inline-flex h-[64px] w-full items-center justify-center gap-2 rounded-[12px] bg-[color:var(--landing-brand)] px-5 font-[family-name:var(--font-landing-heading)] text-[16px] font-extrabold tracking-wide text-white shadow-[0_22px_50px_-20px_rgba(30,31,184,0.78)] disabled:opacity-60"
          >
            {pending ? "Enviando..." : "Recibir diagnóstico gratis"}
          </button>
          {error ? (
            <p className="mt-1 text-center text-[13px] text-red-600">{error}</p>
          ) : (
            <p className="mt-1 text-center text-[13px] font-semibold text-[#6b675d]">
              Respuesta humana en menos de 24h laborables
            </p>
          )}
        </form>
      </div>
    </motion.section>
  );
}
