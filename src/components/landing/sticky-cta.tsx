"use client";

import { useEffect, useState } from "react";
import { LandingTrackedLink } from "./tracked-link";

export function LandingStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroCta = document.querySelector<HTMLAnchorElement>(
      '[data-hero-cta="true"]',
    );
    const booking = document.getElementById("booking");
    const form = document.getElementById("form");
    const startingPoint = document.getElementById("starting-point");

    let heroInView = true;
    let bookingInView = false;
    let formInView = false;
    let startingPointInView = false;

    const recompute = () =>
      setVisible(!heroInView && !bookingInView && !formInView && !startingPointInView);
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

    if (startingPoint) {
      const io = new IntersectionObserver(
        ([entry]) => {
          startingPointInView = entry.isIntersecting;
          recompute();
        },
        { threshold: 0.08 },
      );
      io.observe(startingPoint);
      observers.push(io);
    }

    recompute();
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 transition-all duration-300 lg:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(13,13,13,0.95) 40%)",
      }}
    >
      <LandingTrackedLink
        href="#form"
        eventPayload={{ source: "mobile_sticky", target: "form" }}
        className="flex h-14 w-full items-center justify-center rounded-[12px] bg-white font-[family-name:var(--font-landing-heading)] text-[15px] font-extrabold tracking-wide text-[#101010] shadow-[0_16px_42px_-18px_rgba(255,255,255,0.8)] backdrop-blur-md"
      >
        Recibir diagnóstico gratis
      </LandingTrackedLink>
    </div>
  );
}
