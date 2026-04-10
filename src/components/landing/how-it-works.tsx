"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Hook the click",
    description:
      "The ad has to make one promise and the page has to continue the same promise without changing the story.",
  },
  {
    number: "02",
    title: "Win the first scroll",
    description:
      "Above the fold we want clear proof, a short explanation, and one obvious action for a mobile visitor.",
  },
  {
    number: "03",
    title: "Qualify before the call",
    description:
      "We ask enough to understand the business, goal, and budget so the conversation starts with context.",
  },
  {
    number: "04",
    title: "Push to appointment",
    description:
      "The page should not end in passive interest. It should move the person toward requesting the call now.",
  },
] as const;

const MOBILE_RULES = [
  "One primary CTA",
  "Short sections with visible proof",
  "Thumb-friendly buttons and forms",
  "Copy that sounds local, not imported",
] as const;

export function LandingHowItWorks() {
  return (
    <section id="funnel" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Funnel</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          El path que queremos que corra después del ad click.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          No es una landing tipo brochure. Es una secuencia de decisión: interés, confianza,
          contexto y solicitud de cita.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9bd0ff]">
              {step.number}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
        className="mt-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8"
      >
        <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">Mobile rules</p>
        <h3 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white">
          Si la campaña vive en el teléfono, el funnel también tiene que vivir bien ahí.
        </h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          This page is being shaped as a mobile conversion path first, then expanded for desktop —
          not the other way around.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {MOBILE_RULES.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-[#081421]/92 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-slate-200"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
