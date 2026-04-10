import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { CalendarDays, PhoneCall } from "lucide-react";
import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { LandingCredibility } from "@/components/landing/credibility";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingStats } from "@/components/landing/stats";
import { ContactForm } from "@/components/landing/contact-form";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

const landingFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Puerto Rico Lead Funnels | Outlet Media",
  description:
    "Mobile-first paid media funnels for Puerto Rico brands, artists, events, ecommerce, and local service businesses. Turn ad clicks into qualified leads and booked calls.",
  openGraph: {
    title: "Puerto Rico Lead Funnels | Outlet Media",
    description:
      "Mobile-first landing pages and paid-media funnels built to turn clicks into booked calls, qualified leads, and revenue.",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
  },
  robots: { index: true, follow: true },
};

export default function LandingPage() {
  return (
    <div
      className={`${landingFont.className} dark relative min-h-screen overflow-x-hidden bg-[#07111f] pb-24 text-slate-100 sm:pb-0 [background-image:radial-gradient(circle_at_top_left,rgba(74,168,255,0.22),transparent_28%),radial-gradient(circle_at_88%_14%,rgba(249,115,22,0.18),transparent_22%),linear-gradient(180deg,#07111f_0%,#081421_38%,#050b14_100%)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div className="relative z-10">
        <LandingNav />
        <LandingHero />
        <LandingCredibility />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingStats />
        <LandingFAQ />
        <ContactForm />
        <LandingFooter />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#07111f]/95 px-4 py-3 backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-white/15 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"
          >
            <a href="tel:+13053225709">
              <PhoneCall className="size-4" />
              Llamar
            </a>
          </Button>
          <Button
            asChild
            className="h-12 rounded-full bg-[#4aa8ff] font-semibold text-[#06111d] hover:bg-[#72beff]"
          >
            <a href="#contact">
              <CalendarDays className="size-4" />
              Solicitar cita
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
