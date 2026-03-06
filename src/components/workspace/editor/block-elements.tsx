"use client";

import type { PlateElementProps } from "platejs/react";
import { PlateElement, useElement, useEditorRef, useNodePath } from "platejs/react";

export function ParagraphElement(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="mb-1 text-[#37352f] leading-7"
    />
  );
}

export function H1Element(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="mb-3 mt-8 text-[2.2rem] font-semibold tracking-tight text-[#2f2f2f]"
    />
  );
}

export function H2Element(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="mb-2 mt-6 text-[1.6rem] font-semibold text-[#37352f]"
    />
  );
}

export function H3Element(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="mb-2 mt-5 text-[1.25rem] font-semibold text-[#44403c]"
    />
  );
}

export function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="my-3 border-l-4 border-[#dfdbd2] pl-4 italic text-[#6b6a68]"
    />
  );
}

export function HrElement(props: PlateElementProps) {
  return (
    <PlateElement {...props}>
      <hr className="my-6 border-[#ece8df]" />
      {props.children}
    </PlateElement>
  );
}

export function CodeBlockElement(props: PlateElementProps) {
  return (
    <PlateElement
      {...props}
      className="my-3 rounded-2xl border border-[#ece8df] bg-[#f7f5f1] p-4 font-mono text-sm text-[#44403c]"
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
    return function TodoList({ children }: { children: React.ReactNode }) {
      return (
        <div className="flex items-start gap-2 py-0.5">
          <div contentEditable={false} className="flex items-center pt-1">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                editor.tf.setNodes({ checked: !checked } as Record<string, unknown>, { at: path });
              }}
              className="h-4 w-4 cursor-pointer rounded border-[#c8c2b8] bg-transparent accent-[#7f8c75]"
            />
          </div>
          <span className={`flex-1 ${checked ? "text-[#b0aaa0] line-through" : "text-[#37352f]"}`}>
            {children}
          </span>
        </div>
      );
    };
  }

  const Tag = listStyleType === "decimal" ? "ol" : "ul";
  const listStart = (element as Record<string, unknown>).listStart as
    | number
    | undefined;

  return function StyledList({ children }: { children: React.ReactNode }) {
    return (
      <Tag
        className="my-0 ps-6 list-none"
        style={{ listStyleType }}
        start={listStart}
      >
        <li className="my-0">{children}</li>
      </Tag>
    );
  };
}
