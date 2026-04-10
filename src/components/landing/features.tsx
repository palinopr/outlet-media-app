import Image from "next/image";

export function LandingFeatures() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/80 bg-[#071427] text-white shadow-[0_32px_80px_-42px_rgba(15,23,42,0.45)]">
      <div className="border-b border-white/10 px-6 py-5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
        Operator profile
      </div>
      <div className="p-5">
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0b182d]">
          <div className="relative aspect-[1.08/1] border-b border-white/10">
            <Image
              src="/images/landing/jaime-ortiz-founder.jpg"
              alt="Jaime Ortiz"
              fill
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081421] via-transparent to-transparent" />
          </div>
          <div className="p-5">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Operadores, no “creativos”.
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-slate-300">
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
      </div>
    </section>
  );
}
