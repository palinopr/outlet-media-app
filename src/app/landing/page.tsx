import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { LandingCredibility } from "@/components/landing/credibility";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFAQ } from "@/components/landing/faq";
import { ContactForm } from "@/components/landing/contact-form";
import { LandingFooter } from "@/components/landing/footer";

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
      className={`${landingFont.className} min-h-screen bg-[radial-gradient(circle_at_top,rgba(31,42,165,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(80,22,136,0.14),transparent_24%),linear-gradient(180deg,#f5f9ff_0%,#eef5ff_48%,#edf4ff_100%)] text-slate-950`}
    >
      <LandingNav />

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:pb-12 lg:pt-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-6">
            <LandingHero />
            <LandingCredibility />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <LandingFeatures />
            <LandingHowItWorks />
            <LandingFAQ />
            <ContactForm />
          </aside>
        </div>

        <LandingFooter />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/70 bg-white/88 px-4 py-3 shadow-[0_-18px_50px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:hidden">
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
