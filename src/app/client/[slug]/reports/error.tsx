"use client";

import { Button } from "@/components/ui/button";

export default function ClientReportsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
        Reports unavailable
      </p>
      <p className="mt-3 text-sm text-white/70">
        Outlet could not load the reporting surface right now.
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={reset}
      >
        Try again
      </Button>
    </div>
  );
}
