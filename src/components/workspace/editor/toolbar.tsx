"use client";

import { useEditorRef, useEditorReadOnly } from "platejs/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
} from "lucide-react";

function MarkButton({
  nodeType,
  children,
  tooltip,
}: {
  nodeType: string;
  children: React.ReactNode;
  tooltip: string;
}) {
  const editor = useEditorRef();

  return (
    <button
      type="button"
      title={tooltip}
      className="h-8 w-8 flex items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
      onMouseDown={(e) => {
        e.preventDefault();
        editor.tf.toggleMark(nodeType);
      }}
    >
      {children}
    </button>
  );
}

function BlockButton({
  blockType,
  children,
  tooltip,
}: {
  blockType: string;
  children: React.ReactNode;
  tooltip: string;
}) {
  const editor = useEditorRef();

  return (
    <button
      type="button"
      title={tooltip}
      className="h-8 w-8 flex items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
      onMouseDown={(e) => {
        e.preventDefault();
        editor.tf.toggleBlock(blockType);
      }}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-5 bg-white/[0.08] mx-1" />;
}

export function EditorToolbar() {
  const readOnly = useEditorReadOnly();
  if (readOnly) return null;

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.06] bg-[oklch(0.14_0_0)] rounded-t-lg">
      <BlockButton blockType="h1" tooltip="Heading 1">
        <Heading1 className="h-4 w-4" />
      </BlockButton>
      <BlockButton blockType="h2" tooltip="Heading 2">
        <Heading2 className="h-4 w-4" />
      </BlockButton>
      <BlockButton blockType="h3" tooltip="Heading 3">
        <Heading3 className="h-4 w-4" />
      </BlockButton>

      <Separator />

      <MarkButton nodeType="bold" tooltip="Bold (Cmd+B)">
        <Bold className="h-4 w-4" />
      </MarkButton>
      <MarkButton nodeType="italic" tooltip="Italic (Cmd+I)">
        <Italic className="h-4 w-4" />
      </MarkButton>
      <MarkButton nodeType="underline" tooltip="Underline (Cmd+U)">
        <Underline className="h-4 w-4" />
      </MarkButton>
      <MarkButton nodeType="strikethrough" tooltip="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </MarkButton>
      <MarkButton nodeType="code" tooltip="Code">
        <Code className="h-4 w-4" />
      </MarkButton>

      <Separator />

      <BlockButton blockType="blockquote" tooltip="Quote">
        <Quote className="h-4 w-4" />
      </BlockButton>
    </div>
  );
}
