"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageCoverProps {
  pageId: string;
  coverImage: string | null;
  onRemove?: () => void;
}

export function PageCover({ pageId, coverImage, onRemove }: PageCoverProps) {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  if (!coverImage) {
    return (
      <button
        type="button"
        className="group mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#e5e1d8] bg-white px-3 py-1.5 text-sm text-[#787774] transition-colors hover:bg-[#f7f5f1] hover:text-[#37352f]"
        onClick={async () => {
          const url = window.prompt("Enter cover image URL:");
          if (!url?.trim()) return;
          const res = await fetch(`/api/workspace/pages/${pageId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cover_image: url.trim() }),
          });
          if (res.ok) router.refresh();
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
      className="relative mb-4 h-56 w-full overflow-hidden rounded-t-[30px] sm:h-64"
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
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRemove}
            className="gap-1 bg-white/90 text-[#37352f] hover:bg-white"
          >
            <X className="h-3 w-3" />
            Remove cover
          </Button>
        </div>
      )}
    </div>
  );
}
