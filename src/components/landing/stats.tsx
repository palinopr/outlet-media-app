"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

function AnimatedCounter({
  target,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, count, target]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

const STATS = [
  { target: 50, suffix: "+", decimals: 0, label: "Campaigns Managed" },
  { target: 4.2, suffix: "x", decimals: 1, label: "Average ROAS" },
  { target: 30, suffix: "+", decimals: 0, label: "Events Tracked" },
] as const;

export function LandingStats() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-4xl px-6 py-24"
    >
      <div className="glass-card hero-stat-card grid gap-8 p-10 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-4xl font-bold sm:text-5xl">
              <AnimatedCounter
                target={s.target}
                suffix={s.suffix}
                decimals={s.decimals}
              />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
