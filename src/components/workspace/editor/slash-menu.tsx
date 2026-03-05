"use client";

import { useState, useEffect, useRef, type ComponentType } from "react";
import type { PlateElementProps } from "platejs/react";
import type { TComboboxInputElement } from "platejs";
import { useEditorRef, PlateElement } from "platejs/react";
import { useComboboxInput } from "@platejs/combobox/react";
import {
  Heading1,
  Heading2,
  Heading3,
  Type,
  Quote,
  Minus,
  Code,
} from "lucide-react";

interface SlashItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  action: (editor: ReturnType<typeof useEditorRef>) => void;
}

const SLASH_ITEMS: SlashItem[] = [
  {
    icon: <Type className="h-4 w-4" />,
    label: "Text",
    description: "Plain text block",
    action: (editor) => {
      editor.tf.insertNodes({ type: "p", children: [{ text: "" }] });
    },
  },
  {
    icon: <Heading1 className="h-4 w-4" />,
    label: "Heading 1",
    description: "Large heading",
    action: (editor) => {
      editor.tf.insertNodes({ type: "h1", children: [{ text: "" }] });
    },
  },
  {
    icon: <Heading2 className="h-4 w-4" />,
    label: "Heading 2",
    description: "Medium heading",
    action: (editor) => {
      editor.tf.insertNodes({ type: "h2", children: [{ text: "" }] });
    },
  },
  {
    icon: <Heading3 className="h-4 w-4" />,
    label: "Heading 3",
    description: "Small heading",
    action: (editor) => {
      editor.tf.insertNodes({ type: "h3", children: [{ text: "" }] });
    },
  },
  {
    icon: <Quote className="h-4 w-4" />,
    label: "Quote",
    description: "Blockquote",
    action: (editor) => {
      editor.tf.insertNodes({
        type: "blockquote",
        children: [{ text: "" }],
      });
    },
  },
  {
    icon: <Code className="h-4 w-4" />,
    label: "Code Block",
    description: "Code snippet",
    action: (editor) => {
      editor.tf.insertNodes({
        type: "code_block",
        children: [{ type: "code_line", children: [{ text: "" }] }],
      });
    },
  },
  {
    icon: <Minus className="h-4 w-4" />,
    label: "Divider",
    description: "Horizontal rule",
    action: (editor) => {
      editor.tf.insertNodes({ type: "hr", children: [{ text: "" }] });
    },
  },
];

export function SlashInputElement(props: PlateElementProps<TComboboxInputElement>) {
  const { children, element, ...rest } = props;
  const editor = useEditorRef();
  const inputRef = useRef<HTMLSpanElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { props: comboboxProps, removeInput } = useComboboxInput({
    ref: inputRef,
    cancelInputOnBlur: true,
    cancelInputOnEscape: true,
    cancelInputOnBackspace: true,
    onCancelInput: () => {
      // Input removed by combobox hook
    },
  });

  const filterText = element.value ?? "";
  const filteredItems = SLASH_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(filterText.toLowerCase()) ||
      item.description.toLowerCase().includes(filterText.toLowerCase()),
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [filterText]);

  const selectItem = (item: SlashItem) => {
    removeInput(true);
    item.action(editor);
  };

  return (
    <PlateElement {...rest} element={element}>
      <span className="text-white/30" contentEditable={false}>
        /
      </span>
      <span ref={inputRef} {...comboboxProps}>
        {children}
      </span>
      <div
        className="absolute z-50 mt-1 w-72 rounded-lg border border-white/[0.08] bg-[oklch(0.14_0_0)] shadow-xl shadow-black/30 overflow-hidden"
        contentEditable={false}
      >
        <div className="py-1">
          {filteredItems.length === 0 && (
            <div className="px-3 py-2 text-xs text-white/30">No results</div>
          )}
          {filteredItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                index === selectedIndex
                  ? "bg-white/[0.06] text-white"
                  : "text-white/60 hover:bg-white/[0.04]"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectItem(item);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.08] bg-[oklch(0.12_0_0)]">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-white/30">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </PlateElement>
  );
}
