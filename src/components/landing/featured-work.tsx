"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Work = {
  name: string;
  tag: string;
  result: string;
  image: string;
  objectPosition?: string;
  span?: string;
};

const WORKS: Work[] = [
  {
    name: "Rauw Alejandro",
    tag: "Tour Saturno · 2024–25",
    result: "370K+ boletos vendidos",
    image: "/images/landing/rauw-shauring.png",
    objectPosition: "center 15%",
    span: "lg:col-span-8 lg:row-span-2",
  },
  {
    name: "Young Miko",
    tag: "Campaña artista",
    result: "Coca-Cola Music Hall · PR",
    image: "/images/landing/young-miko-poster.png",
    objectPosition: "center top",
    span: "lg:col-span-4 lg:row-span-1",
  },
  {
    name: "Luis Miguel",
    tag: "Tour USA · 2024",
    result: "Sold out · fechas múltiples",
    image: "/images/landing/luis-miguel.png",
    objectPosition: "center 30%",
    span: "lg:col-span-4 lg:row-span-1",
  },
  {
    name: "Gilberto Santa Rosa",
    tag: "Salsa · Puerto Rico",
    result: "Sold out · campaña digital",
    image: "/images/landing/gilberto-santa-rosa.png",
    objectPosition: "center 20%",
    span: "lg:col-span-6",
  },
  {
    name: "Don Omar",
    tag: "Back to Reggaetón · BCN",
    result: "99.38% sell-through",
    image: "/images/landing/artists/don-omar.jpg",
    objectPosition: "center 25%",
    span: "lg:col-span-6",
  },
];

export function LandingFeaturedWork() {
  return (
    <motion.section
      className="mt-20 lg:mt-28"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[color:var(--landing-brand-soft)]">
            Trabajo reciente
          </p>
          <h2 className="mt-3 max-w-[22ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[2.75rem]">
            Los números atrás de las fotos.
          </h2>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 lg:grid-cols-12 lg:auto-rows-[260px] lg:gap-4">
        {WORKS.map((w) => (
          <article
            key={w.name}
            className={`group relative aspect-[4/5] overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] lg:aspect-auto ${w.span ?? ""}`}
          >
            <Image
              src={w.image}
              alt={w.name}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ objectPosition: w.objectPosition ?? "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
              <p className="font-[family-name:var(--font-landing-mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-brand-soft)]">
                {w.tag}
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-landing-heading)] text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-white lg:text-[26px]">
                {w.name}
              </p>
              <p className="mt-1 font-[family-name:var(--font-landing-heading)] text-[14px] font-bold text-white/90">
                {w.result}
              </p>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
