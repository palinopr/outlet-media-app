import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LandingPhoneShellProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly screenClassName?: string;
}

export function LandingPhoneShell({
  children,
  className,
  screenClassName,
}: LandingPhoneShellProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[390px] rounded-[3.3rem] border border-[#21314d] bg-[linear-gradient(180deg,#030915_0%,#020712_100%)] p-3 shadow-[0_58px_120px_-48px_rgba(4,10,18,0.82)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-28 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.22),transparent_72%)] blur-3xl" />

      <div className="relative overflow-hidden rounded-[2.7rem] border border-white/8 bg-[linear-gradient(180deg,#081320_0%,#060d18_45%,#040913_100%)]">
        <div className="pointer-events-none absolute inset-x-[25%] top-3 z-20 h-7 rounded-full border border-white/6 bg-[#02050b]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(72,148,255,0.18),transparent_32%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.08),transparent_28%)]" />

        <div className={cn("relative pt-12", screenClassName)}>{children}</div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-white/16" />
    </div>
  );
}
