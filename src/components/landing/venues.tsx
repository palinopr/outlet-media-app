"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const VENUES = [
  {
    name: "Coliseo de Puerto Rico",
    city: "San Juan, PR",
    capacity: "18,500",
    image: "/images/landing/venues/coliseo-pr.jpg",
  },
  {
    name: "Hiram Bithorn Stadium",
    city: "San Juan, PR",
    capacity: "18,000",
    image: "/images/landing/venues/hiram-bithorn.jpg",
  },
  {
    name: "Coca-Cola Music Hall",
    city: "San Juan, PR",
    capacity: "4,000",
    image: "/images/landing/venues/coca-cola-music-hall-stage.jpg",
  },
] as const;

export function LandingVenues() {
  return (
    <motion.section
      className="mt-20 lg:mt-28"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
            Sold out en Puerto Rico
          </p>
          <h2 className="mt-3 max-w-[22ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[2.75rem]">
            Los 3 venues más grandes de la isla.
          </h2>
        </div>
        <p className="font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
          40,500+ asientos cerrados
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {VENUES.map((venue) => (
          <article
            key={venue.name}
            className="group relative aspect-[4/5] overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)]"
          >
            <Image
              src={venue.image}
              alt={venue.name}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/45 to-transparent" />
            <div className="absolute right-4 top-4 rounded-md bg-emerald-500/15 px-2 py-0.5 font-[family-name:var(--font-landing-mono)] text-[9px] uppercase tracking-[0.16em] text-emerald-300 backdrop-blur-sm">
              Sold out
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
              <p className="font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] text-white lg:text-[2.5rem]">
                {venue.capacity}
              </p>
              <p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[9.5px] uppercase tracking-[0.16em] text-[color:var(--landing-brand-soft)]">
                asientos
              </p>
              <p className="mt-4 font-[family-name:var(--font-landing-heading)] text-[16px] font-bold leading-tight text-white">
                {venue.name}
              </p>
              <p className="mt-0.5 font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.14em] text-white/60">
                {venue.city}
              </p>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
