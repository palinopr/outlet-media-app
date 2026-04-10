import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="mt-12 rounded-[28px] border border-white/80 bg-white/72 px-6 py-6 text-sm text-slate-600 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-slate-900">Outlet Media</p>
          <p className="mt-1 max-w-xl">
            Cultura, contenido, commerce y visibilidad real para marcas, artistas, eventos y
            operadores que necesitan más que clicks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href="mailto:info@outletmedia.net" className="transition-colors hover:text-slate-950">
            info@outletmedia.net
          </a>
          <a href="https://www.instagram.com/outletmediainc" className="transition-colors hover:text-slate-950">
            @outletmediainc
          </a>
          <a href="tel:+13053225709" className="transition-colors hover:text-slate-950">
            +1 (305) 322-5709
          </a>
          <Link href="/privacy" className="transition-colors hover:text-slate-950">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-slate-950">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
