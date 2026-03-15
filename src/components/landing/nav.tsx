"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Why Us", href: "#why-outlet" },
  { label: "Proof", href: "#proof" },
  { label: "Method", href: "#method" },
  { label: "System", href: "#system" },
  { label: "Contact", href: "#contact" },
] as const;

export function LandingNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/78 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
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
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#contact"
            className="hidden h-9 items-center justify-center rounded-full bg-[#4aa8ff] px-4 text-sm font-semibold text-[#06111d] transition-colors hover:bg-[#70bbff] sm:inline-flex"
          >
            Book a Strategy Call
          </a>
          <Button variant="outline" size="sm" asChild>
            <Link
              href="/sign-in"
              className="rounded-full border-white/15 bg-white/[0.03] px-4 text-slate-100 hover:bg-white/[0.08]"
            >
              Log In
            </Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
