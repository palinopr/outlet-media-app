"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock3,
  LayoutTemplate,
  LineChart,
  Megaphone,
  PhoneCall,
  Smartphone,
  Target,
} from "lucide-react";

const PROBLEMS = [
  {
    title: "Clicks sin cita",
    description:
      "La campaña consigue atención, pero la persona llega a una página que no la mueve a llamar, dejar datos o pedir ayuda.",
    icon: Target,
  },
  {
    title: "Landing débil en el teléfono",
    description:
      "Mucho texto, demasiadas opciones, velocidad floja o cero proof arriba del fold. En mobile eso mata la intención rápido.",
    icon: Smartphone,
  },
  {
    title: "Sin follow-up claro",
    description:
      "Si la ruta después del formulario o de la llamada no está definida, el lead se enfría antes de hablar con alguien.",
    icon: Clock3,
  },
] as const;

const OFFER_ITEMS = [
  { label: "Angle y copy para anuncios", icon: Megaphone },
  { label: "Landing mobile-first enfocada en una sola acción", icon: LayoutTemplate },
  { label: "Captura de contexto: negocio, meta y presupuesto", icon: AlertTriangle },
  { label: "CTA hacia llamada o solicitud de cita", icon: PhoneCall },
  { label: "Tracking claro para saber de dónde vino el lead", icon: LineChart },
  { label: "Mensaje pensado para Puerto Rico, no template genérico", icon: Target },
] as const;

export function LandingFeatures() {
  return (
    <section id="offer" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Offer</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          No necesitas más tráfico si el problema real está después del click.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          Esta oferta está pensada para campañas donde el objetivo no es “verse bonito”, sino
          conseguir una conversación real con el prospecto y moverlo hacia la próxima acción.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-5 xl:grid-cols-[0.94fr_1.06fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">What breaks</p>
          <div className="mt-5 space-y-4">
            {PROBLEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-[28px] border border-white/10 bg-[#081421]/92 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-[#4aa8ff]/12 p-3 text-[#9bd0ff]">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="rounded-[32px] border border-white/10 bg-[#081421]/92 p-5 sm:p-6"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">What launches</p>
          <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white">
            Un funnel corto, claro y hecho para thumbs, not decks.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            El trabajo no se queda en “corremos ads”. La página, el mensaje, la captura del lead y
            la invitación a la cita tienen que sentirse como una sola experiencia.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {OFFER_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/[0.06] p-2.5 text-[#9bd0ff]">
                      <Icon className="size-4" />
                    </div>
                    <p className="text-sm font-medium leading-6 text-slate-100">{item.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 rounded-[28px] border border-[#f97316]/18 bg-[#0b1622] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">The actual bet</p>
            <p className="mt-3 text-lg leading-8 text-slate-200">
              Si el prospecto ve una historia clara, siente prueba suficiente y entiende qué hacer
              en menos de un minuto, la conversación empieza con mucha menos fricción.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
