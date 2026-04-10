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
    "Resultados reales en Puerto Rico. Estrategia, creatividad y visibilidad total para marcas y operadores que exigen ROI. No más agency blackout.",
  openGraph: {
    title: "Agenda tu auditoría | Outlet Media",
    description:
      "Resultados reales en Puerto Rico. Estrategia, creatividad y visibilidad total. No más agency blackout.",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  robots: { index: true, follow: true },
};

export default function LandingPage() {
  return (
    <div
      className={`${landingFont.className} min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(31,94,255,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_22%),linear-gradient(180deg,#07111f_0%,#060d18_52%,#050a13_100%)] text-white`}
    >
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10 lg:pb-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,420px)] lg:items-start lg:justify-center lg:gap-10">
          <section className="overflow-hidden rounded-[34px] border border-[#0c1d35] bg-[linear-gradient(180deg,#081425_0%,#071120_100%)] shadow-[0_55px_120px_-48px_rgba(15,23,42,0.7)]">
            <LandingHero />
            <LandingCredibility />
            <div className="px-4 pb-4 pt-2 sm:px-5">
              <a
                href="#audit-form"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1f5eff] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] transition-colors hover:bg-[#184de0]"
              >
                Agenda tu auditoría
                <ArrowRight className="size-4" />
              </a>
            </div>
          </section>

          <section className="overflow-hidden rounded-[34px] border border-[#0c1d35] bg-[linear-gradient(180deg,#081425_0%,#071120_100%)] shadow-[0_55px_120px_-48px_rgba(15,23,42,0.7)] lg:sticky lg:top-8">
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingFAQ />
            <ContactForm />
            <div className="px-4 pb-4 pt-2 sm:px-5">
              <a
                href="#audit-form"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1f5eff] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] transition-colors hover:bg-[#184de0]"
              >
                Agenda tu auditoría
              </a>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#081220]/88 px-4 py-3 shadow-[0_-18px_50px_-24px_rgba(15,23,42,0.65)] backdrop-blur-xl lg:hidden">
        <a
          href="#audit-form"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1f5eff] px-5 text-sm font-semibold tracking-wide text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] transition-transform active:scale-[0.99]"
        >
          Agenda tu auditoría
          <ArrowRight className="size-4" />
        </a>
      </div>
    </div>
  );
}
