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

function PhoneShell({ children, width = "max-w-[460px]" }: { children: React.ReactNode; width?: string }) {
  return (
    <div className={`relative mx-auto w-full ${width}`}>
      <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(circle_at_top,rgba(31,94,255,0.2),transparent_32%),radial-gradient(circle_at_bottom,rgba(80,22,136,0.14),transparent_30%)] blur-2xl" />
      <div className="relative rounded-[42px] border-[6px] border-[#0c1220] bg-[#060c17] p-3 shadow-[0_55px_120px_-48px_rgba(15,23,42,0.7)]">
        <div className="absolute left-1/2 top-3 h-7 w-28 -translate-x-1/2 rounded-full bg-black/85" />
        <div className="min-h-full overflow-hidden rounded-[30px] border border-white/6 bg-[linear-gradient(180deg,#081425_0%,#071120_100%)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div
      className={`${landingFont.className} min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(232,244,255,0.96)_50%,rgba(223,238,255,0.96)_100%)] text-slate-950`}
    >
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12 lg:pb-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_minmax(0,380px)] lg:justify-center lg:gap-10 xl:grid-cols-[minmax(0,460px)_minmax(0,390px)]">
          <PhoneShell width="max-w-[460px]">
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
          </PhoneShell>

          <PhoneShell width="max-w-[390px]">
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
          </PhoneShell>
        </div>
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
