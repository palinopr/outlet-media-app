import { ASSET_STATUS_COLORS, type AssetStatus } from "@/lib/constants";
import type { Asset, AssetRow } from "./types";

export function statusColor(status: string): string {
  return ASSET_STATUS_COLORS[status as AssetStatus] ?? "";
}

export function mapAssetRow(row: AssetRow): Asset {
  return {
    id: row.id,
    fileName: row.file_name,
    publicUrl: row.public_url,
    mediaType: row.media_type,
    placement: row.placement,
    format: row.format,
    folder: row.folder,
    labels: row.labels ?? [],
    status: row.status,
    createdAt: row.created_at,
    width: row.width,
    height: row.height,
  };
}

export function mapAssetRows(rows: AssetRow[]): Asset[] {
  return rows.map(mapAssetRow);
}
