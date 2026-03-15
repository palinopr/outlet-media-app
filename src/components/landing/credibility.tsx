"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Building2, MapPin, Music4, Sparkles, Star } from "lucide-react";

const PROOF_STATS = [
  { value: "$12M+", label: "Managed campaign volume across approved Outlet materials" },
  { value: "150+", label: "Sold-out events across tours, nightlife, and partner calendars" },
  { value: "20", label: "Connected Meta ad accounts reviewed in the live inventory" },
  { value: "1,659", label: "Campaigns visible in connected Meta history" },
] as const;

const FEATURED_WORK = [
  {
    name: "Rauw Alejandro",
    category: "World-tour creative",
    detail: "Approved archive poster from the Shauring La Sola Tour run.",
    image: "/images/landing/rauw-shauring.png",
    accent: "from-[#4aa8ff]/55 via-[#4aa8ff]/10 to-transparent",
  },
  {
    name: "Luis Miguel",
    category: "Tour photography",
    detail: "Approved performance image from the Outlet website asset folder.",
    image: "/images/landing/luis-miguel.png",
    accent: "from-[#f97316]/55 via-[#f97316]/10 to-transparent",
  },
  {
    name: "Gilberto Santa Rosa",
    category: "Latin icon roster signal",
    detail: "Named in the master project roster and backed by approved live imagery.",
    image: "/images/landing/gilberto-santa-rosa.png",
    accent: "from-emerald-400/45 via-emerald-400/10 to-transparent",
  },
  {
    name: "Young Miko x Oasis Miami",
    category: "Nightlife event promotion",
    detail: "Approved event-poster creative from the website archive.",
    image: "/images/landing/young-miko-poster.png",
    accent: "from-fuchsia-400/45 via-fuchsia-400/10 to-transparent",
  },
] as const;

const OUTCOME_PROOF = [
  {
    name: "Don Omar",
    value: "99.38%",
    label: "sell-through",
    detail: "Back to Reggaeton with record sales noted for F1 Miami.",
  },
  {
    name: "Rauw Alejandro",
    value: "370K+",
    label: "tickets sold",
    detail: "World-tour result called out in the approved company document.",
  },
  {
    name: "Beamina",
    value: "63K+",
    label: "sales generated",
    detail: "ROAS 5.2 and exclusive-community growth highlighted in the master doc.",
  },
  {
    name: "Vaqueros de Bayamon",
    value: "13.6",
    label: "ROAS",
    detail: "$345K in sales referenced in the approved Outlet materials.",
  },
] as const;

const LOGO_PROOF = [
  {
    name: "Duars Live",
    image: "/images/landing/duars-live.png",
    width: 160,
    height: 160,
  },
  {
    name: "9AM",
    image: "/images/landing/9am.png",
    width: 200,
    height: 120,
  },
  {
    name: "Gallimbo Studios",
    image: "/images/landing/gallimbo-studios.png",
    width: 180,
    height: 120,
  },
] as const;

const ROSTER_PROOF = [
  { name: "Rauw Alejandro", proof: "80 matched Meta campaigns" },
  { name: "Don Omar", proof: "40 matched Meta campaigns" },
  { name: "Ricardo Arjona", proof: "22 matched Meta campaigns" },
  { name: "Ivy Queen", proof: "32 matched Meta campaigns" },
  { name: "House78", proof: "32 matched Meta campaigns" },
  { name: "Oasis", proof: "30 matched Meta campaigns" },
  { name: "Beamina", proof: "36 matched Meta campaigns" },
  { name: "Camila", proof: "7 matched Meta campaigns" },
  { name: "Ryan Castro", proof: "7 matched Meta campaigns" },
  { name: "Darell", proof: "8 matched Meta campaigns" },
  { name: "Young Chimi", proof: "4 matched Meta campaigns" },
  { name: "Luis Miguel", proof: "3 matched Meta campaigns" },
  { name: "Christian Nodal", proof: "2 matched Meta campaigns" },
  { name: "El Alfa", proof: "2 matched Meta campaigns" },
  { name: "Farruko", proof: "1 matched Meta campaign" },
  { name: "Alofoke", proof: "1 matched Meta campaign" },
] as const;

const CLIENT_PROOF = [
  "Beamina",
  "Be Smart Mobile",
  "Don Omar",
  "Grupo Firme",
  "Ivy Queen",
  "Marco Antonio Solis",
  "Miguel Bose",
  "9AM Banger",
  "Vibra Urbana",
  "Leisure Boat Experience",
  "TU Planta PR",
  "21 Nation",
] as const;

const VENUE_PROOF = [
  "Golden 1 Center",
  "Climate Pledge Arena",
  "Honda Center",
  "Chase Center",
  "State Farm Arena",
  "Estadio Olimpico Lluis Companys",
] as const;

const LEADERSHIP_NOTES = [
  "Jaime Ortiz, CEO",
  "Recognized by Meta",
  "Spotify Marquee of the Year 2022",
  "Speaker at Spotify Masterclasses",
] as const;

export function LandingCredibility() {
  return (
    <section id="proof" className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <p className="section-label text-center text-[#9bd0ff]">Proof</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          The proof has to be recognizable.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          These names and numbers are grounded in approved Outlet materials, connected Meta history,
          and existing campaign records, so the page shows work people can actually recognize
          instead of anonymous trust copy.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        {PROOF_STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-3xl font-bold tracking-tight text-white">{stat.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs uppercase tracking-[0.22em] text-slate-500">
        Live Meta inventory snapshot pulled March 10, 2026.
      </p>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#4aa8ff]/12 p-3 text-[#9bd0ff]">
              <Music4 className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">Featured work</p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Artists and event visuals already in the Outlet archive
              </h3>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FEATURED_WORK.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#081421]/92"
              >
                <div className="relative aspect-[1.08/1]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.accent}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04111c] via-[#04111c]/24 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#9bd0ff]">
                      {item.category}
                    </p>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-white">
                      {item.name}
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-200">{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className="rounded-[32px] border border-white/10 bg-[#081421]/92 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-400/12 p-3 text-emerald-300">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
                  Selected wins
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Named wins from the approved Outlet materials
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {OUTCOME_PROOF.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold tracking-tight text-white">{item.name}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-bold tracking-tight text-white">{item.value}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#9bd0ff]">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: 0.04 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]"
          >
            <div className="relative aspect-[1.15/0.88]">
              <Image
                src="/images/landing/jaime-ortiz.png"
                alt="Jaime Ortiz"
                fill
                sizes="(max-width: 1280px) 100vw, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04111c] via-[#04111c]/28 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#f97316]/12 p-3 text-[#fbbf94]">
                  <Star className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">
                    Leadership credibility
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    Outlet Media leadership already has public proof points
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {LEADERSHIP_NOTES.map((note) => (
                  <div
                    key={note}
                    className="rounded-2xl border border-white/10 bg-[#081421]/92 px-4 py-3 text-sm text-slate-200"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="rounded-[32px] border border-white/10 bg-[#081421]/92 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-400/12 p-3 text-emerald-300">
              <BadgeCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Orbit</p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Promoters, brands, and partner marks already in the materials
              </h3>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {LOGO_PROOF.map((item) => (
              <div
                key={item.name}
                className="flex min-h-28 items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={item.width}
                  height={item.height}
                  className="h-auto max-h-20 w-auto"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {CLIENT_PROOF.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-200"
              >
                {name}
              </span>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {VENUE_PROOF.map((venue) => (
              <div
                key={venue}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
              >
                <MapPin className="size-4 shrink-0 text-[#9bd0ff]" />
                {venue}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.04 }}
          className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#f97316]/12 p-3 text-[#fbbf94]">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">
                Live campaign history
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Artists and brands already visible in connected Meta history
              </h3>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ROSTER_PROOF.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: index * 0.015 }}
                className="rounded-[24px] border border-white/10 bg-[#081421]/92 p-4"
              >
                <p className="text-lg font-semibold tracking-tight text-white">{item.name}</p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#9bd0ff]">
                  {item.proof}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
