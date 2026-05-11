import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Outfit } from "next/font/google";
import Image from "next/image";
import { ContactForm } from "@/components/landing/contact-form";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingHero } from "@/components/landing/hero";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import {
  LandingAuditDeliverables,
  LandingBookingSection,
  LandingFounderTrust,
  LandingMidPageCTA,
  LandingPathSelector,
  LandingProblemSection,
  LandingProofCarousel,
  LandingProofStats,
  LandingScarcitySection,
} from "@/components/landing/lead-funnel";
import { LandingStickyCTA } from "@/components/landing/sticky-cta";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-heading",
});

const bodyFont = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-body",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://outletmedia.net"),
  title: "Outlet Media · Paid Growth System",
  description:
    "Outlet helps Puerto Rico businesses build and run the ad system behind sales, leads, bookings, tickets, and WhatsApp conversations.",
  openGraph: {
    title: "Outlet Media · Paid Growth System",
    description:
      "Find your starting point: setup, fix, sprint, or managed growth.",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  robots: { index: true, follow: true },
};

const BRAND_TOKENS = {
  "--landing-bg": "#0d0d0d",
  "--landing-bg-elev": "#141414",
  "--landing-muted": "#a3a3a3",
  "--landing-muted-2": "#686868",
  "--landing-border": "rgba(255,255,255,0.09)",
  "--landing-brand": "#1e1fb8",
  "--landing-brand-soft": "#5661ff",
} as React.CSSProperties;

export default function LandingPage() {
  return (
    <div
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} font-[family-name:var(--font-landing-body)]`}
      style={BRAND_TOKENS}
    >
      <div className="relative min-h-screen bg-[#0d0d0d] text-white [overflow-x:clip]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_46%_at_50%_-10%,rgba(30,31,184,0.18),transparent)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px]" />

        <main className="relative z-[1] mx-auto max-w-[460px] px-5 pb-32 pt-6 lg:max-w-[1120px] lg:px-10 lg:pb-20 lg:pt-14">
          <nav className="flex items-center justify-between gap-3 pb-4">
            <Image
              src="/images/brand/logotype-horizontal-white.png"
              alt="Outlet Media"
              width={192}
              height={54}
              priority
              className="opacity-90"
              style={{ width: 140, height: "auto" }}
            />
            <a
              href="#form"
              className="font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.14em] text-[color:var(--landing-muted)] transition-colors hover:text-white"
            >
              Gratis →
            </a>
          </nav>

          <LandingHero />
          <LandingPathSelector />
          <ContactForm />
          <LandingProofStats />
          <LandingProblemSection />
          <LandingAuditDeliverables />
          <LandingProofCarousel />
          <LandingMidPageCTA />
          <LandingHowItWorks />
          <LandingFounderTrust />
          <LandingScarcitySection />
          <LandingBookingSection />
          <LandingFAQ />

          <footer className="mt-16 flex items-center justify-between border-t border-[color:var(--landing-border)] pb-6 pt-6 font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.08em] text-[color:var(--landing-muted-2)]">
            <span>Outlet Media · 2026</span>
            <span>Hecho en Puerto Rico</span>
          </footer>
        </main>

        <LandingStickyCTA />
      </div>
    </div>
  );
}
