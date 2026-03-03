import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingStats } from "@/components/landing/stats";
import { ContactForm } from "@/components/landing/contact-form";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Outlet Media -- AI-Powered Ads for Music Promoters",
  description:
    "Autonomous Meta ad campaigns managed by AI agents. Real-time ROAS tracking, Ticketmaster integration, and audience optimization for music promoters.",
  robots: { index: true, follow: true },
};

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingStats />
      <ContactForm />
      <LandingFooter />
    </div>
  );
}
