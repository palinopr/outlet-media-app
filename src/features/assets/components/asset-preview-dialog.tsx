"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Trash2 } from "lucide-react";
import { statusColor } from "../lib";
import type { Asset } from "../types";

interface Props {
  asset: Asset | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function AssetPreviewDialog({ asset, onClose, onDelete }: Props) {
  return (
    <Dialog open={!!asset} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        {asset && (
          <>
            <DialogHeader>
              <DialogTitle className="truncate text-sm">{asset.fileName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {asset.mediaType === "video" ? (
                asset.publicUrl && (
                  <video
                    src={asset.publicUrl}
                    controls
                    className="max-h-[400px] w-full rounded-lg"
                  />
                )
              ) : asset.publicUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.publicUrl}
                  alt={asset.fileName}
                  className="max-h-[400px] w-full rounded-lg bg-white/[0.02] object-contain"
                />
              ) : null}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-white/40">Type</span>
                  <p className="font-medium text-white/80">{asset.mediaType}</p>
                </div>
                <div>
                  <span className="text-xs text-white/40">Placement</span>
                  <p className="font-medium text-white/80">
                    {asset.placement ?? "not set"}
                  </p>
                </div>
                {asset.width && asset.height && (
                  <div>
                    <span className="text-xs text-white/40">Dimensions</span>
                    <p className="font-medium text-white/80">
                      {asset.width} x {asset.height}
                    </p>
                  </div>
                )}
                {asset.folder && (
                  <div>
                    <span className="text-xs text-white/40">Folder</span>
                    <p className="font-medium text-white/80">{asset.folder}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-white/40">Status</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusColor(asset.status)}`}
                  >
                    {asset.status}
                  </Badge>
                </div>
              </div>

              {asset.labels.length > 0 && (
                <div>
                  <span className="text-xs text-white/40">Labels</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {asset.labels.map((label) => (
                      <Badge key={label} variant="secondary" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => onDelete(asset.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
                {asset.publicUrl && (
                  <a
                    href={asset.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Full Size
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
