import Image from "next/image";

export function LandingFeatures() {
  return (
    <section className="border-b border-white/8 px-5 pb-7 pt-7 text-white sm:px-6">
      <div className="overflow-hidden rounded-[28px] border border-[#61c0ff]/20 bg-[radial-gradient(circle_at_top,rgba(97,192,255,0.12),transparent_28%),linear-gradient(180deg,#0a172a_0%,#081220_100%)] shadow-[0_0_0_1px_rgba(97,192,255,0.06),0_30px_64px_-36px_rgba(36,99,235,0.5)]">
        <div className="relative aspect-[1.05/0.9] border-b border-white/10">
          <Image
            src="/images/landing/jaime-ortiz-founder.jpg"
            alt="Jaime Ortiz"
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className="object-cover object-[center_18%]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(97,192,255,0.14),transparent_26%),linear-gradient(180deg,rgba(3,9,21,0.06)_0%,rgba(3,9,21,0.28)_38%,rgba(8,20,33,0.98)_100%)]" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#07111d]/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
            Jaime Ortiz
          </div>
          <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-[#07111d]/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
            Founder / operator
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap gap-1.5">
            {[
              "Paid media",
              "Ticketing",
              "Reporting",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300"
              >
                {chip}
              </span>
            ))}
          </div>
          <h2 className="mt-4 max-w-[11ch] text-[1.95rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[2.15rem]">
            Operadores, no creativos de vitrina.
          </h2>
          <div className="mt-4 max-w-[28rem] space-y-3.5 text-[15px] leading-6 text-slate-300 sm:text-base sm:leading-7">
            <p>
              Outlet no vende humo de agencia. Diagnostica, decide, ejecuta y enseña la data para
              que el crecimiento no dependa de fe.
            </p>
            <p>
              La meta no es entregarte un deck bonito. Es que sepas qué creativo cerró, qué canal
              escaló y cuál es el próximo movimiento con menos fricción.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
