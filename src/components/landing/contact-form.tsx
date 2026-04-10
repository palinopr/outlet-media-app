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
    <section id="audit-form" className="px-4 py-6 text-white sm:px-5">
      <div className="rounded-[24px] border border-[#f59e0b]/22 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.2),transparent_30%),radial-gradient(circle_at_top_left,rgba(31,94,255,0.2),transparent_28%),linear-gradient(180deg,rgba(11,24,45,1)_0%,rgba(7,20,39,1)_100%)] p-5 shadow-[0_26px_60px_-36px_rgba(245,158,11,0.45)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
          Urgent final CTA block
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Deja de adivinar. Agenda tu auditoría.
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-300">
          Si inviertes en paid media en PR y quieres más visibilidad y mejor ROI, hablemos 30
          minutos.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input type="hidden" name="pageContext" value="landing-audit-funnel" />
          <input type="hidden" name="message" value="Audit request from the Outlet Media landing funnel." />

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
          <p className="text-xs leading-6 text-slate-400">
            Tu auditoría será con un operador senior, no con un vendedor. 100% confidencial.
          </p>
        </form>
      </div>
    </section>
  );
}
