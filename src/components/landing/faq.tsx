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
    <section className="border-b border-white/8 px-4 py-6 text-white sm:px-5">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
        FAQ
      </p>
      <div className="mt-5 space-y-3">
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question} className="rounded-[18px] border border-white/10 bg-[#0b182d]">
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
