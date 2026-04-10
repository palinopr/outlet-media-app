"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays, ChartNoAxesCombined, ShieldCheck, Star } from "lucide-react";

const SNAPSHOT_STATS = [
  {
    value: "20",
    label: "accessible Meta ad accounts in the current inventory snapshot",
  },
  {
    value: "1,683",
    label: "historical campaigns visible across those connected accounts",
  },
  {
    value: "PR-first",
    label: "positioning built for Puerto Rico buyers, founders, promoters, and local operators",
  },
  {
    value: "1 CTA",
    label: "direct-response bias: one main action instead of a menu of distractions",
  },
] as const;

const RECOGNIZABLE_NAMES = [
  "Rauw Alejandro",
  "Duars",
  "Beamina",
  "TPPR Solar",
  "Don Omar",
  "Ivy Queen",
] as const;

const OUTCOME_PROOF = [
  {
    name: "Rauw Alejandro",
    value: "370K+",
    label: "tickets sold",
    detail: "World-tour proof already present in the approved Outlet materials.",
  },
  {
    name: "Don Omar",
    value: "99.38%",
    label: "sell-through",
    detail: "Recognizable performance proof used to show execution under real pressure.",
  },
  {
    name: "Vaqueros de Bayamón",
    value: "13.6",
    label: "ROAS",
    detail: "Named Puerto Rico result demonstrating direct-response efficiency.",
  },
  {
    name: "Beamina",
    value: "5.2",
    label: "ROAS",
    detail: "Ecommerce proof from a brand that needed conversion, not just attention.",
  },
] as const;

const TRUST_POINTS = [
  "Jaime Ortiz, founder",
  "Recognized by Meta",
  "Spotify Marquee of the Year 2022",
  "Speaker at Spotify Masterclasses",
] as const;

export function LandingCredibility() {
  return (
    <section id="proof" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Proof</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Un funnel sin prueba se siente como otro anuncio más.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          Por eso la página enseña proof rápido: qué tipo de trabajo ya existe, qué tan amplia es la
          historia de campañas accesibles hoy y por qué el prospecto debería confiar en la llamada.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        {SNAPSHOT_STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-3xl font-bold tracking-tight text-white">{stat.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#4aa8ff]/12 p-3 text-[#9bd0ff]">
              <ChartNoAxesCombined className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">Fresh read</p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Safe proof pulled from the current accessible Meta inventory
              </h3>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            We pulled the accessible Business Manager inventory for this pass and kept the public
            landing on safe aggregates and recognizable public-facing names instead of exposing
            internals, ad account IDs, or campaign structure.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {RECOGNIZABLE_NAMES.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-[#081421]/92 px-3 py-1.5 text-sm text-slate-200"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-[#081421]/92 p-5">
            <div className="flex items-center gap-3 text-emerald-300">
              <ShieldCheck className="size-4" />
              <p className="text-xs uppercase tracking-[0.22em]">Why this matters in a funnel</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The buyer does not need a full case-study vault. They need fast trust signals that say
              “these people have really run pressure before” and “this call is worth taking.”
            </p>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className="rounded-[32px] border border-white/10 bg-[#081421]/92 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-400/12 p-3 text-emerald-300">
                <BadgeCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
                  Selected outcomes
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Recognizable wins already inside the Outlet materials
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {OUTCOME_PROOF.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold tracking-tight text-white">{item.name}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-bold tracking-tight text-white">{item.value}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#9bd0ff]">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.04 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]"
          >
            <div className="relative aspect-[1.15/0.88]">
              <Image
                src="/images/landing/jaime-ortiz.png"
                alt="Jaime Ortiz"
                fill
                sizes="(max-width: 1280px) 100vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04111c] via-[#04111c]/28 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#f97316]/12 p-3 text-[#fbbf94]">
                  <Star className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">Trust call</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    The call should feel credible before it is booked
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {TRUST_POINTS.map((note) => (
                  <div
                    key={note}
                    className="rounded-2xl border border-white/10 bg-[#081421]/92 px-4 py-3 text-sm text-slate-200"
                  >
                    {note}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                <CalendarDays className="size-4 text-[#9bd0ff]" />
                Meta inventory snapshot pulled April 10, 2026
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
