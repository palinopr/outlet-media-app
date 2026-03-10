/**
 * Shared admin/client tone palette used by dashboard and panel components.
 *
 * Returns the base set of Tailwind classes common to every section panel.
 * Components that need extra keys (card, item, metric, chip, pill, etc.)
 * can spread the result and add their own overrides.
 */

export interface ToneBase {
  readonly body: string;
  readonly card: string;
  readonly empty: string;
  readonly muted: string;
  readonly text: string;
  readonly link: string;
}

export function tone(variant: "admin" | "client"): ToneBase {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      card: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
      muted: "text-white/50",
      text: "text-white",
      link: "text-cyan-300 hover:text-cyan-200",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    card: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
    muted: "text-[#9b9a97]",
    text: "text-[#2f2f2f]",
    link: "text-[#0f7b6c] hover:text-[#0b5e52]",
  };
}
