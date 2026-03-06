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
      className="flex h-8 w-8 items-center justify-center rounded-md text-[#787774] transition-colors hover:bg-[#f1efea] hover:text-[#37352f]"
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
  return <div className="mx-1 h-5 w-px bg-[#ece8df]" />;
}

export function EditorToolbar() {
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();
  if (readOnly) return null;

  return (
    <div className="sticky top-0 z-10 flex items-center gap-0.5 rounded-t-[20px] border-b border-[#efede8] bg-white/95 px-1 py-2 backdrop-blur">
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
