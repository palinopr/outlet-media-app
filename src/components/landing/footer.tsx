import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/brand/symbol-white.png"
              alt="Outlet Media"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-sm font-semibold tracking-wide text-white">Outlet Media</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Performance agency for artists, tours, nightlife, venues, and brands. Creative, media,
            and an operating system that keeps campaigns moving and clients close to the work.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
          <span>&copy; {new Date().getFullYear()} Outlet Media</span>
          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white">
            Terms of Service
          </Link>
          <a href="mailto:support@outletmedia.co" className="transition-colors hover:text-white">
            support@outletmedia.co
          </a>
        </div>
      </div>
    </footer>
  );
}
