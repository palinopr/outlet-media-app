"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CTA_OUTCOMES = [
  {
    title: "Fugas",
    body: "Dónde se está yendo el dinero o la claridad operativa.",
  },
  {
    title: "Creativos",
    body: "Qué pieza está moviendo resultado y cuál no.",
  },
  {
    title: "Plan",
    body: "Qué mover primero después de la llamada.",
  },
] as const;

const CTA_STEPS = ["Comparte contexto", "Auditamos live", "Sales con plan"] as const;

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

      toast.success("Solicitud enviada. Te contactamos para coordinar la auditoría.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="audit-form" className="px-5 py-7 text-white sm:px-6">
      <div className="rounded-[28px] border border-[#f59e0b]/22 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.28),transparent_30%),radial-gradient(circle_at_top_left,rgba(31,94,255,0.22),transparent_28%),linear-gradient(180deg,rgba(11,24,45,1)_0%,rgba(7,20,39,1)_100%)] p-5 shadow-[0_0_0_1px_rgba(245,158,11,0.08),0_30px_70px_-34px_rgba(245,158,11,0.5)] sm:p-6">
        <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-300 sm:text-[10px]">
          Auditoría estratégica
        </p>
        <h2 className="mt-4 max-w-[12ch] text-[2rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.15rem]">
          Si estás gastando y nadie te puede decir qué mueve revenue, hablemos.
        </h2>
        <p className="mt-3 max-w-[22rem] text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
          En 30 minutos te digo dónde está la fuga, qué creativo está empujando y qué mover primero
          sin perder otra semana.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            "30 min",
            "100% confidencial",
            "Meta + ticketing",
          ].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {CTA_OUTCOMES.map((item) => (
            <div
              key={item.title}
              className="landing-card-hover rounded-[20px] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <CheckCircle2 className="size-4 text-[#8fd4ff]" />
              <p className="mt-3 text-[14px] font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-[13px] leading-6 text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="landing-card-hover mt-6 rounded-[24px] border border-white/10 bg-[#08111f]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:p-5">
          <div className="grid grid-cols-3 gap-2">
            {CTA_STEPS.map((step, index) => (
              <div
                key={step}
                className="landing-card-hover rounded-[16px] border border-white/8 bg-white/[0.03] px-3 py-2 text-center"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8fd4ff]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-slate-300">{step}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <input type="hidden" name="pageContext" value="landing-audit-funnel" />
            <input
              type="hidden"
              name="message"
              value="Audit request from the Outlet Media landing funnel."
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                name="name"
                placeholder="Nombre"
                required
                maxLength={200}
                className="h-11 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
              />
              <Input
                name="email"
                type="email"
                placeholder="Email corporativo"
                required
                maxLength={320}
                className="h-11 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
              />
            </div>
            <Input
              name="phone"
              type="tel"
              placeholder="Teléfono"
              required
              maxLength={40}
              className="h-11 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
            />
            <Input
              name="website"
              placeholder="Website / link"
              maxLength={240}
              className="h-11 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
            />

            <Button
              type="submit"
              size="lg"
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1f5eff] text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] hover:bg-[#184de0]"
              disabled={pending}
            >
              {pending ? "Enviando..." : "Solicitar auditoría"}
              {pending ? null : <ArrowRight className="size-4" />}
            </Button>
            <p className="mt-1 flex items-start gap-2 text-xs leading-5 text-slate-300">
              <span className="mt-0.5 text-amber-300">•</span>
              <span>
                Tu auditoría será con un operador senior, no con un vendedor. 100%
                confidencial.
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
