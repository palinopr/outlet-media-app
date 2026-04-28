import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import { LandingHero } from "@/components/landing/hero";
import { LandingVerticalProof } from "@/components/landing/vertical-proof";
import { LandingScarcityBanner } from "@/components/landing/scarcity-banner";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFounder } from "@/components/landing/founder";
import { LandingFAQ } from "@/components/landing/faq";
import { ContactForm } from "@/components/landing/contact-form";
import { LandingStickyCTA } from "@/components/landing/sticky-cta";
import { DotPattern } from "@/components/landing/ui/dot-pattern";
import {
  LandingAuditDeliverables,
  LandingBookingSection,
  LandingMidPageCTA,
  LandingProblemSection,
  LandingProofStats,
} from "@/components/landing/lead-funnel";

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
  title: "Outlet Media · Auditoría gratis de tus ads en 24h",
  description:
    "Pagas por anuncios y nadie te dice si venden. Nosotros sí. Auditoría gratis en 24h para ecommerce, eventos, leads y tours en Puerto Rico.",
  openGraph: {
    title: "Outlet Media · Auditoría gratis de tus ads en 24h",
    description:
      "Pagas por anuncios y nadie te dice si venden. Nosotros sí. Auditoría gratis en 24h.",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  robots: { index: true, follow: true },
};

const BRAND_TOKENS = {
  "--landing-bg": "#0d0d0d",
  "--landing-bg-elev": "#141414",
  "--landing-fg": "#ffffff",
  "--landing-muted": "#a3a3a3",
  "--landing-muted-2": "#666666",
  "--landing-border": "rgba(255,255,255,0.08)",
  "--landing-brand": "#1e1fb8",
  "--landing-brand-soft": "#4d4fd9",
} as React.CSSProperties;

export default function LandingPage() {
  return (
    <div
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} font-[family-name:var(--font-landing-body)]`}
      style={BRAND_TOKENS}
    >
      <div className="relative min-h-screen bg-[#0d0d0d] text-white [overflow-x:clip]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px]">
          <DotPattern
            width={28}
            height={28}
            cr={0.8}
            className="[mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_40%,transparent_100%)] text-white/[0.06]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(30,31,184,0.12),transparent)]" />
        <main className="relative z-[2] mx-auto max-w-[460px] px-5 pb-32 pt-6 lg:max-w-[1120px] lg:px-10 lg:pb-20 lg:pt-14">
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
              href="#booking"
              className="font-[family-name:var(--font-landing-mono)] text-[11px] uppercase tracking-[0.14em] text-[color:var(--landing-muted)] transition-colors hover:text-white"
            >
              Agenda gratis →
            </a>
          </nav>

          <LandingHero />
          <LandingProofStats />
          <LandingProblemSection />
          <LandingAuditDeliverables />
          <LandingVerticalProof />
          <LandingMidPageCTA />
          <section id="como-funciona">
            <LandingHowItWorks />
          </section>
          <LandingFounder />
          <LandingScarcityBanner />
          <LandingBookingSection />
          <ContactForm />
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
