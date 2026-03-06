import { ASSET_STATUS_COLORS, type AssetStatus } from "@/lib/constants";
import type { Asset, AssetRow, FolderGroup } from "./types";

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

export function groupByFolder(assets: Asset[]): FolderGroup[] {
  const map = new Map<string, Asset[]>();

  for (const asset of assets) {
    const key = asset.folder ?? "Uncategorized";
    const items = map.get(key);
    if (items) items.push(asset);
    else map.set(key, [asset]);
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
