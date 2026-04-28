"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Marquee } from "./ui/marquee";

const LOGOS = [
  { src: "/images/landing/clients/beamina.png", alt: "Beamina" },
  { src: "/images/landing/clients/vaqueros-bayamon.png", alt: "Vaqueros de Bayamón" },
  { src: "/images/landing/clients/tu-planta-pr.png", alt: "Tu Planta PR" },
  { src: "/images/landing/gallimbo-studios.png", alt: "Gallimbo Studios" },
  { src: "/images/landing/9am.png", alt: "9AM" },
  { src: "/images/landing/duars-live.png", alt: "Duars Live" },
] as const;

export function LandingClientLogos() {
  return (
    <motion.section
      className="mt-16 lg:mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-center font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--landing-muted-2)]">
        Clientes y promotoras que confían en nosotros
      </p>

      <div className="relative mt-5 overflow-hidden">
        <Marquee pauseOnHover repeat={4} className="[--duration:45s]">
          {LOGOS.map((logo) => (
            <div
              key={logo.alt}
              className="relative h-12 w-[140px] flex-shrink-0 opacity-65 transition-opacity hover:opacity-100 lg:h-14 lg:w-[180px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="180px"
                className="object-contain"
              />
            </div>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0d0d0d] to-transparent" />
      </div>
    </motion.section>
  );
}
