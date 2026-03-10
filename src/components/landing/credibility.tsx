"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Building2, MapPin, Music4 } from "lucide-react";

const PROOF_STATS = [
  { value: "20", label: "Meta ad accounts reviewed" },
  { value: "1,659", label: "Campaigns in accessible Meta history" },
  { value: "16", label: "Public-facing artists and brands matched" },
  { value: "8", label: "Active client records in the current app backbone" },
] as const;

const ARTIST_PROOF = [
  {
    name: "Rauw Alejandro",
    category: "Global Latin star",
    proof: "80 matched Meta campaigns",
  },
  {
    name: "Don Omar",
    category: "Latin reggaeton icon",
    proof: "40 matched Meta campaigns",
  },
  {
    name: "Ricardo Arjona",
    category: "Latin rock legend",
    proof: "22 matched Meta campaigns",
  },
  {
    name: "Ivy Queen",
    category: "Reggaeton pioneer",
    proof: "32 matched Meta campaigns",
  },
  {
    name: "House78",
    category: "Nightlife and venue events",
    proof: "32 matched Meta campaigns",
  },
  {
    name: "Oasis",
    category: "Nightlife and venue events",
    proof: "30 matched Meta campaigns",
  },
  {
    name: "Beamina",
    category: "Brand and ecommerce growth",
    proof: "36 matched Meta campaigns",
  },
  {
    name: "Camila",
    category: "Pop tour promotion",
    proof: "7 matched Meta campaigns",
  },
  {
    name: "Ryan Castro",
    category: "Colombian artist tour",
    proof: "7 matched Meta campaigns",
  },
  {
    name: "Darell",
    category: "Latin urban",
    proof: "8 matched Meta campaigns",
  },
  {
    name: "Young Chimi",
    category: "Rising Latin artist",
    proof: "4 matched Meta campaigns",
  },
  {
    name: "Luis Miguel",
    category: "\"El Sol de Mexico\"",
    proof: "3 matched Meta campaigns",
  },
  {
    name: "Christian Nodal",
    category: "Regional Mexican star",
    proof: "2 matched Meta campaigns",
  },
  {
    name: "El Alfa",
    category: "Dominican dembow",
    proof: "2 matched Meta campaigns",
  },
  {
    name: "Farruko",
    category: "Latin reggaeton",
    proof: "1 matched Meta campaign",
  },
  {
    name: "Alofoke",
    category: "High-visibility live event",
    proof: "1 matched Meta campaign",
  },
] as const;

const CLIENT_PROOF = [
  "Zamora",
  "Don Omar BCN",
  "Beamina",
  "Kybba",
  "Vaz Vil Enterprise",
  "Sienna",
  "Happy Paws",
  "House78",
] as const;

const VENUE_PROOF = [
  "Golden 1 Center",
  "Climate Pledge Arena",
  "Honda Center",
  "Chase Center",
  "State Farm Arena",
  "Estadio Olimpico Lluis Companys",
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
          Credibility should come from the campaign history.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-slate-300">
          This roster is grounded in accessible Meta campaign inventory plus the
          current event ledger, so the landing page can show real artist,
          promoter, and venue context instead of anonymous “trusted by” logos.
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
            <p className="text-3xl font-bold tracking-tight text-white">
              {stat.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#4aa8ff]/12 p-3 text-[#9bd0ff]">
              <Music4 className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9bd0ff]">
                Selected roster
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                Artists, tours, and nightlife brands already in the record
              </h3>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ARTIST_PROOF.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.02 }}
                className="rounded-[24px] border border-white/10 bg-[#081421]/92 p-4"
              >
                <p className="text-lg font-semibold tracking-tight text-white">
                  {item.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.category}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#9bd0ff]">
                  {item.proof}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="rounded-[32px] border border-white/10 bg-[#081421]/92 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-400/12 p-3 text-emerald-300">
                <BadgeCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">
                  Client backbone
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Promoters and brands already in the app
                </h3>
              </div>
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#f97316]/12 p-3 text-[#fbbf94]">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#fbbf94]">
                  Venue signal
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Current event ledger includes major rooms
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {VENUE_PROOF.map((venue) => (
                <div
                  key={venue}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#081421]/92 px-4 py-3 text-sm text-slate-200"
                >
                  <MapPin className="size-4 shrink-0 text-[#9bd0ff]" />
                  {venue}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
