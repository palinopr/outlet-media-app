"use client";

import { useState, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { ASSET_STATUS_COLORS, type AssetStatus } from "@/lib/constants";

interface Asset {
  id: string;
  fileName: string;
  publicUrl: string | null;
  mediaType: string;
  placement: string | null;
  format: string | null;
  labels: string[];
  status: string;
  createdAt: string;
}

function statusColor(status: string): string {
  return ASSET_STATUS_COLORS[status as AssetStatus] ?? "";
}

interface Props {
  assets: Asset[];
  clientSlug: string;
}

export function AssetGallery({ assets: initialAssets, clientSlug }: Props) {
  const { userId } = useAuth();
  const [assets, setAssets] = useState(initialAssets);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshAssets = useCallback(async () => {
    const res = await fetch(`/api/client/assets?client_slug=${clientSlug}`);
    if (res.ok) {
      const data = await res.json();
      setAssets(
        (data.assets ?? []).map((a: Record<string, unknown>) => ({
          id: a.id as string,
          fileName: a.file_name as string,
          publicUrl: a.public_url as string | null,
          mediaType: a.media_type as string,
          placement: a.placement as string | null,
          format: a.format as string | null,
          labels: (a.labels as string[]) ?? [],
          status: a.status as string,
          createdAt: a.created_at as string,
        })),
      );
    }
  }, [clientSlug]);

  const handleUpload = useCallback(
    async (files: FileList) => {
      setUploading(true);
      let uploaded = 0;

      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("client_slug", clientSlug);
        form.append("uploaded_by", userId ?? "client");

        const res = await fetch("/api/client/assets", {
          method: "POST",
          body: form,
        });

        if (res.ok) {
          uploaded++;
        } else {
          const err = await res.json();
          toast.error(`${file.name}: ${err.error ?? "Upload failed"}`);
        }
      }

      if (uploaded > 0) {
        toast.success(`Uploaded ${uploaded} file${uploaded > 1 ? "s" : ""}`);
        await refreshAssets();
      }
      setUploading(false);
    },
    [clientSlug, userId, refreshAssets],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload],
  );

  const filtered = filter === "all" ? assets : assets.filter((a) => a.mediaType === filter);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["all", "image", "video"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-white/[0.08] text-white/90 border border-white/[0.08]"
                  : "text-white/40 hover:text-white/60 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              {f === "all" ? "All" : f === "image" ? "Images" : "Videos"}
              <span className="ml-1.5 text-white/30">
                {f === "all"
                  ? assets.length
                  : assets.filter((a) => a.mediaType === f).length}
              </span>
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="gap-2 h-8 text-xs"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          Upload Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {/* Grid / Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={
          filtered.length === 0
            ? "border-2 border-dashed border-white/[0.08] rounded-xl p-12 text-center"
            : ""
        }
      >
        {filtered.length === 0 ? (
          <div className="text-sm text-white/40">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>
              {filter === "all"
                ? "Drag & drop files here or click Upload."
                : `No ${filter}s found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all text-left"
                onClick={() => setPreviewAsset(asset)}
              >
                {asset.mediaType === "video" ? (
                  <div className="flex items-center justify-center h-full">
                    <Video className="h-8 w-8 text-white/20" />
                  </div>
                ) : asset.publicUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.publicUrl}
                    alt={asset.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 text-white/20" />
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-1.5 right-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 border ${statusColor(asset.status)}`}
                  >
                    {asset.status}
                  </Badge>
                </div>

                {/* Filename on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[11px] text-white truncate">{asset.fileName}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview dialog */}
      <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
        <DialogContent className="sm:max-w-2xl">
          {previewAsset && (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm truncate">
                  {previewAsset.fileName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {previewAsset.mediaType === "video" ? (
                  previewAsset.publicUrl && (
                    <video
                      src={previewAsset.publicUrl}
                      controls
                      className="w-full rounded-lg max-h-[400px]"
                    />
                  )
                ) : previewAsset.publicUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewAsset.publicUrl}
                    alt={previewAsset.fileName}
                    className="w-full rounded-lg max-h-[400px] object-contain bg-white/[0.02]"
                  />
                ) : null}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/40 text-xs">Type</span>
                    <p className="font-medium text-white/80">{previewAsset.mediaType}</p>
                  </div>
                  <div>
                    <span className="text-white/40 text-xs">Placement</span>
                    <p className="font-medium text-white/80">{previewAsset.placement ?? "not set"}</p>
                  </div>
                  <div>
                    <span className="text-white/40 text-xs">Format</span>
                    <p className="font-medium text-white/80">{previewAsset.format ?? "not set"}</p>
                  </div>
                  <div>
                    <span className="text-white/40 text-xs">Status</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusColor(previewAsset.status)}`}
                    >
                      {previewAsset.status}
                    </Badge>
                  </div>
                </div>

                {/* Labels */}
                {previewAsset.labels.length > 0 && (
                  <div>
                    <span className="text-white/40 text-xs">Labels</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {previewAsset.labels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {previewAsset.publicUrl && (
                  <div className="flex justify-end">
                    <a
                      href={previewAsset.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open Full Size
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
