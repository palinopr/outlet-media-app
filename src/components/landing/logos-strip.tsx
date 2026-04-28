"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Marquee } from "./ui/marquee";

const LOGOS = [
  { src: "/images/landing/clients/beamina.png", alt: "Beamina" },
  { src: "/images/landing/clients/vaqueros-bayamon.png", alt: "Vaqueros de Bayamón" },
  { src: "/images/landing/clients/tu-planta-pr.png", alt: "Tu Planta PR" },
  { src: "/images/landing/gallimbo-studios.png", alt: "Gallimbo Studios" },
  { src: "/images/landing/9am.png", alt: "9AM" },
  { src: "/images/landing/duars-live.png", alt: "Duars Live" },
] as const;

const ARTISTS = [
  {
    src: "/images/landing/artists/rauw-alejandro.jpg",
    name: "Rauw Alejandro",
    tag: "370K+ boletos · tour int'l",
  },
  {
    src: "/images/landing/artists/don-omar.jpg",
    name: "Don Omar",
    tag: "99.38% sell-through · BCN",
  },
  {
    src: "/images/landing/artists/ricardo-arjona.jpg",
    name: "Ricardo Arjona",
    tag: "Tour USA 2025",
  },
] as const;

const ROSTER_EXTRA = [
  { initials: "GF", name: "Grupo Firme", tag: "Campaña digital · sold out" },
  { initials: "IQ", name: "Ivy Queen", tag: "Puerto Rico · sold out" },
  { initials: "MB", name: "Miguel Bosé", tag: "Campaña digital · sold out" },
  { initials: "EC", name: "Elvis Crespo", tag: "Puerto Rico · sold out" },
  { initials: "MAS", name: "Marco Antonio Solís", tag: "Tour · sold out" },
  { initials: "DLG", name: "De La Ghetto", tag: "Puerto Rico · sold out" },
  { initials: "GSR", name: "Gilberto Santa Rosa", tag: "Puerto Rico · sold out" },
  { initials: "CY", name: "Chente Ydrach", tag: "Puerto Rico · sold out" },
] as const;

const VENUES = [
  {
    name: "Coliseo de Puerto Rico",
    cap: "18,500",
    city: "San Juan",
    image: "/images/landing/venues/coliseo-pr.jpg",
  },
  {
    name: "Hiram Bithorn Stadium",
    cap: "18,000",
    city: "San Juan",
    image: "/images/landing/venues/hiram-bithorn.jpg",
  },
  {
    name: "Coca-Cola Music Hall",
    cap: "4,000",
    city: "San Juan",
    image: "/images/landing/venues/coca-cola-music-hall-stage.jpg",
  },
] as const;

export function LandingLogosStrip() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-artist-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="mt-24 border-t border-[color:var(--landing-border)] pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Artistas que operamos
        </p>
        <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
          + KYBBA · Camila Cabello · 150+ eventos sold out
        </p>
      </div>

      {/* Artist portrait slider — user controls via swipe / arrows */}
      <div className="relative mt-6">
        <div
          ref={scrollerRef}
          className="landing-hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 sm:gap-4"
        >
          {ARTISTS.map((artist) => (
            <div
              key={artist.name}
              data-artist-card
              className="group relative aspect-[4/5] flex-shrink-0 snap-start basis-[82%] overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] sm:basis-[48%] lg:basis-[42%]"
            >
              <Image
                src={artist.src}
                alt={artist.name}
                fill
                sizes="(max-width: 640px) 85vw, 33vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                <p className="font-[family-name:var(--font-landing-heading)] text-[17px] font-bold leading-tight tracking-[-0.01em] text-white">
                  {artist.name}
                </p>
                <p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-brand-soft)]">
                  {artist.tag}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Edge fades to hint overflow */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0d0d0d] to-transparent" />

        {/* Arrow controls — desktop only */}
        <div className="mt-4 hidden items-center justify-end gap-2 lg:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Artista anterior"
            className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] text-white transition-colors hover:border-[color:var(--landing-brand-soft)]/60 hover:text-[color:var(--landing-brand-soft)]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Siguiente artista"
            className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] text-white transition-colors hover:border-[color:var(--landing-brand-soft)]/60 hover:text-[color:var(--landing-brand-soft)]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Swipe hint — mobile only */}
        <p className="mt-3 text-center font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-muted-2)] lg:hidden">
          Desliza para ver más →
        </p>

        {/* Full roster — 8 more names with initials tiles */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {ROSTER_EXTRA.map((artist) => (
            <div
              key={artist.name}
              className="flex items-center gap-3 rounded-[12px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] px-3 py-3"
            >
              <span
                aria-hidden
                className="inline-flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--landing-brand)]/14 font-[family-name:var(--font-landing-mono)] text-[11px] font-semibold tracking-wide text-[color:var(--landing-brand-soft)]"
              >
                {artist.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-[family-name:var(--font-landing-heading)] text-[13px] font-bold text-white">
                  {artist.name}
                </p>
                <p className="truncate font-[family-name:var(--font-landing-mono)] text-[9.5px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
                  {artist.tag}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
          + 140 eventos más · sold out en PR, USA y Europa
        </p>
      </div>

      {/* Client logos marquee — clients + promoters */}
      <div className="mt-10 border-t border-[color:var(--landing-border)] pt-7">
        <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Clientes y promotoras que confían en nosotros
        </p>
        <div className="relative mt-4 overflow-hidden">
          <Marquee pauseOnHover repeat={4} className="[--duration:50s]">
            {LOGOS.map((logo) => (
              <div
                key={logo.alt}
                className="relative h-12 w-[130px] flex-shrink-0 opacity-70 transition-opacity hover:opacity-100 lg:h-14 lg:w-[170px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="170px"
                  className="object-contain"
                />
              </div>
            ))}
          </Marquee>
          {/* Edge fade masks — wrap just the marquee, not the heading */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0d0d0d] to-transparent" />
        </div>
      </div>

      {/* Sold-out venues — Puerto Rico credibility */}
      <div className="mt-10 border-t border-[color:var(--landing-border)] pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
            Sold out en Puerto Rico
          </p>
          <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
            Los 3 venues más grandes de la isla
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {VENUES.map((venue) => (
            <div
              key={venue.name}
              className="group relative aspect-[4/5] overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] sm:aspect-[3/4]"
            >
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/70 to-[#0d0d0d]/30" />
              <div className="absolute right-4 top-4 z-10 rounded bg-emerald-500/15 px-2 py-0.5 font-[family-name:var(--font-landing-mono)] text-[9px] uppercase tracking-[0.14em] text-emerald-300 backdrop-blur-sm">
                sold out
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 p-5 lg:p-6">
                <p className="font-[family-name:var(--font-landing-heading)] text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] text-white">
                  {venue.cap}
                </p>
                <p className="mt-1 font-[family-name:var(--font-landing-mono)] text-[9px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
                  asientos · sold out
                </p>
                <p className="mt-4 font-[family-name:var(--font-landing-heading)] text-[16px] font-bold leading-tight text-white">
                  {venue.name}
                </p>
                <p className="mt-0.5 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.14em] text-white/60">
                  {venue.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
