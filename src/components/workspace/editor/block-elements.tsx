"use client";

import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";

export function ParagraphElement(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="mb-1 text-white/80 leading-relaxed"
    />
  );
}

export function H1Element(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="text-3xl font-bold mt-8 mb-3 text-white"
    />
  );
}

export function H2Element(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="text-2xl font-semibold mt-6 mb-2 text-white/95"
    />
  );
}

export function H3Element(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="text-xl font-semibold mt-5 mb-2 text-white/90"
    />
  );
}

export function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="border-l-2 border-white/20 pl-4 my-2 italic text-white/60"
    />
  );
}

export function HrElement(props: PlateElementProps) {
  return (
    <PlateElement {...props}>
      <hr className="my-6 border-white/[0.08]" />
      {props.children}
    </PlateElement>
  );
}

export function CodeBlockElement(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="my-2 rounded-lg bg-[oklch(0.12_0_0)] border border-white/[0.06] p-4 font-mono text-sm text-white/80"
    />
  );
}
