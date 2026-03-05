"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Link2,
  Image as ImageIcon,
  Video,
  Trash2,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { ASSET_STATUS_COLORS, type AssetStatus } from "@/lib/constants";
import type {
  ClientAsset,
  ClientAssetSource,
} from "@/app/admin/clients/data";

function assetStatusColor(status: string): string {
  return ASSET_STATUS_COLORS[status as AssetStatus] ?? "";
}

interface Props {
  clientSlug: string;
  initialAssets: ClientAsset[];
  initialSources: ClientAssetSource[];
}

export function AssetsSection({ clientSlug, initialAssets, initialSources }: Props) {
  const { userId } = useAuth();
  const [assets, setAssets] = useState(initialAssets);
  const [sources, setSources] = useState(initialSources);
  const [folderUrl, setFolderUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<ClientAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshAssets = useCallback(async () => {
    const res = await fetch(`/api/admin/assets?client_slug=${clientSlug}`);
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
        form.append("uploaded_by", userId ?? "admin");

        const res = await fetch("/api/admin/assets", {
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

  const handleImport = useCallback(async () => {
    if (!folderUrl.trim()) return;
    setImporting(true);

    const res = await fetch("/api/admin/assets/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder_url: folderUrl.trim(),
        client_slug: clientSlug,
        uploaded_by: userId ?? "admin",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Import failed");
    } else {
      toast.success(
        `Imported ${data.imported} file${data.imported !== 1 ? "s" : ""} (${data.skipped} already existed)`,
      );
      setFolderUrl("");
      await refreshAssets();
      // Refresh sources list
      setSources((prev) => {
        const exists = prev.find((s) => s.folderUrl === folderUrl.trim());
        if (exists) return prev;
        return [
          {
            id: Math.random().toString(36).slice(2, 11),
            provider: folderUrl.includes("dropbox") ? "dropbox" : "gdrive",
            folderUrl: folderUrl.trim(),
            folderName: null,
            lastSyncedAt: new Date().toISOString(),
            fileCount: data.imported,
          },
          ...prev,
        ];
      });
    }
    setImporting(false);
  }, [folderUrl, clientSlug, userId, refreshAssets]);

  const handleResync = useCallback(
    async (source: ClientAssetSource) => {
      setImporting(true);
      const res = await fetch("/api/admin/assets/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder_url: source.folderUrl,
          client_slug: clientSlug,
          uploaded_by: userId ?? "admin",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Re-sync failed");
      } else {
        toast.success(`Re-synced: ${data.imported} new, ${data.skipped} already existed`);
        await refreshAssets();
      }
      setImporting(false);
    },
    [clientSlug, userId, refreshAssets],
  );

  const handleDelete = useCallback(
    async (assetId: string) => {
      const res = await fetch(`/api/admin/assets/${assetId}`, { method: "DELETE" });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== assetId));
        setPreviewAsset(null);
        toast.success("Asset deleted");
      } else {
        toast.error("Failed to delete asset");
      }
    },
    [],
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

  const { imageCount, videoCount } = useMemo(() => ({
    imageCount: assets.filter((a) => a.mediaType === "image").length,
    videoCount: assets.filter((a) => a.mediaType === "video").length,
  }), [assets]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">Ad Assets</h2>
          {assets.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {imageCount} image{imageCount !== 1 ? "s" : ""},
              {" "}{videoCount} video{videoCount !== 1 ? "s" : ""}
            </span>
          )}
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

      {/* Import from cloud folder */}
      <Card className="border-border/60 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">Import from Dropbox or Google Drive</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Paste shared folder link..."
            value={folderUrl}
            onChange={(e) => setFolderUrl(e.target.value)}
            className="text-sm h-8"
          />
          <Button
            size="sm"
            className="h-8 text-xs shrink-0"
            onClick={handleImport}
            disabled={importing || !folderUrl.trim()}
          >
            {importing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Import"
            )}
          </Button>
        </div>

        {/* Saved sources */}
        {sources.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {sources.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between text-xs text-muted-foreground bg-muted/50 rounded px-2.5 py-1.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                    {s.provider === "dropbox" ? "Dropbox" : "GDrive"}
                  </Badge>
                  <span className="truncate">{s.folderName ?? s.folderUrl}</span>
                  <span className="shrink-0">
                    {s.fileCount} file{s.fileCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 shrink-0"
                  onClick={() => handleResync(s)}
                  disabled={importing}
                  title="Re-sync folder"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Asset grid / drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={
          assets.length === 0
            ? "border-2 border-dashed border-border/60 rounded-lg p-12 text-center"
            : ""
        }
      >
        {assets.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>Drag & drop files here, upload, or import from a cloud folder.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className="group relative aspect-square rounded-lg overflow-hidden border border-border/60 bg-muted/30 hover:border-border transition-colors text-left"
                onClick={() => setPreviewAsset(asset)}
              >
                {asset.mediaType === "video" ? (
                  <div className="flex items-center justify-center h-full">
                    <Video className="h-8 w-8 text-muted-foreground" />
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
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Status badge overlay */}
                <div className="absolute top-1.5 right-1.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 border ${assetStatusColor(asset.status) ?? ""}`}
                  >
                    {asset.status}
                  </Badge>
                </div>

                {/* Filename overlay on hover */}
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
                {/* Preview */}
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
                    className="w-full rounded-lg max-h-[400px] object-contain bg-muted/30"
                  />
                ) : null}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Type</span>
                    <p className="font-medium">{previewAsset.mediaType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Placement</span>
                    <p className="font-medium">{previewAsset.placement ?? "not set"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Format</span>
                    <p className="font-medium">{previewAsset.format ?? "not set"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Status</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${assetStatusColor(previewAsset.status) ?? ""}`}
                    >
                      {previewAsset.status}
                    </Badge>
                  </div>
                </div>

                {/* Labels */}
                {previewAsset.labels.length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-xs">Labels</span>
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
                <div className="flex gap-2 justify-end">
                  {previewAsset.publicUrl && (
                    <a
                      href={previewAsset.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open
                      </Button>
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 h-8 text-xs text-red-400 hover:text-red-300 hover:border-red-400/50"
                    onClick={() => handleDelete(previewAsset.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
