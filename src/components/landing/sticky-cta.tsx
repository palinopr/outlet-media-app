"use client";

import { useEffect, useState } from "react";

export function LandingStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.querySelector<HTMLAnchorElement>(
      '[data-hero-cta="true"]',
    );
    const booking = document.getElementById("booking");
    const form = document.getElementById("form");

    let heroInView = true;
    let bookingInView = false;
    let formInView = false;

    const recompute = () => setVisible(!heroInView && !bookingInView && !formInView);
    const observers: IntersectionObserver[] = [];

    if (heroCta) {
      const io = new IntersectionObserver(
        ([entry]) => {
          heroInView = entry.isIntersecting;
          recompute();
        },
        { threshold: 0 },
      );
      io.observe(heroCta);
      observers.push(io);
    } else {
      heroInView = false;
    }

    if (booking) {
      const io = new IntersectionObserver(
        ([entry]) => {
          bookingInView = entry.isIntersecting;
          recompute();
        },
        { threshold: 0.08 },
      );
      io.observe(booking);
      observers.push(io);
    }

    if (form) {
      const io = new IntersectionObserver(
        ([entry]) => {
          formInView = entry.isIntersecting;
          recompute();
        },
        { threshold: 0.08 },
      );
      io.observe(form);
      observers.push(io);
    }

    recompute();
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2 transition-all duration-300 lg:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(13,13,13,0.95) 40%)",
      }}
    >
      <a
        href="#booking"
        className="flex h-12 w-full items-center justify-center rounded-[10px] bg-[color:var(--landing-brand)] font-[family-name:var(--font-landing-heading)] text-sm font-bold tracking-wide text-white shadow-[0_14px_40px_-12px_rgba(30,31,184,0.65)] backdrop-blur-md"
      >
        Agenda tu auditoría gratis
      </a>
    </div>
  );
}
