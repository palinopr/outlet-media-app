import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { LandingCredibility } from "@/components/landing/credibility";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingStats } from "@/components/landing/stats";
import { ContactForm } from "@/components/landing/contact-form";
import { LandingFooter } from "@/components/landing/footer";

const landingFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Outlet Media | Performance Agency for Artists, Events, and Brands",
  description:
    "Performance agency for artists, tours, nightlife, venues, and brands. Creative, paid media, and AI-backed operating visibility built to move tickets and revenue.",
  openGraph: {
    title: "Outlet Media",
    description:
      "Creative, media, and AI-backed operating visibility built to move tickets and revenue.",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  robots: { index: true, follow: true },
};

export default function LandingPage() {
  return (
    <div
      className={`${landingFont.className} dark relative min-h-screen overflow-x-hidden bg-[#07111f] text-slate-100 [background-image:radial-gradient(circle_at_top_left,rgba(74,168,255,0.22),transparent_28%),radial-gradient(circle_at_88%_14%,rgba(249,115,22,0.18),transparent_22%),linear-gradient(180deg,#07111f_0%,#081421_38%,#050b14_100%)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div className="relative z-10">
        <LandingNav />
        <LandingHero />
        <LandingFeatures />
        <LandingCredibility />
        <LandingHowItWorks />
        <LandingStats />
        <ContactForm />
        <LandingFooter />
      </div>
    </div>
  );
}
