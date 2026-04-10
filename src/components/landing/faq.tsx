"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    question: "¿Esto es para artistas solamente o también para negocios?",
    answer:
      "Es para ambos. El enfoque es direct-response: campañas que necesitan convertir el click en una conversación real. Eso puede ser un artista, una promotora, ecommerce, real estate, solar o un negocio local con paid traffic.",
  },
  {
    question: "¿Pueden usar mis anuncios actuales o hay que empezar de cero?",
    answer:
      "Podemos partir de lo que ya existe. Si hay campañas activas, revisamos el ángulo, la experiencia mobile y el paso hacia la cita antes de decidir qué hay que rehacer.",
  },
  {
    question: "¿La página puede salir en español, inglés o Spanglish?",
    answer:
      "Sí. Para Puerto Rico normalmente tiene más sentido una mezcla natural según el tipo de cliente, el ticket promedio y la categoría. La idea es sonar local y claro, no traducido a la fuerza.",
  },
  {
    question: "¿Qué pasa después de llenar el formulario?",
    answer:
      "Revisamos el contexto que nos envías, validamos si hay fit y luego coordinamos la llamada. La meta de esta página no es coleccionar leads fríos; es abrir conversaciones con intención real.",
  },
  {
    question: "¿Cuál es el mínimo para empezar?",
    answer:
      "Depende del tipo de trabajo. Las consultas estratégicas siguen teniendo un costo base, y para manejo de campaña normalmente buscamos suficiente presupuesto para que el funnel tenga espacio real para funcionar.",
  },
  {
    question: "Si quiero hablar hoy, ¿los puedo llamar directo?",
    answer:
      "Sí. Puedes tocar aquí para llamar ahora mismo: <a href='tel:+13053225709' class='text-[#4aa8ff] hover:underline inline-flex items-center gap-1 font-medium'>+1 (305) 322-5709</a>.",
  },
] as const;

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">FAQ</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Objections we want to remove before the call.
        </h2>
      </motion.div>

      <div className="mt-10 space-y-4">
        {FAQS.map((faq, index) => (
          <motion.div
            key={faq.question}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-white/[0.05]"
            >
              <span className="text-lg font-medium text-white">{faq.question}</span>
              {openIndex === index ? (
                <Minus className="size-5 shrink-0 text-[#9bd0ff]" />
              ) : (
                <Plus className="size-5 shrink-0 text-slate-400" />
              )}
            </button>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-6 pb-6"
              >
                <p
                  className="text-sm leading-7 text-slate-300"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
