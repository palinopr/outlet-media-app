"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Value } from "platejs";
import { Plate, PlateContent } from "platejs/react";
import { useCreateEditor } from "./editor-kit";
import { EditorToolbar } from "./editor/toolbar";

interface PlateEditorProps {
  pageId: string;
  initialContent: unknown;
  onSave?: (content: unknown) => void;
}

export function PlateEditor({ pageId, initialContent, onSave }: PlateEditorProps) {
  const editor = useCreateEditor(initialContent);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSave = useCallback(
    async (value: Value) => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/workspace/pages/${pageId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: value }),
        });
        if (res.ok) {
          setSaveStatus("saved");
          onSave?.(value);
        } else {
          setSaveStatus("idle");
        }
      } catch {
        setSaveStatus("idle");
      }
    },
    [pageId, onSave],
  );

  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        handleSave(value);
      }, 800);
    },
    [handleSave],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      <Plate editor={editor} onChange={handleChange}>
        <EditorToolbar />

        <div className="relative">
          {saveStatus !== "idle" && (
            <div className="absolute right-0 top-3 z-10">
              <span className="rounded-full bg-[#f7f5f1] px-2 py-1 text-[11px] font-medium text-[#9b9a97]">
                {saveStatus === "saving" ? "Saving..." : "Saved"}
              </span>
            </div>
          )}

          <PlateContent
            className="min-h-[320px] w-full px-0 py-4 text-[16px] leading-7 text-[#37352f] outline-none [&_*]:outline-none [&_a]:text-[#0f7b6c] [&_a]:underline [&_code]:rounded-md [&_code]:bg-[#f4f2ee] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[#7c2d12]"
            placeholder="Type '/' for commands..."
          />
        </div>
      </Plate>
    </div>
  );
}
