"use client";

import type { PlateElementProps } from "platejs/react";
import { PlateElement, useElement } from "platejs/react";

export function MentionElement(props: PlateElementProps) {
  const element = useElement();
  const value = (element as Record<string, unknown>).value as string;

  return (
    <PlateElement
      {...props}
      className="inline bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded text-sm font-medium align-baseline"
    >
      <span contentEditable={false}>@{value}</span>
      {props.children}
    </PlateElement>
  );
}
