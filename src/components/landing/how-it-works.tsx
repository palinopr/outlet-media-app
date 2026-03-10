"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  CalendarDays,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

const STEPS = [
  {
    label: "Observe",
    title: "Pull signal from campaigns and live event demand",
    description:
      "Meta delivery, ticket velocity, and response pressure land in the same operating layer instead of living in separate tabs.",
    icon: Megaphone,
  },
  {
    label: "Diagnose",
    title: "Surface what matters in the campaign or event itself",
    description:
      "The product turns raw signal into status, blockers, pressure, and next-step context that clients and operators can actually use.",
    icon: Activity,
  },
  {
    label: "Coordinate",
    title: "Route approvals, comments, and follow-through",
    description:
      "When a decision needs human input, the approval path stays attached to the work instead of getting buried in email or chat.",
    icon: ShieldCheck,
  },
  {
    label: "Execute",
    title: "Let operators or agents move the next action forward",
    description:
      "Bounded agents can draft work, request approval, and log outcomes so every step is visible after it happens.",
    icon: Bot,
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section id="workflow" className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Workflow</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          The operating loop is visible end to end.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          Outlet is designed so an important change can turn into visible
          follow-through instead of becoming one more thing someone has to
          remember to relay manually.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-4 lg:grid-cols-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.06,
              }}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-[#4aa8ff] via-cyan-300 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-white/10 bg-[#081421] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">
                  {step.label}
                </span>
                <div className="rounded-2xl bg-white/[0.05] p-3 text-[#9bd0ff]">
                  <Icon className="size-5" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#081421]/80 px-4 py-3 text-sm text-slate-300"
      >
        <CalendarDays className="size-4 shrink-0 text-[#9bd0ff]" />
        Every outcome can be written back as activity, approval, or next-step
        work instead of disappearing into a status meeting.
      </motion.div>
    </section>
  );
}
