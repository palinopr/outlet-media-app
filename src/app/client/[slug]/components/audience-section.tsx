import { Heart, Users, DollarSign, GraduationCap, CreditCard, Baby } from "lucide-react";
import type { AudienceProfile } from "../types";
import { ProgressBar } from "./progress-bar";

function DemoBar({ label, value, color }: { label: string; value: number | null; color: "cyan" | "violet" | "emerald" | "amber" }) {
  if (value == null) return null;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-semibold text-white/90">{value.toFixed(0)}%</span>
      </div>
      <ProgressBar value={value} color={color} />
    </div>
  );
}

export function AudienceSection({ demo }: { demo: AudienceProfile }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(demo.femalePct != null || demo.malePct != null) && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-white/70">Gender</span>
          </div>
          <DemoBar label="Female" value={demo.femalePct} color="violet" />
          <DemoBar label="Male" value={demo.malePct} color="cyan" />
          {demo.marriedPct != null && (
            <p className="text-xs text-white/50 mt-3 pt-3 border-t border-white/[0.06]">
              {demo.marriedPct.toFixed(0)}% married
            </p>
          )}
        </div>
      )}

      {demo.age1824 != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-white/70">Age</span>
          </div>
          <DemoBar label="18-24" value={demo.age1824} color="emerald" />
          <DemoBar label="25-34" value={demo.age2534} color="emerald" />
          <DemoBar label="35-44" value={demo.age3544} color="emerald" />
          <DemoBar label="45-54" value={demo.age4554} color="emerald" />
          <DemoBar label="55+" value={demo.ageOver54} color="emerald" />
        </div>
      )}

      {demo.income0_30 != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-white/70">Household Income</span>
          </div>
          <DemoBar label="Under $30k" value={demo.income0_30} color="amber" />
          <DemoBar label="$30-60k" value={demo.income30_60} color="amber" />
          <DemoBar label="$60-90k" value={demo.income60_90} color="amber" />
          <DemoBar label="$90-125k" value={demo.income90_125} color="amber" />
          <DemoBar label="$125k+" value={demo.incomeOver125} color="amber" />
        </div>
      )}

      {demo.educationCollege != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-white/70">Education</span>
          </div>
          <DemoBar label="High School" value={demo.educationHighSchool} color="cyan" />
          <DemoBar label="College" value={demo.educationCollege} color="cyan" />
          <DemoBar label="Grad School" value={demo.educationGradSchool} color="cyan" />
        </div>
      )}

      {demo.paymentVisa != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-white/70">Payment Methods</span>
          </div>
          <DemoBar label="Visa" value={demo.paymentVisa} color="cyan" />
          <DemoBar label="Mastercard" value={demo.paymentMC} color="violet" />
          <DemoBar label="Amex" value={demo.paymentAmex} color="emerald" />
          <DemoBar label="Discover" value={demo.paymentDiscover} color="amber" />
        </div>
      )}

      {demo.childrenPct != null && demo.marriedPct != null && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Baby className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-xs font-semibold text-white/70">Family</span>
          </div>
          <DemoBar label="Married" value={demo.marriedPct} color="violet" />
          <DemoBar label="With Children" value={demo.childrenPct} color="emerald" />
        </div>
      )}
    </div>
  );
}
