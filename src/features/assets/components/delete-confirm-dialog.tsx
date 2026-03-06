"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import type { DeleteTarget } from "../types";

interface Props {
  target: DeleteTarget | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  target,
  deleting,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Dialog open={!!target} onOpenChange={() => !deleting && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {target?.type === "folder"
              ? "Delete Folder"
              : target?.type === "bulk"
                ? "Delete Selected Assets"
                : "Delete Asset"}
          </DialogTitle>
          <DialogDescription className="text-sm text-white/50">
            {target?.type === "folder"
              ? `This will permanently delete all ${target.count} asset${target.count !== 1 ? "s" : ""} in "${target.folder}". This cannot be undone.`
              : target?.type === "bulk"
                ? `This will permanently delete ${target.count} selected asset${target.count !== 1 ? "s" : ""}. This cannot be undone.`
                : `This will permanently delete "${target?.name}". This cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 gap-1.5 text-xs"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
