"use client";

import { useState } from "react";
import { ExternalLink, Link2 } from "lucide-react";
import { toast } from "sonner";
import { InlineEdit } from "@/components/admin/inline-edit";
import { StatusSelect } from "@/components/admin/status-select";
import { ASSET_STATUSES } from "@/lib/constants";
import { slugToLabel } from "@/lib/formatters";
import type { AssetOperatingRecord } from "@/features/assets/server";

interface Props {
  asset: AssetOperatingRecord;
}

function mapAssetRecord(row: Record<string, unknown>): AssetOperatingRecord {
  return {
    id: row.id as string,
    file_name: row.file_name as string,
    public_url: (row.public_url as string | null) ?? null,
    media_type: row.media_type as string,
    placement: (row.placement as string | null) ?? null,
    format: (row.format as string | null) ?? null,
    folder: (row.folder as string | null) ?? null,
    labels: ((row.labels as string[] | null) ?? null) as string[] | null,
    status: row.status as string,
    created_at: row.created_at as string,
    width: (row.width as number | null) ?? null,
    height: (row.height as number | null) ?? null,
    client_slug: row.client_slug as string,
    source_url: (row.source_url as string | null) ?? null,
    uploaded_by: (row.uploaded_by as string | null) ?? null,
    storage_path: (row.storage_path as string | null) ?? null,
  };
}

export function AssetOperatingPanel({ asset }: Props) {
  const [current, setCurrent] = useState(asset);

  async function patchAsset(updates: Record<string, unknown>) {
    const response = await fetch(`/api/admin/assets/${current.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = (await response.json().catch(() => ({}))) as {
      asset?: Record<string, unknown>;
      error?: string;
    };

    if (!response.ok || !data.asset) {
      throw new Error(data.error ?? "Failed to update asset");
    }

    setCurrent(mapAssetRecord(data.asset));
  }

  async function handleSave(updates: Record<string, unknown>, successMessage: string) {
    try {
      await patchAsset(updates);
      toast.success(successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update asset");
      throw error;
    }
  }

  return (
    <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-[#787774]">Asset controls</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
          Review and classify
        </h2>
        <p className="mt-1 text-sm text-[#9b9a97]">
          Keep asset review state, labeling, and delivery context aligned with campaign operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Status</p>
          <div className="mt-3">
            <StatusSelect
              value={current.status}
              options={ASSET_STATUSES.map((status) => ({
                value: status,
                label: status.charAt(0).toUpperCase() + status.slice(1),
              }))}
              onSave={(value) => handleSave({ status: value }, "Asset status updated")}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Placement</p>
          <div className="mt-3 text-sm text-[#2f2f2f]">
            <InlineEdit
              value={current.placement}
              onSave={(value) =>
                handleSave(
                  { placement: value.trim() || null },
                  "Asset placement updated",
                )
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Format</p>
          <div className="mt-3 text-sm text-[#2f2f2f]">
            <InlineEdit
              value={current.format}
              onSave={(value) =>
                handleSave({ format: value.trim() || null }, "Asset format updated")
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Labels</p>
          <div className="mt-3 text-sm text-[#2f2f2f]">
            <InlineEdit
              value={current.labels?.join(", ") ?? ""}
              onSave={(value) =>
                handleSave(
                  {
                    labels: value
                      .split(",")
                      .map((label) => label.trim())
                      .filter(Boolean),
                  },
                  "Asset labels updated",
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Client</p>
          <p className="mt-2 text-sm font-medium text-[#2f2f2f]">{slugToLabel(current.client_slug)}</p>
          {current.folder ? (
            <p className="mt-1 text-xs text-[#9b9a97]">Folder: {current.folder}</p>
          ) : (
            <p className="mt-1 text-xs text-[#9b9a97]">No folder classification yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Source</p>
          <p className="mt-2 text-sm font-medium text-[#2f2f2f]">
            {current.source_url ? "Imported from cloud folder" : "Direct upload"}
          </p>
          {current.source_url ? (
            <div className="mt-2">
              <a
                href={current.source_url.replace(/^(dropbox|gdrive):/, "")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0f7b6c] hover:text-[#0b5e52]"
              >
                Open source file
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : (
            <p className="mt-1 text-xs text-[#9b9a97]">
              Uploaded by {current.uploaded_by ?? "someone on the team"}.
            </p>
          )}
        </div>
      </div>

      {current.public_url ? (
        <div className="mt-4">
          <a
            href={current.public_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#0f7b6c] hover:text-[#0b5e52]"
          >
            Open hosted asset
            <Link2 className="h-3.5 w-3.5" />
          </a>
        </div>
      ) : null}
    </section>
  );
}
