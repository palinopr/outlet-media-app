"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FolderOpen, Trash2 } from "lucide-react";
import { AssetCard } from "./asset-card";
import type { Asset, FolderGroup } from "../types";

interface Props {
  group: FolderGroup;
  onSelect: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  onDeleteFolder: (folder: string) => void;
  defaultOpen: boolean;
  selecting: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}

export function FolderSection({
  group,
  onSelect,
  onDeleteAsset,
  onDeleteFolder,
  defaultOpen,
  selecting,
  selectedIds,
  onToggleSelect,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const parts = group.path.split("/");
  const isNested = parts.length > 1;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/40" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/40" />
        )}
        <FolderOpen className="h-4 w-4 shrink-0 text-amber-400/70" />
        <div className="flex min-w-0 items-center gap-1.5">
          {isNested ? (
            <>
              <span className="truncate text-sm text-white/50">{parts[0]}</span>
              <span className="text-white/20">/</span>
              <span className="text-sm font-medium text-white/80">{parts[1]}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-white/80">{group.label}</span>
          )}
        </div>
        <span className="ml-auto shrink-0 text-xs text-white/30">
          {group.assets.length}
        </span>
        <span
          role="button"
          tabIndex={0}
          aria-label={`Delete folder ${group.label}`}
          className="ml-1 shrink-0 rounded p-1.5 transition-colors hover:bg-red-500/20"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteFolder(group.path);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.stopPropagation();
              onDeleteFolder(group.path);
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5 text-white/30 transition-colors hover:text-red-400" />
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {group.assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => onSelect(asset)}
                onDelete={onDeleteAsset}
                selecting={selecting}
                selected={selectedIds.has(asset.id)}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
