"use client";

import { Badge } from "@/components/ui/badge";
import { CheckSquare, Image as ImageIcon, Square, Trash2, Video } from "lucide-react";
import { statusColor } from "../lib";
import type { Asset } from "../types";

interface Props {
  asset: Asset;
  onClick: () => void;
  onDelete: (id: string) => void;
  selecting: boolean;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}

export function AssetCard({
  asset,
  onClick,
  onDelete,
  selecting,
  selected,
  onToggleSelect,
}: Props) {
  return (
    <button
      type="button"
      className={`group relative aspect-square overflow-hidden rounded-xl border bg-white/[0.02] text-left transition-all ${
        selected
          ? "border-cyan-400/50 ring-1 ring-cyan-400/30"
          : "border-white/[0.06] hover:border-white/[0.12]"
      }`}
      onClick={() => (selecting ? onToggleSelect(asset.id) : onClick())}
    >
      {asset.mediaType === "video" ? (
        <div className="flex h-full items-center justify-center">
          <Video className="h-8 w-8 text-white/20" />
        </div>
      ) : asset.publicUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.publicUrl}
          alt={asset.fileName}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageIcon className="h-8 w-8 text-white/20" />
        </div>
      )}

      {selecting && (
        <div className="absolute left-1.5 top-1.5 z-10">
          {selected ? (
            <CheckSquare className="h-5 w-5 text-cyan-400" />
          ) : (
            <Square className="h-5 w-5 text-white/30" />
          )}
        </div>
      )}

      <div className="absolute right-1.5 top-1.5 flex gap-1">
        {asset.placement && asset.placement !== "both" && (
          <Badge
            variant="outline"
            className="border border-white/10 bg-black/40 px-1.5 py-0 text-[10px] text-white/70"
          >
            {asset.placement}
          </Badge>
        )}
        <Badge
          variant="outline"
          className={`border px-1.5 py-0 text-[10px] ${statusColor(asset.status)}`}
        >
          {asset.status}
        </Badge>
      </div>

      {!selecting && asset.width && asset.height && (
        <div className="absolute left-1.5 top-1.5">
          <span className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-white/50">
            {asset.width}x{asset.height}
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <p className="truncate text-[11px] text-white">{asset.fileName}</p>
        <span
          role="button"
          tabIndex={0}
          aria-label={`Delete ${asset.fileName}`}
          className="shrink-0 rounded p-1 transition-colors hover:bg-red-500/30"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(asset.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.stopPropagation();
              onDelete(asset.id);
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5 text-red-400" />
        </span>
      </div>
    </button>
  );
}
