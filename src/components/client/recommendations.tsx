"use client";

export interface RecommendationItem {
  title: string;
  detail: string;
  type: "success" | "opportunity" | "info";
}

const TYPE_STYLES: Record<
  RecommendationItem["type"],
  { border: string; icon: string; iconBg: string; dot: string }
> = {
  success: {
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  opportunity: {
    border: "border-amber-500/20",
    icon: "text-amber-400",
    iconBg: "bg-amber-500/10",
    dot: "bg-amber-400",
  },
  info: {
    border: "border-cyan-500/20",
    icon: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    dot: "bg-cyan-400",
  },
};

export function RecommendationsList({ items }: { items: RecommendationItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((rec, i) => {
        const style = TYPE_STYLES[rec.type];
        return (
          <div
            key={i}
            className={`glass-card p-4 border ${style.border} transition-all hover:border-opacity-40`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 h-5 w-5 rounded-full ${style.iconBg} flex items-center justify-center shrink-0`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/80 mb-1 leading-tight">
                  {rec.title}
                </p>
                <p className="text-[11px] text-white/35 leading-relaxed">{rec.detail}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
