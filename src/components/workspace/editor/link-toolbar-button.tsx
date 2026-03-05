"use client";

import { Link2 } from "lucide-react";
import { useEditorRef } from "platejs/react";
import { triggerFloatingLinkInsert } from "@platejs/link/react";

export function LinkToolbarButton() {
  const editor = useEditorRef();

  return (
    <button
      type="button"
      title="Link"
      className="h-8 w-8 flex items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
      onMouseDown={(e) => {
        e.preventDefault();
        triggerFloatingLinkInsert(editor);
      }}
    >
      <Link2 className="h-4 w-4" />
    </button>
  );
}
