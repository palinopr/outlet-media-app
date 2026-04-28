"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Case = {
  vertical: string;
  name: string;
  result: string;
  detail: string;
  image?: string;
  imageObjectPosition?: string;
  logo?: string;
};

const CASES: Case[] = [
  {
    vertical: "Tour",
    name: "Rauw Alejandro",
    result: "370K+ boletos",
    detail: "Boletos vendidos",
    image: "/images/landing/artists/rauw-alejandro.jpg",
    imageObjectPosition: "center top",
  },
  {
    vertical: "Evento",
    name: "Don Omar",
    result: "99.38%",
    detail: "Sell-through",
    image: "/images/landing/artists/don-omar.jpg",
    imageObjectPosition: "center 30%",
  },
  {
    vertical: "Venue",
    name: "Coliseo de Puerto Rico",
    result: "Sold out",
    detail: "Múltiples funciones",
    image: "/images/landing/venues/coliseo-pr.jpg",
    imageObjectPosition: "center",
  },
  {
    vertical: "Ecommerce",
    name: "Beamina",
    result: "Ecommerce",
    detail: "Performance",
    logo: "/images/landing/clients/beamina.png",
  },
  {
    vertical: "Leads",
    name: "Tu Planta PR",
    result: "Leads",
    detail: "Calificados",
    logo: "/images/landing/clients/tu-planta-pr.png",
  },
  {
    vertical: "Sports",
    name: "Vaqueros de Bayamón",
    result: "Ticketing +",
    detail: "Retargeting",
    logo: "/images/landing/clients/vaqueros-bayamon.png",
  },
];

export function LandingVerticalProof() {
  return (
    <motion.section
      className="mt-16 lg:mt-24"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <p className="font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
          Prueba real
        </p>
        <h2 className="mx-auto mt-3 max-w-[22ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[3rem]">
          Hemos vendido boletos, productos y servicios con ads.
        </h2>
      </div>

      <ul className="-mx-5 mt-7 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-6 lg:gap-4 [&::-webkit-scrollbar]:hidden">
        {CASES.map((c) => (
          <li
            key={c.name}
            className="group relative flex aspect-[4/5] min-w-[72%] snap-start overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] sm:min-w-0 lg:aspect-[3/4]"
          >
            {c.image ? (
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: c.imageObjectPosition ?? "center" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(30,31,184,0.22),transparent_60%),linear-gradient(180deg,#141414_0%,#0d0d0d_100%)]">
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={c.name}
                    width={200}
                    height={100}
                    className="h-auto max-h-[38%] w-auto max-w-[68%] object-contain opacity-90"
                  />
                ) : null}
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/55 to-transparent" />

            <div className="relative z-10 mt-auto p-5 lg:p-6">
              <p className="font-[family-name:var(--font-landing-mono)] text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
                {c.vertical}
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-landing-heading)] text-[18px] font-extrabold leading-tight tracking-[-0.02em] text-white lg:text-[20px]">
                {c.name}
              </p>
              <p className="mt-2 font-[family-name:var(--font-landing-heading)] text-[15px] font-bold text-white">
                {c.result}
              </p>
              <p className="mt-0.5 font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.12em] text-white/55">
                {c.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--landing-muted-2)]">
        + Grupo Firme · Ivy Queen · Luis Miguel · Gilberto Santa Rosa · Ricardo Arjona
      </p>
    </motion.section>
  );
}
