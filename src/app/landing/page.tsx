import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { LandingHero } from "@/components/landing/hero";
import { LandingCredibility } from "@/components/landing/credibility";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFAQ } from "@/components/landing/faq";
import { ContactForm } from "@/components/landing/contact-form";

const landingFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agenda tu auditoría | Outlet Media",
  description:
    "Paid media, reporting live y portal con agente para operadores que necesitan ver que mueve revenue. Sin agency blackout.",
  openGraph: {
    title: "Agenda tu auditoría | Outlet Media",
    description:
      "Paid media, reporting live y portal con agente para operadores que necesitan ver que mueve revenue.",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  robots: { index: true, follow: true },
};

export default function LandingPage() {
  return (
    <div
      className={`${landingFont.className} relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(31,94,255,0.18),transparent_26%),linear-gradient(180deg,#081320_0%,#060d18_48%,#040913_100%)] text-white lg:bg-[linear-gradient(180deg,#f7fbff_0%,#ecf4fb_46%,#eef5fb_100%)]`}
    >
      <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top_left,rgba(31,94,255,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_26%)] lg:block" />
      <div className="pointer-events-none absolute inset-0 hidden opacity-30 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:140px_140px] lg:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_56%)] lg:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[20rem] bg-[radial-gradient(circle_at_bottom,rgba(2,6,23,0.16),transparent_70%)] lg:block" />

      <main className="relative mx-auto max-w-[1280px] px-0 pb-28 pt-0 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.76fr)] lg:items-start lg:justify-center lg:gap-14 xl:gap-20">
          <section className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(72,148,255,0.16),transparent_28%),linear-gradient(180deg,#081320_0%,#060d18_45%,#040913_100%)] lg:mt-8 lg:rounded-[2.5rem] lg:border lg:border-[#10233f] lg:shadow-[0_55px_120px_-48px_rgba(4,10,18,0.74)] xl:-translate-y-2">
            <LandingHero />
            <LandingCredibility />
          </section>

          <section className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(72,148,255,0.16),transparent_28%),linear-gradient(180deg,#081320_0%,#060d18_45%,#040913_100%)] lg:mt-22 lg:rounded-[2.5rem] lg:border lg:border-[#10233f] lg:shadow-[0_55px_120px_-48px_rgba(4,10,18,0.74)] xl:mt-26 xl:translate-y-2">
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingFAQ />
            <ContactForm />
          </section>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pt-2 lg:hidden">
        <div className="mx-auto max-w-md rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(31,94,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.14),transparent_36%),rgba(8,18,32,0.88)] p-3 shadow-[0_-18px_50px_-24px_rgba(15,23,42,0.45),0_18px_44px_-28px_rgba(2,6,23,0.8)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8fd4ff]">
                Auditoria con operador
              </p>
              <p className="mt-1 max-w-[11rem] text-[13px] leading-5 text-slate-200">
                Ve fugas, creativos y siguiente movimiento.
              </p>
            </div>

            <a
              href="#audit-form"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1f5eff] px-4 text-sm font-semibold tracking-wide text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] transition-transform active:scale-[0.99]"
            >
              Agenda
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
