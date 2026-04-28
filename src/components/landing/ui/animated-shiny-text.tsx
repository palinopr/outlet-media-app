import type { ComponentPropsWithoutRef, CSSProperties, FC } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "inline-block bg-clip-text text-transparent",
        "animate-shiny-text",
        "bg-[length:var(--shiny-width)_100%] bg-[position:0_0] bg-no-repeat",
        "bg-gradient-to-r from-white/40 via-white via-50% to-white/40",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
