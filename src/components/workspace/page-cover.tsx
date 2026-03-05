"use client";

import { useState } from "react";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageCoverProps {
  pageId: string;
  coverImage: string | null;
  onRemove?: () => void;
}

export function PageCover({ pageId, coverImage, onRemove }: PageCoverProps) {
  const [hover, setHover] = useState(false);

  if (!coverImage) {
    return (
      <button
        type="button"
        className="group flex items-center gap-1.5 text-sm text-white/20 hover:text-white/40 transition-colors mb-2"
        onClick={async () => {
          const url = window.prompt("Enter cover image URL:");
          if (!url?.trim()) return;
          const res = await fetch(`/api/workspace/pages/${pageId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cover_image: url.trim() }),
          });
          if (res.ok) window.location.reload();
        }}
      >
        <ImageIcon className="h-3.5 w-3.5" />
        Add cover
      </button>
    );
  }

  const handleRemove = async () => {
    await fetch(`/api/workspace/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cover_image: null }),
    });
    onRemove?.();
  };

  return (
    <div
      className="relative w-full h-48 rounded-lg overflow-hidden mb-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverImage}
        alt="Page cover"
        className="w-full h-full object-cover"
      />
      {hover && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRemove}
            className="gap-1"
          >
            <X className="h-3 w-3" />
            Remove cover
          </Button>
        </div>
      )}
    </div>
  );
}
