"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface StoryPoint {
  index: string;
  title: string;
  description: string;
}

const STORY_POINTS: StoryPoint[] = [
  {
    index: "01",
    title: "We find the angle before we touch the budget",
    description:
      "Artists, venues, nightlife brands, and fast-moving launches all need the right story, timing, and tone. The work has to feel native to the audience before the spend can perform.",
  },
  {
    index: "02",
    title: "We stay tied to tickets, sales, and sell-through",
    description:
      "A nice dashboard does not matter if the room is not filling or the product is not moving. Outlet keeps the work close to revenue so the campaign can pivot before momentum leaks.",
  },
  {
    index: "03",
    title: "We keep clients inside the motion, not outside of it",
    description:
      "The client should not have to guess what the agency is doing. Outlet makes the work visible while it is happening, which creates faster approvals, sharper pivots, and more trust.",
  },
] as const;

export function LandingFeatures() {
  return (
    <section id="why-outlet" className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Why Outlet</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Clients do not switch agencies for new slides. They switch for better movement.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          Outlet is built for the moment when a client realizes the current agency feels generic,
          slow, or too far from the actual money. This is the difference customers should feel from
          the first conversation.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]"
        >
          <div className="relative aspect-[1.05/1]">
            <Image
              src="/images/landing/rauw-shauring.png"
              alt="Rauw Alejandro tour creative"
              fill
              sizes="(max-width: 1280px) 100vw, 38vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04111c] via-[#04111c]/24 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">
                What customers are actually buying
              </p>
              <p className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-white">
                Taste, pressure reads, revenue focus, and a team that stays close while the campaign
                is live.
              </p>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2 sm:p-6">
            {[
              "Strategy and positioning that fits the room",
              "Creative direction that does not look templated",
              "Paid media tied to sell-through and sales",
              "Visibility that keeps the client confident",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/10 bg-[#081421]/92 px-4 py-3 text-sm leading-6 text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-4">
          {STORY_POINTS.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="rounded-full border border-[#4aa8ff]/25 bg-[#4aa8ff]/10 px-3 py-1.5 text-xs font-semibold tracking-[0.24em] text-[#9bd0ff]">
                  {point.index}
                </span>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{point.description}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            className="rounded-[30px] border border-[#f97316]/18 bg-[#0b1622] p-6 sm:p-7"
          >
            <div className="flex items-center gap-3 text-[#fbbf94]">
              <ArrowRight className="size-4" />
              <p className="text-xs uppercase tracking-[0.24em]">Why smart clients move</p>
            </div>
            <p className="mt-4 text-lg leading-8 text-slate-200">
              When the stakes are real, the problem is rarely “we need another agency.” The problem
              is “we need a sharper story, faster pivots, and a team we can actually trust while the
              campaign is moving.” That is the role Outlet is built to play.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
