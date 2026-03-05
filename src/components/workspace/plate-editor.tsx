"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Value } from "platejs";
import { Plate, PlateContent } from "platejs/react";
import { useCreateEditor } from "./editor-kit";

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
    <div className="relative">
      {saveStatus !== "idle" && (
        <div className="absolute top-2 right-2 z-10">
          <span className="text-xs text-muted-foreground">
            {saveStatus === "saving" ? "Saving..." : "Saved"}
          </span>
        </div>
      )}
      <Plate editor={editor} onChange={handleChange}>
        <PlateContent
          className="min-h-[300px] w-full px-1 py-2 text-base text-foreground outline-none [&_*]:outline-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_hr]:my-4 [&_hr]:border-muted [&_a]:text-blue-400 [&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_p]:mb-1"
          placeholder="Start writing..."
        />
      </Plate>
    </div>
  );
}
