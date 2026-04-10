import Image from "next/image";
import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/landing" className="flex items-center">
          <Image
            src="/images/brand/logotype-horizontal-blue.png"
            alt="Outlet Media"
            width={172}
            height={34}
            className="h-7 w-auto sm:h-8"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="tel:+13053225709"
            className="hidden rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950 sm:inline-flex"
          >
            Llama directa
          </a>
          <a
            href="#audit-form"
            className="inline-flex rounded-full bg-[#1f5eff] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_34px_-16px_rgba(31,94,255,0.75)] transition-colors hover:bg-[#184de0]"
          >
            Agenda tu auditoría
          </a>
        </div>
      </div>
    </header>
  );
}
