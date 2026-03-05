"use client";

import type { PlateElementProps } from "platejs/react";
import { PlateElement, useElement } from "platejs/react";

export function LinkElement(props: PlateElementProps) {
  const element = useElement();
  const url = (element as Record<string, unknown>).url as string;

  return (
    <PlateElement {...props}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline decoration-blue-400/40 hover:decoration-blue-400 transition-colors cursor-pointer"
      >
        {props.children}
      </a>
    </PlateElement>
  );
}
