"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    question: "¿Cuáles son los servicios que ofrecen?",
    answer:
      "Ofrecemos campañas dirigidas en todas las plataformas principales (Meta, Google, TikTok). También contamos con un programa para la evolución del artista o marca, que incluye construcción de redes sociales y creación de contenido viral. Además, nos especializamos en publicidad estratégica para eventos.",
  },
  {
    question: "¿Cuál es el costo de sus servicios?",
    answer:
      "Todo depende del objetivo. Tenemos múltiples servicios para todo tipo de presupuesto. Por ejemplo, las consultas estratégicas tienen un costo de $250, y el servicio de manejo de campaña tiene un mínimo requerido de inversión de $3,000.",
  },
  {
    question: "¿Se puede hacer una consulta tú a tú?",
    answer:
      "Sí. Si desea discutir problemas e ideas específicas para llegar a su meta, puede agendar una <a href='tel:+13053225709' class='text-[#4aa8ff] hover:underline inline-flex items-center gap-1 font-medium'>LLAMADA</a> con un mínimo de una hora de duración.",
  },
  {
    question: "¿Cuáles son las características que buscamos para trabajar una campaña?",
    answer:
      "Buscamos proyectos que ya cuenten con presencia musical, una marca personal definida y actividad constante en redes sociales para maximizar el impacto de la inversión.",
  },
  {
    question: "¿Cómo sé si mi campaña fue aceptada?",
    answer:
      "Si su propuesta es aceptada para trabajar con nosotros, recibirá una confirmación por correo electrónico en un periodo de 5 a 10 días hábiles.",
  },
  {
    question: "¿Con quién han trabajado?",
    answer:
      "Hemos ayudado a artistas a evolucionar desde sus comienzos hasta un rango global. Nuestra lista incluye a Rauw Alejandro, Don Omar, Ivy Queen, Miguel Bosé, y marcas como Beamina y Vaqueros de Bayamón. Trabajamos tanto con artistas establecidos como con talentos emergentes y publicidad para eventos masivos.",
  },
];

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Preguntas Frecuentes</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Everything you need to know about the method.
        </h2>
      </motion.div>

      <div className="mt-12 space-y-4">
        {FAQS.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/[0.05]"
            >
              <span className="text-lg font-medium text-white">{faq.question}</span>
              {openIndex === index ? (
                <Minus className="size-5 text-[#9bd0ff]" />
              ) : (
                <Plus className="size-5 text-slate-400" />
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
