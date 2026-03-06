import { mapAssetRows } from "./lib";
import type { Asset, AssetRow } from "./types";

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function responseError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await parseJson<{ error?: string }>(response);
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchAssets(clientSlug: string): Promise<Asset[]> {
  const response = await fetch(`/api/client/assets?client_slug=${clientSlug}`);
  if (!response.ok) {
    throw new Error(await responseError(response, "Failed to load assets"));
  }

  const data = await parseJson<{ assets?: AssetRow[] }>(response);
  return mapAssetRows(data.assets ?? []);
}

export async function uploadAssetFiles(
  files: Iterable<File>,
  clientSlug: string,
): Promise<{ uploaded: number; errors: string[] }> {
  let uploaded = 0;
  const errors: string[] = [];

  for (const file of files) {
    const form = new FormData();
    form.append("file", file);
    form.append("client_slug", clientSlug);

    const response = await fetch("/api/client/assets", {
      method: "POST",
      body: form,
    });

    if (response.ok) {
      uploaded += 1;
      continue;
    }

    const message = await responseError(response, "Upload failed");
    errors.push(`${file.name}: ${message}`);
  }

  return { uploaded, errors };
}

export async function importAssetFolder(
  folderUrl: string,
  clientSlug: string,
): Promise<{ imported: number; skipped: number }> {
  const response = await fetch("/api/client/assets/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      folder_url: folderUrl.trim(),
      client_slug: clientSlug,
    }),
  });

  if (!response.ok) {
    throw new Error(await responseError(response, "Import failed"));
  }

  return parseJson<{ imported: number; skipped: number }>(response);
}

export async function deleteAsset(assetId: string): Promise<void> {
  const response = await fetch(`/api/client/assets/${assetId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await responseError(response, "Delete failed"));
  }
}
