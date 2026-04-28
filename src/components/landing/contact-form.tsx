"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const INPUT_CLS =
  "h-[54px] w-full rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.02] px-[18px] text-[15px] text-white placeholder:text-[color:var(--landing-muted-2)] focus:border-[rgba(30,31,184,0.5)] focus:bg-[rgba(30,31,184,0.04)] focus:outline-none";

const TEXTAREA_CLS =
  "min-h-[110px] w-full rounded-[10px] border border-[color:var(--landing-border)] bg-white/[0.02] px-[18px] py-4 text-[15px] text-white placeholder:text-[color:var(--landing-muted-2)] focus:border-[rgba(30,31,184,0.5)] focus:bg-[rgba(30,31,184,0.04)] focus:outline-none";

const RAW_BOOKING_URL = process.env.NEXT_PUBLIC_AUDIT_BOOKING_URL?.trim();
const BOOKING_EMBED_URL = RAW_BOOKING_URL
  ? `${RAW_BOOKING_URL}${RAW_BOOKING_URL.includes("?") ? "&" : "?"}embed=true&theme=dark`
  : null;
const WHATSAPP_AUDIT_URL =
  "https://wa.me/13053225709?text=Quiero%20agendar%20mi%20auditor%C3%ADa%20gratis%20de%20ads";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function buildLandingContactPayload(formData: FormData) {
  const name = formString(formData, "name");
  const phone = formString(formData, "phone");
  const email = formString(formData, "email");
  const company = formString(formData, "company");
  const monthlyBudget = formString(formData, "monthlyBudget");
  const goal = formString(formData, "goal");

  return {
    name,
    phone,
    email,
    company,
    monthlyBudget,
    goal,
    preferredContact: "WhatsApp",
    pageContext: "landing-audit-funnel",
    message: [
      "Fallback audit request from the Outlet Media landing funnel.",
      goal ? `Visitor goal: ${goal}` : "Visitor goal: n/a",
      company ? `Business/event: ${company}` : "Business/event: n/a",
      monthlyBudget ? `Monthly ad budget: ${monthlyBudget}` : "Monthly ad budget: n/a",
    ].join("\n"),
  };
}

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = e.currentTarget;
    const data = buildLandingContactPayload(new FormData(form));

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
        className="mt-16 scroll-mt-6 rounded-[16px] border border-[color:var(--landing-border)] p-6 lg:mt-24 lg:p-12"
      >
        <div className="mx-auto max-w-[720px]">
          <div className="text-center">
            <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
              Solicitud recibida
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold tracking-[-0.035em] text-white">
              Agenda tu llamada ahora mismo.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
              Escoge un bloque que te funcione. Si prefieres, te llamo yo al WhatsApp que
              dejaste — menos de 24h laborables.
            </p>
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
          ) : (
            <a
              href={WHATSAPP_AUDIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-8 flex h-12 max-w-[320px] items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] px-5 font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white"
            >
              Agendar por WhatsApp
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id="form"
      className="mt-8 scroll-mt-6 overflow-hidden rounded-[16px] border border-[color:var(--landing-border)] bg-gradient-to-b from-[rgba(30,31,184,0.04)] to-transparent p-5 lg:mt-10 lg:p-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-[620px]">
        <p className="text-center font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Si no puedes escoger hora ahora
        </p>
        <h2 className="mt-3 text-center font-[family-name:var(--font-landing-heading)] text-[2.15rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-white lg:text-[2.75rem]">
          Envía tu cuenta para auditoría.
        </h2>
        <p className="mx-auto mt-4 max-w-[48ch] text-center text-[15px] leading-relaxed text-[color:var(--landing-muted)]">
          Déjanos los datos clave y te contactamos en menos de 24h laborables.
        </p>

        <form
          className="mt-7 grid gap-3 lg:grid-cols-2"
          data-testid="landing-contact-form"
          onSubmit={handleSubmit}
        >
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
            placeholder="WhatsApp"
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
          <input
            type="text"
            name="company"
            placeholder="Negocio / artista / evento"
            autoComplete="organization"
            required
            className={INPUT_CLS}
          />
          <select
            name="monthlyBudget"
            aria-label="Presupuesto mensual en ads"
            defaultValue=""
            required
            className={INPUT_CLS}
          >
            <option value="">Presupuesto mensual en ads...</option>
            <option>&lt; $1K</option>
            <option>$1K — $5K</option>
            <option>$5K — $20K</option>
            <option>$20K+</option>
            <option>Prefiero no decir</option>
          </select>
          <textarea
            name="goal"
            placeholder="¿Qué quieres mejorar?"
            className={`${TEXTAREA_CLS} lg:row-span-2`}
          />
          <button
            type="submit"
            disabled={pending}
            className="mt-3 inline-flex h-[58px] w-full items-center justify-center gap-2 rounded-[10px] bg-[color:var(--landing-brand)] font-[family-name:var(--font-landing-heading)] text-sm font-bold tracking-wide text-white shadow-[0_16px_40px_-12px_rgba(30,31,184,0.55)] disabled:opacity-60 lg:col-span-2"
          >
            {pending ? "Enviando..." : "Enviar mi cuenta para auditoría"}
          </button>
          {error ? (
            <p className="mt-2 text-center text-[13px] text-red-400 lg:col-span-2">{error}</p>
          ) : (
            <p className="mt-2 text-center font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.08em] text-[color:var(--landing-muted-2)] lg:col-span-2">
              Menos de 24h laborables · sin contrato · sin spam
            </p>
          )}
        </form>
      </div>
    </motion.section>
  );
}
