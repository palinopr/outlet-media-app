"use client";

import { motion } from "framer-motion";

// Jaime's pitch video — "Video Jaime _ Outlet Media .mp4" on Drive.
// File must be set to "Anyone with the link" for the iframe to play publicly.
const DRIVE_FILE_ID = "10WwsF2wC2lw7nsua1MB6ywkJA-eahojn";

export function LandingVideoPitch() {
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
            Mira el método
          </p>
          <h2 className="mt-3 max-w-[20ch] font-[family-name:var(--font-landing-heading)] text-[2rem] font-extrabold leading-[1] tracking-[-0.035em] text-white lg:text-[2.75rem]">
            Cómo operamos tu cuenta — en 60 segundos.
          </h2>
        </div>
        <p className="font-[family-name:var(--font-landing-mono)] text-[10.5px] uppercase tracking-[0.14em] text-[color:var(--landing-muted-2)]">
          Jaime Ortiz · fundador
        </p>
      </div>

      <div className="mt-7 overflow-hidden rounded-[14px] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elev)] shadow-[0_40px_80px_-40px_rgba(30,31,184,0.25)]">
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`}
            title="Outlet Media — el método, por Jaime Ortiz"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 size-full"
          />
        </div>
      </div>
    </motion.section>
  );
}
