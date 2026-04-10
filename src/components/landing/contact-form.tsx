"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Mail, PhoneCall, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GOAL_OPTIONS = [
  "Booked calls / appointments",
  "Qualified leads",
  "Ticket sales",
  "Ecommerce sales",
  "Need help figuring out the funnel",
] as const;

const BUDGET_OPTIONS = [
  "Under $1,500 / month",
  "$1,500 - $5,000 / month",
  "$5,000 - $15,000 / month",
  "$15,000+ / month",
  "Need to discuss first",
] as const;

const CONTACT_OPTIONS = ["Call", "Email"] as const;

export function ContactForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong");
      }

      toast.success("Request sent. We’ll reach out to coordinate the call.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-5 sm:p-8 lg:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <div>
            <p className="section-label text-[#9bd0ff]">Contact</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Solicita la cita y te devolvemos la llamada con contexto.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              This funnel is meant to open a serious conversation, not dump you into a generic lead
              form. Tell us what you sell, what the goal is, and where the current path is leaking.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "We review your goal, current traffic path, and whether the offer fits a call-based funnel.",
                "If there is fit, we use the submission to guide the first conversation instead of starting cold.",
                "If the leak is obvious, we can point to where the mobile path is losing people fastest.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#9bd0ff]" />
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href="tel:+13053225709"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#081421]/92 px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-white/[0.06]"
              >
                <PhoneCall className="size-4 text-[#9bd0ff]" />
                +1 (305) 322-5709
              </a>
              <a
                href="mailto:support@outletmedia.co"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#081421]/92 px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-white/[0.06]"
              >
                <Mail className="size-4 text-[#9bd0ff]" />
                support@outletmedia.co
              </a>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#f97316]/18 bg-[#0b1622] p-5">
              <div className="flex items-center gap-2 text-[#fbbf94]">
                <CalendarDays className="size-4" />
                <p className="text-xs uppercase tracking-[0.22em]">Call expectation</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The first call should quickly answer three questions: where the funnel is leaking,
                what needs to change on mobile, and whether the next 30 days make sense together.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/10 bg-[#081421]/90 p-5 sm:p-7"
          >
            <input type="hidden" name="pageContext" value="landing-pr-funnel" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="name"
                placeholder="Nombre"
                required
                maxLength={200}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
              />
              <Input
                name="email"
                type="email"
                placeholder="correo@empresa.com"
                required
                maxLength={320}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Teléfono"
                maxLength={40}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
              />
              <Input
                name="company"
                placeholder="Negocio / marca"
                maxLength={200}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <select
                name="goal"
                required
                defaultValue=""
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none transition-[box-shadow,border-color] focus-visible:border-[#4aa8ff]/50 focus-visible:ring-4 focus-visible:ring-[#4aa8ff]/15"
              >
                <option value="" disabled className="bg-[#081421] text-slate-500">
                  Meta principal
                </option>
                {GOAL_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#081421] text-slate-100">
                    {option}
                  </option>
                ))}
              </select>

              <select
                name="monthlyBudget"
                defaultValue=""
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none transition-[box-shadow,border-color] focus-visible:border-[#4aa8ff]/50 focus-visible:ring-4 focus-visible:ring-[#4aa8ff]/15"
              >
                <option value="" className="bg-[#081421] text-slate-500">
                  Presupuesto mensual
                </option>
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#081421] text-slate-100">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <select
                name="preferredContact"
                defaultValue=""
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none transition-[box-shadow,border-color] focus-visible:border-[#4aa8ff]/50 focus-visible:ring-4 focus-visible:ring-[#4aa8ff]/15"
              >
                <option value="" className="bg-[#081421] text-slate-500">
                  Preferencia de contacto
                </option>
                {CONTACT_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#081421] text-slate-100">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <textarea
                name="message"
                placeholder="Cuéntanos qué estás promocionando, a quién quieres llegar, qué anuncios ya corren y dónde sientes que el funnel se está cayendo."
                required
                maxLength={5000}
                rows={6}
                className="min-h-40 w-full rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-[box-shadow,border-color] focus-visible:border-[#4aa8ff]/50 focus-visible:ring-4 focus-visible:ring-[#4aa8ff]/15"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-4 h-12 w-full rounded-full bg-[#4aa8ff] text-base font-semibold text-[#06111d] hover:bg-[#72beff]"
              disabled={pending}
            >
              <Send className="size-4" />
              {pending ? "Enviando..." : "Solicitar cita"}
            </Button>
            <p className="mt-3 text-xs leading-6 text-slate-400">
              We use this submission to understand fit and coordinate the call — not to dump you in a
              generic nurture queue.
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
