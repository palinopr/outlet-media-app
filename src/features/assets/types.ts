export interface Asset {
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

export interface AssetRow {
  id: string;
  file_name: string;
  public_url: string | null;
  media_type: string;
  placement: string | null;
  format: string | null;
  folder: string | null;
  labels: string[] | null;
  status: string;
  created_at: string;
  width: number | null;
  height: number | null;
}

export interface FolderGroup {
  path: string;
  label: string;
  assets: Asset[];
}

export type DeleteTarget =
  | { type: "asset"; id: string; name: string }
  | { type: "folder"; folder: string; count: number }
  | { type: "bulk"; ids: string[]; count: number };
