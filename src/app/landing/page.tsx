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
      className={`${landingFont.className} relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#ecf4fb_46%,#eef5fb_100%)] text-white`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(31,94,255,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:140px_140px]" />

      <main className="relative mx-auto max-w-[1180px] px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:justify-center lg:gap-8 xl:gap-12">
          <section className="overflow-hidden rounded-[2.4rem] border border-[#10233f] bg-[radial-gradient(circle_at_top,rgba(72,148,255,0.16),transparent_28%),linear-gradient(180deg,#081320_0%,#060d18_45%,#040913_100%)] shadow-[0_55px_120px_-48px_rgba(4,10,18,0.74)] lg:mt-10">
            <LandingHero />
            <LandingCredibility />
            <div className="px-5 pb-5 pt-2 sm:px-6">
              <a
                href="#audit-form"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1f5eff] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.8)] transition-colors hover:bg-[#184de0]"
              >
                Agenda tu auditoría
                <ArrowRight className="size-4" />
              </a>
            </div>
          </section>

          <section className="overflow-hidden rounded-[2.4rem] border border-[#10233f] bg-[radial-gradient(circle_at_top,rgba(72,148,255,0.16),transparent_28%),linear-gradient(180deg,#081320_0%,#060d18_45%,#040913_100%)] shadow-[0_55px_120px_-48px_rgba(4,10,18,0.74)]">
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingFAQ />
            <ContactForm />
            <div className="px-5 pb-5 pt-2 sm:px-6">
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

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#081220]/82 px-4 py-3 shadow-[0_-18px_50px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:hidden">
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
