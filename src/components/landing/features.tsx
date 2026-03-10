"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Eye,
  Link2,
  MessageSquareQuote,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import type { ComponentType } from "react";

interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  points: string[];
  className: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    icon: Eye,
    title: "Shared visibility, not client blackout",
    description:
      "Clients, operators, and agents work from the same context so updates do not disappear into Slack, docs, and inbox threads.",
    points: [
      "Summary dashboards for quick reads",
      "Deeper workflow when details matter",
      "Status, blockers, and next steps in one place",
    ],
    className: "xl:col-span-7",
    accent: "from-[#4aa8ff]/20 via-[#4aa8ff]/8 to-transparent",
  },
  {
    icon: Ticket,
    title: "Campaigns and events stay linked",
    description:
      "Ticket velocity and paid media performance sit inside the same operating loop, so event pressure can actually shape campaign decisions.",
    points: [
      "Ticketing-aware campaign context",
      "Promotion pressure visible before it becomes a fire",
    ],
    className: "xl:col-span-5",
    accent: "from-[#f97316]/16 via-[#f97316]/6 to-transparent",
  },
  {
    icon: ShieldCheck,
    title: "Approvals live inside the work",
    description:
      "Requests, responses, and follow-through stay attached to the campaign or event instead of being scattered across screenshots and chat.",
    points: [
      "Explicit yes/no approval path",
      "Comments and action items tied to the source context",
    ],
    className: "xl:col-span-5",
    accent: "from-emerald-400/18 via-emerald-400/6 to-transparent",
  },
  {
    icon: Bot,
    title: "Agents react to real product signals",
    description:
      "Automation is driven by structured events, approvals, and durable timelines, not just prompt memory and hidden side effects.",
    points: [
      "Event-driven follow-through",
      "Bounded actions with visible outcomes",
      "Operator supervision when risk goes up",
    ],
    className: "xl:col-span-7",
    accent: "from-cyan-300/16 via-cyan-300/6 to-transparent",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-7 ${feature.className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#081421] p-3 text-[#9bd0ff]">
            <Icon className="size-5" />
          </div>
          {feature.title.includes("Agents") ? (
            <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-300 sm:flex">
              <span className="rounded-full border border-white/10 bg-[#081421] px-2.5 py-1">
                system_event
              </span>
              <Link2 className="size-3.5 text-slate-500" />
              <span className="rounded-full border border-white/10 bg-[#081421] px-2.5 py-1">
                task
              </span>
            </div>
          ) : null}
          {feature.title.includes("Shared visibility") ? (
            <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-300 sm:flex">
              <span className="rounded-full border border-white/10 bg-[#081421] px-2.5 py-1">
                Client
              </span>
              <MessageSquareQuote className="size-3.5 text-slate-500" />
              <span className="rounded-full border border-white/10 bg-[#081421] px-2.5 py-1">
                Team
              </span>
            </div>
          ) : null}
        </div>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
          {feature.title}
        </h3>
      </div>
      <p className="relative mt-3 max-w-2xl text-sm leading-7 text-slate-300">
        {feature.description}
      </p>
      <div className="relative mt-6 flex flex-wrap gap-2">
        {feature.points.map((point) => (
          <span
            key={point}
            className="rounded-full border border-white/10 bg-[#081421]/90 px-3 py-1.5 text-xs text-slate-200"
          >
            {point}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function LandingFeatures() {
  return (
    <section id="product" className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Product</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Built for promoters who need more than a dashboard.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          Outlet keeps campaign execution, event pressure, client communication,
          and approvals on one backbone so the product can guide the work
          instead of just reporting on it after the fact.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-4 xl:grid-cols-12">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
