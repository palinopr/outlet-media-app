"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Proof", href: "#proof" },
  { label: "Offer", href: "#offer" },
  { label: "Funnel", href: "#funnel" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacto", href: "#contact" },
] as const;

export function LandingNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/82 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/landing" className="flex items-center">
          <Image
            src="/images/brand/logotype-horizontal-white.png"
            alt="Outlet Media"
            width={172}
            height={34}
            className="h-7 w-auto sm:h-8"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300/85 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="tel:+13053225709"
            className="hidden h-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.08] sm:inline-flex"
          >
            Llamar ahora
          </a>
          <a
            href="#contact"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#4aa8ff] px-4 text-sm font-semibold text-[#06111d] transition-colors hover:bg-[#70bbff]"
          >
            Solicitar cita
          </a>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link
              href="/sign-in"
              className="rounded-full border-white/15 bg-white/[0.03] px-4 text-slate-100 hover:bg-white/[0.08]"
            >
              Portal
            </Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
