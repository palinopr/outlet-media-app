"use client";

import { motion } from "framer-motion";
import { CalendarCheck2, Gauge, MessageSquareText, Smartphone } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Smartphone,
    title: "Thumb-first layout",
    description:
      "Big targets, short sections, sticky CTA behavior, and no dependence on desktop-style scanning.",
  },
  {
    icon: MessageSquareText,
    title: "Fast clarity",
    description:
      "The buyer should understand the problem, the offer, and the next action inside the first minute.",
  },
  {
    icon: CalendarCheck2,
    title: "Appointment intent",
    description:
      "Every section should help the visitor feel ready to request a call, not just casually browse.",
  },
  {
    icon: Gauge,
    title: "Better signal",
    description:
      "The form captures enough context to tell whether the lead is serious before the conversation starts.",
  },
] as const;

const FIT_MARKETS = [
  "Artists & labels",
  "Eventos y nightlife",
  "Ecommerce & retail",
  "Real estate & solar",
  "Servicios locales",
  "Founders with paid traffic already running",
] as const;

export function LandingStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Conversion rules</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Funnel-type page, not an agency brochure.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          The page is built to qualify, reassure, and move the visitor into action — especially on a
          phone where patience is short and the next swipe is always close.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {PRINCIPLES.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="rounded-2xl bg-[#4aa8ff]/12 p-3 text-[#9bd0ff] w-fit">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        className="mt-8 rounded-[32px] border border-white/10 bg-[#081421]/92 p-6 sm:p-8"
      >
        <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">Best fit markets</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {FIT_MARKETS.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-200"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
