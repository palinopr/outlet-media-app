"use client";

import { Download } from "lucide-react";

export function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all print:hidden"
    >
      <Download className="h-3.5 w-3.5" />
      Export
    </button>
  );
}
