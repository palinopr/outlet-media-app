import Image from "next/image";

export function LandingFeatures() {
  return (
    <section className="border-b border-white/8 px-5 pb-6 pt-8 text-white sm:px-6">
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
        Operator profile
      </p>
      <div className="mt-4 overflow-hidden rounded-[28px] border border-[#61c0ff]/20 bg-[radial-gradient(circle_at_top,rgba(97,192,255,0.12),transparent_28%),linear-gradient(180deg,#0a172a_0%,#081220_100%)] shadow-[0_0_0_1px_rgba(97,192,255,0.06),0_30px_64px_-36px_rgba(36,99,235,0.5)]">
        <div className="relative aspect-[1.02/0.96] border-b border-white/10">
          <Image
            src="/images/landing/jaime-ortiz-founder.jpg"
            alt="Jaime Ortiz"
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,21,0.08)_0%,rgba(3,9,21,0.34)_42%,rgba(8,20,33,0.98)_100%)]" />
        </div>
        <div className="p-5 text-center">
          <h2 className="text-[2rem] font-semibold leading-[1.02] tracking-tight text-white">
            Operadores, no “creativos”.
          </h2>
          <div className="mt-4 space-y-4 text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
            <p>
              Soy Jaime Ortiz. Outlet no es una agencia tradicional. Somos partners estratégicos
              obsesionados con crecimiento.
            </p>
            <p>
              Usamos cultura para atraer y la data para convertir. El objetivo no es que te guste
              el reporte; es que el negocio se mueva.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
