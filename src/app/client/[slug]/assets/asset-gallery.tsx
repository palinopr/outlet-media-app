"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ExternalLink,
  Loader2,
  FolderOpen,
  ChevronDown,
  ChevronRight,
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
  folder: string | null;
  labels: string[];
  status: string;
  createdAt: string;
  width: number | null;
  height: number | null;
}

function statusColor(status: string): string {
  return ASSET_STATUS_COLORS[status as AssetStatus] ?? "";
}

interface FolderGroup {
  path: string;
  label: string;
  assets: Asset[];
}

function groupByFolder(assets: Asset[]): FolderGroup[] {
  const map = new Map<string, Asset[]>();
  for (const a of assets) {
    const key = a.folder ?? "Uncategorized";
    const list = map.get(key);
    if (list) list.push(a);
    else map.set(key, [a]);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => {
      if (a === "Uncategorized") return 1;
      if (b === "Uncategorized") return -1;
      return a.localeCompare(b);
    })
    .map(([path, items]) => ({
      path,
      label: path,
      assets: items,
    }));
}

function AssetCard({
  asset,
  onClick,
}: {
  asset: Asset;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="group relative aspect-square rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all text-left"
      onClick={onClick}
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

      {/* Placement + status badges */}
      <div className="absolute top-1.5 right-1.5 flex gap-1">
        {asset.placement && asset.placement !== "both" && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border border-white/10 bg-black/40 text-white/70"
          >
            {asset.placement}
          </Badge>
        )}
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 border ${statusColor(asset.status)}`}
        >
          {asset.status}
        </Badge>
      </div>

      {/* Dimensions badge */}
      {asset.width && asset.height && (
        <div className="absolute top-1.5 left-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 text-white/50 font-mono">
            {asset.width}x{asset.height}
          </span>
        </div>
      )}

      {/* Filename on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[11px] text-white truncate">{asset.fileName}</p>
      </div>
    </button>
  );
}

function FolderSection({
  group,
  onSelect,
  defaultOpen,
}: {
  group: FolderGroup;
  onSelect: (a: Asset) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const parts = group.path.split("/");
  const isNested = parts.length > 1;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-white/40 shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-white/40 shrink-0" />
        )}
        <FolderOpen className="h-4 w-4 text-amber-400/70 shrink-0" />
        <div className="flex items-center gap-1.5 min-w-0">
          {isNested ? (
            <>
              <span className="text-sm text-white/50 truncate">{parts[0]}</span>
              <span className="text-white/20">/</span>
              <span className="text-sm font-medium text-white/80">{parts[1]}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-white/80">{group.label}</span>
          )}
        </div>
        <span className="ml-auto text-xs text-white/30 shrink-0">
          {group.assets.length}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {group.assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => onSelect(asset)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
  const [folderUrl, setFolderUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [viewMode, setViewMode] = useState<"folders" | "grid">("folders");
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
          folder: a.folder as string | null,
          labels: (a.labels as string[]) ?? [],
          status: a.status as string,
          createdAt: a.created_at as string,
          width: a.width as number | null,
          height: a.height as number | null,
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

  const handleImport = useCallback(async () => {
    if (!folderUrl.trim()) return;
    setImporting(true);

    const res = await fetch("/api/client/assets/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder_url: folderUrl.trim(),
        client_slug: clientSlug,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Import failed", { duration: 8000 });
    } else {
      toast.success(
        `Imported ${data.imported} file${data.imported !== 1 ? "s" : ""} (${data.skipped} already existed)`,
      );
      setFolderUrl("");
      await refreshAssets();
    }
    setImporting(false);
  }, [folderUrl, clientSlug, refreshAssets]);

  const filtered = useMemo(
    () => (filter === "all" ? assets : assets.filter((a) => a.mediaType === filter)),
    [assets, filter],
  );

  const folderGroups = useMemo(() => groupByFolder(filtered), [filtered]);
  const hasFolders = assets.some((a) => a.folder);

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

          {hasFolders && (
            <div className="ml-2 pl-2 border-l border-white/[0.08] flex items-center gap-1">
              {(["folders", "grid"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setViewMode(m)}
                  className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider transition-all ${
                    viewMode === m
                      ? "bg-white/[0.08] text-white/80"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {m === "folders" ? "Folders" : "Grid"}
                </button>
              ))}
            </div>
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
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="h-4 w-4 text-white/40" />
          <span className="text-xs font-medium text-white/60">Import from Dropbox or Google Drive</span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Paste a Google Drive or Dropbox folder link..."
            value={folderUrl}
            onChange={(e) => setFolderUrl(e.target.value)}
            className="text-sm h-8 bg-white/[0.03] border-white/[0.08]"
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
        ) : viewMode === "folders" && hasFolders ? (
          <div className="space-y-3">
            {folderGroups.map((group) => (
              <FolderSection
                key={group.path}
                group={group}
                onSelect={setPreviewAsset}
                defaultOpen={folderGroups.length <= 6}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => setPreviewAsset(asset)}
              />
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
                  {previewAsset.width && previewAsset.height && (
                    <div>
                      <span className="text-white/40 text-xs">Dimensions</span>
                      <p className="font-medium text-white/80">
                        {previewAsset.width} x {previewAsset.height}
                      </p>
                    </div>
                  )}
                  {previewAsset.folder && (
                    <div>
                      <span className="text-white/40 text-xs">Folder</span>
                      <p className="font-medium text-white/80">{previewAsset.folder}</p>
                    </div>
                  )}
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
