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
      className={`${landingFont.className} relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(31,94,255,0.18),transparent_26%),linear-gradient(180deg,#081320_0%,#060d18_48%,#040913_100%)] text-white lg:bg-[linear-gradient(180deg,#f7fbff_0%,#ecf4fb_46%,#eef5fb_100%)]`}
    >
      <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top_left,rgba(31,94,255,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_26%)] lg:block" />
      <div className="pointer-events-none absolute inset-0 hidden opacity-30 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:140px_140px] lg:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[28rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_56%)] lg:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[20rem] bg-[radial-gradient(circle_at_bottom,rgba(2,6,23,0.16),transparent_70%)] lg:block" />

      <main className="relative mx-auto max-w-[1240px] px-0 pb-28 pt-0 lg:px-8 lg:pb-18 lg:pt-12">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.82fr)] lg:items-start lg:justify-center lg:gap-12 xl:gap-16">
          <section className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(72,148,255,0.16),transparent_28%),linear-gradient(180deg,#081320_0%,#060d18_45%,#040913_100%)] lg:mt-10 lg:rounded-[2.4rem] lg:border lg:border-[#10233f] lg:shadow-[0_55px_120px_-48px_rgba(4,10,18,0.74)]">
            <LandingHero />
            <LandingCredibility />
          </section>

          <section className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(72,148,255,0.16),transparent_28%),linear-gradient(180deg,#081320_0%,#060d18_45%,#040913_100%)] lg:mt-6 lg:rounded-[2.4rem] lg:border lg:border-[#10233f] lg:shadow-[0_55px_120px_-48px_rgba(4,10,18,0.74)]">
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingFAQ />
            <ContactForm />
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
