"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Bot, LineChart, Ticket, Users } from "lucide-react";
import type { ComponentType, MouseEvent } from "react";

interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className: string;
}

const FEATURES: Feature[] = [
  {
    icon: Bot,
    title: "AI-Powered Campaigns",
    description:
      "Our agents create, optimize, and manage your Meta ad campaigns around the clock.",
    className: "sm:col-span-2",
  },
  {
    icon: LineChart,
    title: "Real-Time ROAS Tracking",
    description:
      "See exactly how every dollar performs with live return-on-ad-spend dashboards.",
    className: "",
  },
  {
    icon: Ticket,
    title: "Ticketmaster Integration",
    description:
      "Connect event data directly so campaigns adapt to ticket velocity and demand.",
    className: "",
  },
  {
    icon: Users,
    title: "Audience Optimization",
    description:
      "Automated targeting refinement based on demographics, interests, and performance.",
    className: "sm:col-span-2",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function SpotlightCard({ feature }: { feature: Feature }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  const Icon = feature.icon;

  return (
    <motion.div
      variants={item}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-900/50 p-8 ${feature.className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(139,92,246,0.1), transparent 80%)`,
        }}
      />
      <Icon className="relative size-10 text-cyan-400" />
      <h3 className="relative mt-4 text-lg font-semibold">{feature.title}</h3>
      <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export function LandingFeatures() {
  return (
    <section id="features" className="mx-auto max-w-5xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center">Features</p>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to sell out shows
        </h2>
      </motion.div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid gap-4 sm:grid-cols-3"
      >
        {FEATURES.map((f) => (
          <SpotlightCard key={f.title} feature={f} />
        ))}
      </motion.div>
    </section>
  );
}
