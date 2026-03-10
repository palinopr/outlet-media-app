"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  CheckSquare,
  History,
  MessageSquare,
} from "lucide-react";

export function LandingStats() {
  return (
    <section id="visibility" className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Visibility</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Two visibility modes. One backbone.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          Some users want fast KPIs. Others want the workflow underneath. Outlet
          is built so both views run on the same approvals, activity, comments,
          and outcomes instead of drifting into separate systems.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_1fr_0.85fr]">
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
              <p className="text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">
                Summary mode
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Fast read for clients and operators
              </h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Give promoters a clean dashboard view without hiding the approval
            queue, activity, or pressure that explains what they are seeing.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Charts and KPI cards",
              "Trend lines and pacing reads",
              "Pending approvals",
              "Top issues needing attention",
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
                Operating mode
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Work attached to the actual campaign or event
              </h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            When users need more depth, they can step into the operating view
            where comments, approvals, assets, and next steps stay attached to
            the right context.
          </p>
          <div className="mt-6 space-y-3">
            {[
              {
                icon: MessageSquare,
                title: "Discussion in context",
                body: "Comments and client questions sit on the campaign or event they refer to.",
              },
              {
                icon: CheckSquare,
                title: "Real next-step objects",
                body: "Follow-ups and approvals become visible work instead of passive notes.",
              },
              {
                icon: Bot,
                title: "Agent outcomes you can audit",
                body: "Completed, blocked, or pending agent work stays visible to the team.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-[#081421]/90 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/[0.05] p-2 text-[#9bd0ff]">
                    <Icon className="size-4" />
                  </div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
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
              <History className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
                Shared backbone
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                One timeline for what changed
              </h3>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              "campaign_updated",
              "approval_requested",
              "client_comment_added",
              "agent_action_completed",
            ].map((event, index, array) => (
              <div key={event} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1 size-2.5 rounded-full bg-[#4aa8ff]" />
                  {index < array.length - 1 ? (
                    <span className="mt-1 h-11 w-px bg-white/10" />
                  ) : null}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200">
                  <span className="font-mono text-[#9bd0ff]">{event}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-300">
            The same event backbone feeds dashboards, approvals, activity, and
            agent follow-through so visibility does not drift as the product
            grows.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
