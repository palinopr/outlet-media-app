"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarDays,
  Eye,
  Megaphone,
  ShieldCheck,
  Ticket,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const highlightItems = [
    {
      icon: Eye,
      label: "Shared visibility",
      text: "Clients see the same campaign and event context your team is acting on.",
    },
    {
      icon: Ticket,
      label: "Ticket-aware promotion",
      text: "Ticket velocity and campaign pressure stay tied together instead of split across tools.",
    },
    {
      icon: ShieldCheck,
      label: "Guided execution",
      text: "Approvals, comments, and follow-through sit in the workflow instead of hiding in chat.",
    },
  ] as const;

  const actionItems = [
    {
      label: "Approval queue",
      detail: "New creative swap waiting on promoter sign-off",
      badge: "Approval",
    },
    {
      label: "Agent follow-through",
      detail: "Budget pacing recommendation drafted from event pressure",
      badge: "Agent",
    },
    {
      label: "Client response",
      detail: "Promoter asked for updated push timing on Friday date",
      badge: "Comment",
    },
  ] as const;

  const eventRows = [
    { name: "Arena date", status: "Acceleration window", width: "78%" },
    { name: "Club run", status: "Healthy pace", width: "63%" },
    { name: "Festival push", status: "Needs follow-up", width: "42%" },
  ] as const;

  const activityItems = [
    "campaign_updated",
    "approval_requested",
    "agent_action_completed",
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
            <Workflow className="size-3.5" />
            Campaigns + Events
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
            className="mt-6 max-w-3xl text-5xl font-bold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
          >
            See the push, the pressure, and the next move.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
          >
            Outlet is the client-facing operating system for music promoters.
            Paid media, event pressure, approvals, activity, and agent
            follow-through stay in one place so clients stay informed without
            chasing updates across tools.
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
              <a href="#contact">
                Book a Walkthrough
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 rounded-full border-white/15 bg-white/[0.03] px-6 text-base text-slate-100 hover:bg-white/[0.08]"
            >
              <Link href="/sign-in">Open Portal</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.32 }}
            className="mt-10 grid gap-3 sm:grid-cols-3"
          >
            {highlightItems.map(({ icon: Icon, label, text }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-[#9bd0ff]">
                  <Icon className="size-4" />
                  <p className="text-sm font-semibold text-white">{label}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
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
            <div className="rounded-[24px] border border-white/10 bg-[#081421]/95 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">
                    Client-facing operating view
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Campaign pressure tied to event reality
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    Campaigns
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    Events
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    Activity
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-[#4aa8ff]/12 p-2 text-[#8fd2ff]">
                          <Megaphone className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Campaign pulse
                          </p>
                          <p className="text-xs text-slate-400">
                            Paid media pacing and response pressure
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-400/12 px-2.5 py-1 text-xs font-medium text-emerald-300">
                        On track
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {[
                        ["Spend pace", "92% of weekly plan", "92%"],
                        ["ROAS target", "Healthy", "74%"],
                        ["Follow-up queue", "2 items due today", "48%"],
                      ].map(([label, value, width]) => (
                        <div key={label} className="space-y-1.5">
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-slate-400">{label}</span>
                            <span className="font-medium text-slate-200">
                              {value}
                            </span>
                          </div>
                          <div className="progress-track">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#4aa8ff] via-cyan-300 to-[#f97316]"
                              style={{ width }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-[#f97316]/12 p-2 text-[#fbbf94]">
                        <Bot className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Action center
                        </p>
                        <p className="text-xs text-slate-400">
                          Operator and agent work waiting in one lane
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {actionItems.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-white/8 bg-[#06101b] p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-100">
                              {item.label}
                            </p>
                            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                              {item.badge}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-slate-400">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-cyan-400/12 p-2 text-cyan-300">
                        <CalendarDays className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Event pressure
                        </p>
                        <p className="text-xs text-slate-400">
                          Ticket movement feeding campaign decisions
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {eventRows.map((event) => (
                        <div
                          key={event.name}
                          className="rounded-xl border border-white/8 bg-[#06101b] p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-100">
                              {event.name}
                            </p>
                            <span className="text-xs text-slate-400">
                              {event.status}
                            </span>
                          </div>
                          <div className="mt-2.5 h-2 rounded-full bg-white/8">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-[#4aa8ff]"
                              style={{ width: event.width }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-emerald-400/12 p-2 text-emerald-300">
                        <Activity className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Shared timeline
                        </p>
                        <p className="text-xs text-slate-400">
                          Every meaningful step stays visible
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {activityItems.map((item, index) => (
                        <div key={item} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <span className="mt-1 size-2.5 rounded-full bg-[#4aa8ff]" />
                            {index < activityItems.length - 1 ? (
                              <span className="mt-1 h-10 w-px bg-white/10" />
                            ) : null}
                          </div>
                          <div className="rounded-xl border border-white/8 bg-[#06101b] px-3 py-2.5 text-xs text-slate-300">
                            <span className="font-mono text-[#9bd0ff]">
                              {item}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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
