"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Link2, Loader2, Trash2, Upload, Video, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteAsset, fetchAssets, importAssetFolder, uploadAssetFiles } from "./client";
import { groupByFolder } from "./lib";
import type { Asset, DeleteTarget } from "./types";
import { AssetCard } from "./components/asset-card";
import { AssetPreviewDialog } from "./components/asset-preview-dialog";
import { DeleteConfirmDialog } from "./components/delete-confirm-dialog";
import { FolderSection } from "./components/folder-section";

interface Props {
  assets: Asset[];
  clientSlug: string;
}

export function AssetGallery({ assets: initialAssets, clientSlug }: Props) {
  const [assets, setAssets] = useState(initialAssets);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [folderUrl, setFolderUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [viewMode, setViewMode] = useState<"folders" | "grid">("folders");
  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshAssets = useCallback(async () => {
    const nextAssets = await fetchAssets(clientSlug);
    setAssets(nextAssets);
  }, [clientSlug]);

  const handleUpload = useCallback(
    async (files: FileList) => {
      setUploading(true);

      try {
        const { uploaded, errors } = await uploadAssetFiles(
          Array.from(files),
          clientSlug,
        );

        for (const error of errors) toast.error(error);

        if (uploaded > 0) {
          toast.success(`Uploaded ${uploaded} file${uploaded > 1 ? "s" : ""}`);
          await refreshAssets();
        }
      } finally {
        setUploading(false);
      }
    },
    [clientSlug, refreshAssets],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer.files.length > 0) {
        void handleUpload(event.dataTransfer.files);
      }
    },
    [handleUpload],
  );

  const handleImport = useCallback(async () => {
    if (!folderUrl.trim()) return;

    setImporting(true);

    try {
      const result = await importAssetFolder(folderUrl, clientSlug);
      toast.success(
        `Imported ${result.imported} file${result.imported !== 1 ? "s" : ""} (${result.skipped} already existed)`,
      );
      setFolderUrl("");
      await refreshAssets();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Import failed",
        { duration: 8000 },
      );
    } finally {
      setImporting(false);
    }
  }, [clientSlug, folderUrl, refreshAssets]);

  const filtered = useMemo(
    () => (filter === "all" ? assets : assets.filter((asset) => asset.mediaType === filter)),
    [assets, filter],
  );
  const folderGroups = useMemo(() => groupByFolder(filtered), [filtered]);
  const hasFolders = assets.some((asset) => asset.folder);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const promptDeleteAsset = useCallback(
    (id: string) => {
      const asset = assets.find((item) => item.id === id);
      if (asset) {
        setDeleteTarget({ type: "asset", id, name: asset.fileName });
      }
    },
    [assets],
  );

  const promptDeleteFolder = useCallback(
    (folder: string) => {
      const count = assets.filter((asset) => (asset.folder ?? "Uncategorized") === folder).length;
      setDeleteTarget({ type: "folder", folder, count });
    },
    [assets],
  );

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(filtered.map((asset) => asset.id)));
  }, [filtered]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const promptDeleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    setDeleteTarget({
      type: "bulk",
      ids: Array.from(selectedIds),
      count: selectedIds.size,
    });
  }, [selectedIds]);

  const exitSelectMode = useCallback(() => {
    setSelecting(false);
    setSelectedIds(new Set());
  }, []);

  const executeDelete = useCallback(async () => {
    if (!deleteTarget) return;

    const idsToDelete =
      deleteTarget.type === "asset"
        ? [deleteTarget.id]
        : deleteTarget.type === "bulk"
          ? deleteTarget.ids
          : assets
              .filter((asset) => (asset.folder ?? "Uncategorized") === deleteTarget.folder)
              .map((asset) => asset.id);

    setDeleting(true);

    try {
      let deleted = 0;
      for (const id of idsToDelete) {
        try {
          await deleteAsset(id);
          deleted += 1;
        } catch {
          // Keep going so bulk deletes are best-effort.
        }
      }

      if (deleted > 0) {
        toast.success(
          deleteTarget.type === "asset"
            ? "Asset deleted"
            : `Deleted ${deleted} asset${deleted > 1 ? "s" : ""}`,
        );

        if (previewAsset && idsToDelete.includes(previewAsset.id)) {
          setPreviewAsset(null);
        }

        await refreshAssets();
      }

      if (deleteTarget.type === "bulk") {
        exitSelectMode();
      }

      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }, [assets, deleteTarget, exitSelectMode, previewAsset, refreshAssets]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["all", "image", "video"] as const).map((nextFilter) => (
            <button
              key={nextFilter}
              type="button"
              onClick={() => setFilter(nextFilter)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                filter === nextFilter
                  ? "border-white/[0.08] bg-white/[0.08] text-white/90"
                  : "border-transparent text-white/40 hover:bg-white/[0.04] hover:text-white/60"
              }`}
            >
              {nextFilter === "all"
                ? "All"
                : nextFilter === "image"
                  ? "Images"
                  : "Videos"}
              <span className="ml-1.5 text-white/30">
                {nextFilter === "all"
                  ? assets.length
                  : assets.filter((asset) => asset.mediaType === nextFilter).length}
              </span>
            </button>
          ))}

          {hasFolders && (
            <div className="ml-2 flex items-center gap-1 border-l border-white/[0.08] pl-2">
              {(["folders", "grid"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`rounded px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-all ${
                    viewMode === mode
                      ? "bg-white/[0.08] text-white/80"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {mode === "folders" ? "Folders" : "Grid"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {assets.length > 0 && !selecting && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-2 text-xs"
              onClick={() => setSelecting(true)}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Select
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-2 text-xs"
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
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void handleUpload(event.target.files);
          }}
        />
      </div>

      {selecting && (
        <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-white/70">
              {selectedIds.size} of {filtered.length} selected
            </span>
            <button
              type="button"
              onClick={selectedIds.size === filtered.length ? deselectAll : selectAll}
              className="text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300"
            >
              {selectedIds.size === filtered.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="destructive"
              className="h-7 gap-1.5 text-xs"
              onClick={promptDeleteSelected}
              disabled={selectedIds.size === 0}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete ({selectedIds.size})
            </Button>
            <button
              type="button"
              onClick={exitSelectMode}
              className="rounded p-1 transition-colors hover:bg-white/[0.06]"
              aria-label="Exit selection mode"
            >
              <X className="h-4 w-4 text-white/40" />
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-white/40" />
          <span className="text-xs font-medium text-white/60">
            Import from Dropbox or Google Drive
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Paste a Google Drive or Dropbox folder link..."
            value={folderUrl}
            onChange={(event) => setFolderUrl(event.target.value)}
            className="h-8 border-white/[0.08] bg-white/[0.03] text-sm"
          />
          <Button
            size="sm"
            className="h-8 shrink-0 text-xs"
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

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={
          filtered.length === 0
            ? "rounded-xl border-2 border-dashed border-white/[0.08] p-12 text-center"
            : ""
        }
      >
        {filtered.length === 0 ? (
          <div className="text-sm text-white/40">
            {filter === "video" ? (
              <Video className="mx-auto mb-2 h-8 w-8 opacity-40" />
            ) : (
              <ImageIcon className="mx-auto mb-2 h-8 w-8 opacity-40" />
            )}
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
                onDeleteAsset={promptDeleteAsset}
                onDeleteFolder={promptDeleteFolder}
                defaultOpen={folderGroups.length <= 6}
                selecting={selecting}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => setPreviewAsset(asset)}
                onDelete={promptDeleteAsset}
                selecting={selecting}
                selected={selectedIds.has(asset.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        )}
      </div>

      <AssetPreviewDialog
        asset={previewAsset}
        onClose={() => setPreviewAsset(null)}
        onDelete={promptDeleteAsset}
      />

      <DeleteConfirmDialog
        target={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
      />
    </div>
  );
}
