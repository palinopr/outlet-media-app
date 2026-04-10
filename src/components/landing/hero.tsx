"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  MousePointerClick,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PROOF_PILLS = [
  "20 connected ad accounts reviewed",
  "1.6K+ historical campaigns visible",
  "Puerto Rico-first positioning",
  "Built for mobile traffic",
] as const;

const FUNNEL_STEPS = [
  {
    label: "Ad click",
    detail: "Meta, Google, or TikTok traffic hits one clear angle instead of a messy homepage.",
    icon: MousePointerClick,
  },
  {
    label: "Mobile page",
    detail: "Short copy, fast load, strong proof, and one primary CTA above the fold.",
    icon: Sparkles,
  },
  {
    label: "Qualified lead",
    detail: "We capture who they are, what they want, and whether the budget and fit make sense.",
    icon: BadgeCheck,
  },
  {
    label: "Appointment",
    detail: "The prospect gets pushed toward a call request instead of drifting after the click.",
    icon: CalendarDays,
  },
] as const;

const CATEGORY_NOTES = [
  "Artists and entertainment",
  "Eventos y nightlife",
  "Ecommerce y retail",
  "Servicios locales y lead-gen",
] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-18 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px]" aria-hidden>
        <motion.div
          animate={{ x: [0, 32, -12, 0], y: [0, -22, 14, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[3%] top-[8%] h-72 w-72 rounded-full bg-[#4aa8ff]/22 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -28, 18, 0], y: [0, 24, -20, 0], scale: [0.96, 1.04, 1, 0.96] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[6%] top-[12%] h-64 w-64 rounded-full bg-[#f97316]/18 blur-[110px]"
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.94fr] lg:items-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-[#4aa8ff]/20 bg-[#4aa8ff]/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#9bd0ff] sm:text-xs"
          >
            <Sparkles className="size-3.5" />
            Puerto Rico lead funnels
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="mt-5 max-w-3xl text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
          >
            Convierte clicks en citas, leads y ventas.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.14 }}
            className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            Si tus anuncios están generando tráfico pero la página no convierte en el teléfono,
            el presupuesto se está escapando. Outlet arma el ángulo del anuncio, la landing
            mobile-first y el camino hacia la cita para marcas, artistas, eventos y negocios en
            Puerto Rico.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.22 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[#4aa8ff] px-6 text-base font-semibold text-[#06111d] hover:bg-[#72beff]"
            >
              <a href="#contact">
                Solicitar auditoría
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 rounded-full border-white/15 bg-white/[0.03] px-6 text-base text-slate-100 hover:bg-white/[0.08]"
            >
              <a href="tel:+13053225709">
                <PhoneCall className="size-4" />
                Llamar ahora
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.28 }}
            className="mt-7 flex flex-wrap gap-2"
          >
            {PROOF_PILLS.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-slate-200"
              >
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.34 }}
            className="mt-7 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-[#9bd0ff]">Best fit</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORY_NOTES.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-[#081421]/92 px-3 py-1.5 text-sm text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: "easeOut", delay: 0.18 }}
          className="relative lg:justify-self-end"
        >
          <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-[#4aa8ff]/18 via-transparent to-[#f97316]/16 blur-3xl" />
          <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.05] p-3 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.82)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#081421]/95">
              <div className="relative aspect-[1.15/0.72] border-b border-white/10">
                <Image
                  src="/images/landing/tour-artist.png"
                  alt="Mobile-first campaign creative"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04111c] via-[#04111c]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9bd0ff]">
                    Mobile pressure
                  </p>
                  <p className="mt-2 max-w-sm text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
                    El click tiene que llegar a una página que cierre, no a una página que distraiga.
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#fbbf94]">
                    Fresh inventory snapshot
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-[#06101b] p-3">
                      <p className="text-2xl font-bold tracking-tight text-white">20</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                        accessible ad accounts
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#06101b] p-3">
                      <p className="text-2xl font-bold tracking-tight text-white">1,683</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                        visible campaigns
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">
                    Ad click to appointment
                  </p>
                  <div className="mt-4 space-y-3">
                    {FUNNEL_STEPS.map((step) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.label}
                          className="flex gap-3 rounded-2xl border border-white/10 bg-[#06101b] p-3"
                        >
                          <div className="rounded-2xl bg-[#4aa8ff]/12 p-2.5 text-[#9bd0ff]">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{step.label}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-300">{step.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
