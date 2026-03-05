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
    <div className="rounded-lg border border-white/[0.06] bg-[oklch(0.13_0_0)] overflow-hidden">
      <Plate editor={editor} onChange={handleChange}>
        <EditorToolbar />

        <div className="relative">
          {saveStatus !== "idle" && (
            <div className="absolute top-2 right-3 z-10">
              <span className="text-xs text-white/30">
                {saveStatus === "saving" ? "Saving..." : "Saved"}
              </span>
            </div>
          )}

          <PlateContent
            className="min-h-[300px] w-full px-6 py-4 text-base text-white/80 outline-none [&_*]:outline-none [&_a]:text-blue-400 [&_a]:underline [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-orange-300/80"
            placeholder="Type '/' for commands..."
          />
        </div>
      </Plate>
    </div>
  );
}
