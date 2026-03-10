import type { CrmLifecycleStage } from "./summary";

const CLIENT_STAGE_TONES: Record<CrmLifecycleStage, string> = {
  customer: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  inactive: "border-white/15 bg-white/5 text-white/60",
  lead: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  proposal: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  qualified: "border-violet-500/30 bg-violet-500/10 text-violet-200",
};

const ADMIN_STAGE_TONES: Record<CrmLifecycleStage, string> = {
  customer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border-[#e5ded2] bg-[#f7f5f1] text-[#6f6a63]",
  lead: "border-sky-200 bg-sky-50 text-sky-700",
  proposal: "border-amber-200 bg-amber-50 text-amber-700",
  qualified: "border-violet-200 bg-violet-50 text-violet-700",
};

export function stageTone(stage: CrmLifecycleStage, variant: "admin" | "client"): string {
  return variant === "client" ? CLIENT_STAGE_TONES[stage] : ADMIN_STAGE_TONES[stage];
}
