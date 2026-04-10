"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <section id="audit-form" className="px-5 py-6 text-white sm:px-6">
      <div className="rounded-[28px] border border-[#f59e0b]/22 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.28),transparent_30%),radial-gradient(circle_at_top_left,rgba(31,94,255,0.22),transparent_28%),linear-gradient(180deg,rgba(11,24,45,1)_0%,rgba(7,20,39,1)_100%)] p-5 shadow-[0_0_0_1px_rgba(245,158,11,0.08),0_30px_70px_-34px_rgba(245,158,11,0.5)]">
        <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          Auditoría estratégica
        </p>
        <h2 className="mt-4 text-[2.1rem] font-semibold leading-[1.02] tracking-tight text-white">
          Agenda tu auditoría con un operador.
        </h2>
        <p className="mt-3 text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
          Revisamos fugas, ángulo creativo, funnel y reporting. Sin decks eternos. Sin vendedores.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input type="hidden" name="pageContext" value="landing-audit-funnel" />
          <input type="hidden" name="message" value="Audit request from the Outlet Media landing funnel." />

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
            className="mt-2 h-12 w-full rounded-full bg-[#1f5eff] text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] hover:bg-[#184de0]"
            disabled={pending}
          >
            {pending ? "Enviando..." : "Solicitar auditoría"}
          </Button>
          <p className="flex items-start gap-2 text-xs leading-5 text-slate-300">
            <span className="mt-0.5 text-amber-300">•</span>
            <span>
              Tu auditoría será con un operador senior, no con un vendedor. 100%
              confidencial.
            </span>
          </p>
        </form>
      </div>
    </section>
  );
}
