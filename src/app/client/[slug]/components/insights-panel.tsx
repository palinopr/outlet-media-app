import { Lightbulb } from "lucide-react";
import type { Insight } from "../types";

const DOT_COLOR: Record<Insight["type"], string> = {
  positive: "bg-emerald-400",
  warning: "bg-amber-400",
  neutral: "bg-white/40",
};

export function InsightsPanel({ insights, title = "Insights" }: { insights: Insight[]; title?: string }) {
  if (insights.length === 0) return null;

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb className="h-3.5 w-3.5 text-amber-400/70" />
        <span className="text-xs font-semibold tracking-wider uppercase text-white/60">{title}</span>
      </div>
      {insights.map((insight, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${DOT_COLOR[insight.type]}`} />
          <p className="text-sm text-white/70 leading-relaxed">{insight.text}</p>
        </div>
      ))}
    </div>
  );
}
