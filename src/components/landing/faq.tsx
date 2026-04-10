"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "¿Trabajan solo con música?",
    answer:
      "No. Música y eventos es una fortaleza clara, pero también trabajamos ecommerce, sports, nightlife y otras marcas que necesitan mejor conversión y más visibilidad operativa.",
  },
  {
    question: "¿Necesito un gran presupuesto?",
    answer:
      "No necesariamente. Si ya estás invirtiendo y sientes que el dinero se pierde entre creativos, reporting o ejecución, ya hay suficiente señal para una auditoría útil.",
  },
  {
    question: "¿Qué pasa en la auditoría?",
    answer:
      "Revisamos oferta, funnel, creativos, tracking y reporting. Sales pitch no. Sales con una lectura clara de fugas, prioridades y próximos movimientos.",
  },
  {
    question: "¿El agente corre todo solo?",
    answer:
      "No. El agente del portal ayuda con reporting, contexto y follow-through visible. La ejecucion sigue siendo controlada y el cliente no ve estructura interna ni setup sensible.",
  },
] as const;

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-white/8 px-5 py-7 text-white sm:px-6">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        FAQ
      </p>
      <h2 className="mt-3 text-center text-[2rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.1rem]">
        Preguntas frecuentes
      </h2>
      <p className="mx-auto mt-2.5 max-w-[18rem] text-center text-[14px] leading-6 text-slate-300 sm:max-w-[20rem] sm:text-[15px]">
        Lo que casi siempre preguntan antes de entrar a una auditoría.
      </p>
      <div className="mt-6 space-y-3.5">
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`overflow-hidden rounded-[18px] border bg-[#0b182d] transition-colors ${open ? "border-[#61c0ff]/35 shadow-[0_18px_40px_-28px_rgba(59,130,246,0.5)]" : "border-white/10"}`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 p-4 sm:p-5 text-left"
              >
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${open ? "border-[#61c0ff]/25 bg-[#61c0ff]/10 text-[#b9e5ff]" : "border-white/10 bg-white/[0.04] text-slate-300"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] font-semibold leading-6 text-white sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open ? (
                <p className="px-4 pb-5 pr-10 text-[14px] leading-6 text-slate-300 sm:px-5">
                  {faq.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
