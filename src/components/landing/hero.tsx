"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Sparkles, Star, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const proofMetrics = [
    "7+ years building campaigns",
    "$12M+ managed campaigns",
    "150+ sold-out events",
    "370K+ tickets sold on world tours",
  ] as const;

  const proofNames = [
    "Rauw Alejandro",
    "Don Omar",
    "Luis Miguel",
    "Beamina",
    "9AM",
    "Gallimbo Studios",
  ] as const;

  const signatureWins = [
    { label: "Don Omar", value: "99.38% sell-through" },
    { label: "Rauw Alejandro", value: "370K+ tickets sold" },
    { label: "Beamina", value: "63K+ sales | ROAS 5.2" },
    { label: "Brand campaigns", value: "$1M+ ecommerce sales" },
  ] as const;

  const founderNotes = [
    "Led by Jaime Ortiz",
    "Recognized by Meta",
    "Spotify Marquee of the Year 2022",
    "Speaker at Spotify Masterclasses",
  ] as const;

  const capabilityNotes = [
    "Artists and world tours",
    "Nightlife and venue calendars",
    "Brands and ecommerce pushes",
    "Client visibility while campaigns are live",
  ] as const;

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-14 sm:pb-24 sm:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px]" aria-hidden>
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
        <motion.div
          animate={{ x: [0, 14, -10, 0], y: [0, 30, -14, 0], scale: [1, 1.03, 0.97, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[34%] top-[28%] h-80 w-80 rounded-full bg-cyan-400/14 blur-[140px]"
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-[#4aa8ff]/20 bg-[#4aa8ff]/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[#9bd0ff]"
          >
            <Sparkles className="size-3.5" />
            Performance Agency + AI Operating System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
            className="mt-6 max-w-3xl text-5xl font-bold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
          >
            The agency behind sold-out tours, high-pressure launches, and revenue that keeps moving.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
          >
            Outlet Media helps artists, tours, nightlife brands, venues, and fast-moving companies
            turn attention into ticket sales, ecommerce revenue, and real campaign momentum. We pair
            creative, paid media, and our own operating system so clients stay close to the work
            instead of chasing the agency for answers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[#4aa8ff] px-6 text-base font-semibold text-[#06111d] hover:bg-[#72beff]"
            >
              <a href="#proof">
                See the Proof
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 rounded-full border-white/15 bg-white/[0.03] px-6 text-base text-slate-100 hover:bg-white/[0.08]"
            >
              <a href="#contact">Book a Strategy Call</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.28 }}
            className="mt-6"
          >
            <div className="flex flex-wrap gap-2">
              {proofMetrics.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              The current proof set already includes {proofNames.join(", ")}, plus named outcomes
              tied to tickets sold, sell-through, ROAS, and ecommerce growth.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {capabilityNotes.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-[#081421]/90 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-slate-200"
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
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.18 }}
          className="relative lg:justify-self-end"
        >
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#4aa8ff]/18 via-transparent to-[#f97316]/16 blur-3xl" />
          <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.05] p-3 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.82)] backdrop-blur-xl">
            <div className="space-y-4 rounded-[24px] border border-white/10 bg-[#081421]/95 p-4 sm:p-5">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10">
                <div className="relative aspect-[1.16/0.92]">
                  <Image
                    src="/images/landing/tour-artist.png"
                    alt="Featured tour artist performance"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04111c] via-[#04111c]/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#04111c]/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#9bd0ff] backdrop-blur">
                      <Ticket className="size-3.5" />
                      Tour momentum
                    </div>
                    <p className="mt-3 max-w-md text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
                      370K+ tickets sold on world tours.
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
                      Real artist work, real launch pressure, and named outcomes already present in
                      the approved Outlet materials.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04]">
                  <div className="relative aspect-[0.84/1]">
                    <Image
                      src="/images/landing/jaime-ortiz.png"
                      alt="Jaime Ortiz"
                      fill
                      sizes="(max-width: 1024px) 100vw, 20vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04111c] via-[#04111c]/18 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#fbbf94]">
                      Founder credibility
                    </p>
                    <div className="mt-4 space-y-2">
                      {founderNotes.map((note) => (
                        <div
                          key={note}
                          className="rounded-2xl border border-white/10 bg-[#06101b] px-3 py-2.5 text-sm text-slate-200"
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center gap-2 text-[#9bd0ff]">
                      <BadgeCheck className="size-4" />
                      <p className="text-xs uppercase tracking-[0.22em]">Signature outcomes</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      {signatureWins.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#06101b] px-4 py-3"
                        >
                          <span className="text-sm text-slate-300">{item.label}</span>
                          <span className="text-sm font-semibold text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Star className="size-4" />
                      <p className="text-xs uppercase tracking-[0.22em]">Why it feels different</p>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      Most agencies send reports after the moment has already moved. Outlet stays
                      inside the campaign pressure while it is still live, then uses the system to
                      keep clients clear on what changed, why it changed, and what happens next.
                    </p>
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
