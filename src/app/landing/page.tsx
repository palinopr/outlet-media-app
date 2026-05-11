import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Outfit } from "next/font/google";
import Image from "next/image";
import { ContactForm } from "@/components/landing/contact-form";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingHero } from "@/components/landing/hero";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingTrackedLink } from "@/components/landing/tracked-link";
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
  title: "Outlet Media · Anuncios que traen clientes en Puerto Rico",
  description:
    "Recibe un diagnóstico gratis para saber si necesitas setup, arreglar campañas o dejar que Outlet corra tus anuncios hacia WhatsApp, citas, ventas o boletos.",
  alternates: { canonical: "/landing" },
  openGraph: {
    title: "Outlet Media · Anuncios que traen clientes en Puerto Rico",
    description:
      "Revisamos tu cuenta, oferta, tracking y ruta de conversión para decirte qué arreglar primero.",
    url: "/landing",
    type: "website",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Outlet Media · Anuncios que traen clientes en Puerto Rico",
    description:
      "Diagnóstico gratis para saber qué ruta de anuncios necesita tu negocio.",
    images: ["/icon.png"],
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
      <div className="relative min-h-screen bg-[linear-gradient(180deg,#101010_0%,#0d0d0d_42%,#111111_100%)] text-white [overflow-x:clip]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:34px_34px]" />

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
            <LandingTrackedLink
              href="#form"
              eventPayload={{ source: "nav", target: "form" }}
              className="inline-flex h-11 items-center justify-center rounded-[10px] bg-white px-4 font-[family-name:var(--font-landing-heading)] text-[13px] font-extrabold text-[#0d0d0d] shadow-[0_14px_32px_-18px_rgba(255,255,255,0.65)] transition-transform hover:scale-[1.02]"
            >
              Diagnóstico gratis
            </LandingTrackedLink>
          </nav>

          <LandingHero />
          <LandingProofStats />
          <LandingPathSelector />
          <ContactForm />
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
