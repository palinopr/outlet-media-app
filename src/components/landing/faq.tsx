"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "¿Solo trabajan con música y eventos?",
    answer:
      "No. También trabajamos con ecommerce, deportes, nightlife, marcas y negocios que necesitan mejor conversión y más visibilidad sobre lo que está funcionando.",
  },
  {
    question: "¿Qué presupuesto necesito para empezar?",
    answer:
      "Lo ajustamos al contexto. Si ya estás invirtiendo y sientes que el dinero se está perdiendo entre creativos, reporting o ejecución, vale la pena hablarlo.",
  },
] as const;

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/80 bg-[#071427] text-white shadow-[0_32px_80px_-42px_rgba(15,23,42,0.45)]">
      <div className="border-b border-white/10 px-6 py-5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
        FAQ
      </div>
      <div className="space-y-3 p-5">
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question} className="rounded-[20px] border border-white/10 bg-[#0b182d]">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <span className="text-sm font-semibold text-white sm:text-base">{faq.question}</span>
                <ChevronDown className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open ? <p className="px-4 pb-4 text-sm leading-7 text-slate-300">{faq.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
