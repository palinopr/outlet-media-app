"use client";

import { motion } from "framer-motion";
import { BarChart3, Bot, CheckSquare } from "lucide-react";

export function LandingStats() {
  return (
    <section id="system" className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">System</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          The technology matters because it makes the agency sharper.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          This is where the AI part becomes real. Not a wrapper. Not a gimmick. A system that helps
          the team read pressure faster, keep clients closer, and execute without the usual agency
          blackout.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#4aa8ff]/12 p-3 text-[#9bd0ff]">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">Agency judgment</p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Strategy, creative, media, and pressure reads
              </h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The real value starts with taste, judgment, positioning, and the ability to move quickly
            when a launch, on-sale, or product push starts to shift.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Campaign strategy",
              "Creative direction",
              "Paid media execution",
              "Revenue and sell-through focus",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-[#081421]/90 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
          className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#f97316]/12 p-3 text-[#fbbf94]">
              <CheckSquare className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">
                Shared operating view
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Clients see the campaign room, not just the recap deck
              </h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The portal, shared timeline, and activity feed exist so clients stay confident while the
            work is happening instead of waiting for another end-of-week explanation.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Visible updates and decision history",
              "Shared activity instead of agency blackout",
              "Fast reads for clients, deeper views for operators",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-[#081421]/90 p-4 text-sm leading-6 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
          className="rounded-[28px] border border-white/10 bg-[#081421]/90 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-400/12 p-3 text-emerald-300">
              <Bot className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
                AI acceleration
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Faster analysis. Cleaner execution.
              </h3>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              "Budget and pacing recommendations",
              "Faster campaign diagnosis",
              "Less delay between signal and action",
              "Human supervision when stakes go up",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-300">
            That is what makes Outlet feel like a real AI agency instead of a buzzword. The system
            helps the work move better, but the work still belongs to accountable operators.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
