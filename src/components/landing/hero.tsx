"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Animated mesh gradient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-[10%] -top-[20%] h-[600px] w-[600px] rounded-full bg-violet-600/30 blur-[120px] animate-[drift_20s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-pink-500/20 blur-[120px] animate-[drift_25s_ease-in-out_infinite_alternate-reverse]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px] animate-[drift_15s_ease-in-out_infinite_alternate]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Gradient accent line */}
        <div className="gradient-bar mb-10 h-1 w-24" />

        {/* Glow behind headline */}
        <div className="absolute -top-8 h-[200px] w-[500px] rounded-full bg-violet-600/15 blur-[100px]" aria-hidden />

        {/* Gradient headline */}
        <h1 className="relative max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-white via-violet-300 to-pink-400 bg-clip-text text-transparent">
          Your Ads, On Autopilot
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          AI-managed Meta campaigns built for music promoters. We handle the
          targeting, budgets, and optimization so you can focus on the show.
        </p>

        <div className="mt-10 flex gap-4">
          {/* Animated gradient border CTA */}
          <a
            href="#contact"
            className="glow-cta relative inline-flex h-11 items-center justify-center rounded-lg px-8 text-sm font-semibold text-white transition-shadow hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          >
            Book a Demo
          </a>
          <Button variant="outline" size="lg" asChild>
            <a href="/sign-in">Log In</a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
