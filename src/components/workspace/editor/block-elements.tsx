"use client";

import type { PlateElementProps } from "platejs/react";
import { PlateElement, useElement, useEditorRef, useNodePath } from "platejs/react";

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

export function BlockList() {
  const element = useElement();
  const editor = useEditorRef();
  const path = useNodePath(element);
  const listStyleType = (element as Record<string, unknown>).listStyleType as
    | string
    | undefined;

  if (!listStyleType) return undefined;

  if (listStyleType === "todo") {
    const checked = !!(element as Record<string, unknown>).checked;
    return ({ children }: { children: React.ReactNode }) => (
      <div className="flex items-start gap-2 py-0.5">
        <div contentEditable={false} className="flex items-center pt-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              editor.tf.setNodes({ checked: !checked } as Record<string, unknown>, { at: path });
            }}
            className="h-4 w-4 rounded border-white/30 bg-transparent accent-cyan-500 cursor-pointer"
          />
        </div>
        <span className={`flex-1 ${checked ? "line-through text-white/30" : "text-white/80"}`}>
          {children}
        </span>
      </div>
    );
  }

  const Tag = listStyleType === "decimal" ? "ol" : "ul";
  const listStart = (element as Record<string, unknown>).listStart as
    | number
    | undefined;

  return ({ children }: { children: React.ReactNode }) => (
    <Tag
      className="my-0 ps-6 list-none"
      style={{ listStyleType }}
      start={listStart}
    >
      <li className="my-0">{children}</li>
    </Tag>
  );
}

