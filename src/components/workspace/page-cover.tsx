"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageCoverProps {
  pageId: string;
  coverImage: string | null;
  onRemove?: () => void;
}

export function PageCover({ pageId, coverImage, onRemove }: PageCoverProps) {
  const [hover, setHover] = useState(false);

  if (!coverImage) return null;

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
