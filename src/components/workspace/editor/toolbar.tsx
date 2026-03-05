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
  List,
  ListOrdered,
  CheckSquare,
} from "lucide-react";
import { toggleList } from "@platejs/list";
import { LinkToolbarButton } from "./link-toolbar-button";

function ToolbarButton({
  children,
  tooltip,
  onAction,
}: {
  children: React.ReactNode;
  tooltip: string;
  onAction: () => void;
}) {
  return (
    <button
      type="button"
      title={tooltip}
      className="h-8 w-8 flex items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
      onMouseDown={(e) => {
        e.preventDefault();
        onAction();
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
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();
  if (readOnly) return null;

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.06] bg-[oklch(0.14_0_0)] rounded-t-lg">
      <ToolbarButton tooltip="Heading 1" onAction={() => editor.tf.toggleBlock("h1")}>
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Heading 2" onAction={() => editor.tf.toggleBlock("h2")}>
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Heading 3" onAction={() => editor.tf.toggleBlock("h3")}>
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton tooltip="Bold (Cmd+B)" onAction={() => editor.tf.toggleMark("bold")}>
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Italic (Cmd+I)" onAction={() => editor.tf.toggleMark("italic")}>
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Underline (Cmd+U)" onAction={() => editor.tf.toggleMark("underline")}>
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Strikethrough" onAction={() => editor.tf.toggleMark("strikethrough")}>
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Code" onAction={() => editor.tf.toggleMark("code")}>
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton tooltip="Quote" onAction={() => editor.tf.toggleBlock("blockquote")}>
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton tooltip="Bullet List" onAction={() => toggleList(editor, { listStyleType: "disc" })}>
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="Numbered List" onAction={() => toggleList(editor, { listStyleType: "decimal" })}>
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton tooltip="To-do List" onAction={() => toggleList(editor, { listStyleType: "todo" })}>
        <CheckSquare className="h-4 w-4" />
      </ToolbarButton>

      <Separator />

      <LinkToolbarButton />
    </div>
  );
}
