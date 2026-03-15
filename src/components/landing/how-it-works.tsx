"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Read the pressure",
    description:
      "We start with the audience, the moment, the calendar, and the money. Where is demand already building, where is it leaking, and what actually needs to move?",
  },
  {
    number: "02",
    title: "Build the angle",
    description:
      "Creative direction, offer framing, audience strategy, and paid-media structure all get aligned before the campaign starts accelerating.",
  },
  {
    number: "03",
    title: "Move fast while it is live",
    description:
      "Once the campaign is in market, Outlet stays close to signal. Spend, creative, and pacing move together instead of waiting for next week's recap.",
  },
  {
    number: "04",
    title: "Keep the client in the loop",
    description:
      "Approvals, updates, and pivots stay visible so clients know what changed, why it changed, and where the next push is coming from.",
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section id="method" className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Method</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          How Outlet runs when the campaign actually matters.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          This is the part that separates a real operator from a generic media team: better reads,
          faster motion, and enough visibility that the client never feels locked out of the work.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
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
        className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]"
      >
        <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">
              Built for more than one category
            </p>
            <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white">
              The same backbone can run a world tour, a nightlife calendar, a venue on-sale, or a
              revenue-heavy brand push.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Outlet is strongest when the work needs both taste and discipline: a campaign that has
              to feel culturally right, respond to signal quickly, and keep the client clear while
              the stakes stay high.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "World tours",
                "Nightlife promotion",
                "Venue on-sales",
                "Brand launches",
                "Ecommerce pushes",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-[#081421]/92 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[280px] border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
            <Image
              src="/images/landing/rauw-shauring.png"
              alt="Rauw Alejandro campaign creative"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#04111c]/20 via-transparent to-[#04111c]/85 lg:bg-gradient-to-r lg:from-[#04111c]/10 lg:via-transparent lg:to-[#04111c]/65" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
