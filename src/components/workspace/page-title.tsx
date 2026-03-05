"use client";

import { useCallback, useState } from "react";

interface PageTitleProps {
  pageId: string;
  initialTitle: string;
  onSave?: (title: string) => void;
}

export function PageTitle({ pageId, initialTitle, onSave }: PageTitleProps) {
  const [title, setTitle] = useState(initialTitle);

  const save = useCallback(
    async (value: string) => {
      const trimmed = value.trim() || "Untitled";
      await fetch(`/api/workspace/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      onSave?.(trimmed);
    },
    [pageId, onSave],
  );

  const handleBlur = () => {
    if (title !== initialTitle) save(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder="Untitled"
      className="w-full bg-transparent text-3xl font-bold text-foreground placeholder:text-muted-foreground/40 outline-none border-none"
    />
  );
}
