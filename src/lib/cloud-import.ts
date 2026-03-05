/**
 * Cloud storage import helpers for Dropbox and Google Drive shared links.
 *
 * Dropbox: requires DROPBOX_ACCESS_TOKEN env var
 * Google Drive: requires GOOGLE_API_KEY env var
 */

export interface CloudFile {
  name: string;
  downloadUrl: string;
  size: number;
  mimeType: string;
}

type Provider = "dropbox" | "gdrive";

export function detectProvider(url: string): Provider | null {
  if (/dropbox\.com\/(sh|scl|s)\//.test(url)) return "dropbox";
  if (/drive\.google\.com\/(drive\/folders|file\/d)\//.test(url)) return "gdrive";
  return null;
}

// ─── Dropbox ─────────────────────────────────────────────────────────────────

async function listDropboxFolder(folderUrl: string): Promise<CloudFile[]> {
  const token = process.env.DROPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error("DROPBOX_ACCESS_TOKEN not configured. Add it to .env.local to enable Dropbox imports.");
  }

  const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: "",
      shared_link: { url: folderUrl },
      include_media_info: true,
      limit: 200,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Dropbox API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const entries: { ".tag": string; name: string; size: number; path_lower: string }[] = data.entries ?? [];

  const mediaFiles = entries.filter((e) => {
    if (e[".tag"] !== "file") return false;
    const ext = e.name.split(".").pop()?.toLowerCase() ?? "";
    return ["jpg", "jpeg", "png", "webp", "gif", "mp4", "mov", "avi", "mkv"].includes(ext);
  });

  return mediaFiles.map((f) => ({
    name: f.name,
    downloadUrl: f.path_lower,
    size: f.size,
    mimeType: guessMimeType(f.name),
  }));
}

export async function downloadDropboxFile(
  folderUrl: string,
  filePath: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  const token = process.env.DROPBOX_ACCESS_TOKEN;
  if (!token) throw new Error("DROPBOX_ACCESS_TOKEN not configured");

  const res = await fetch("https://content.dropboxapi.com/2/sharing/get_shared_link_file", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Dropbox-API-Arg": JSON.stringify({ url: folderUrl, path: filePath }),
    },
  });

  if (!res.ok) {
    throw new Error(`Dropbox download failed (${res.status}): ${await res.text()}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get("content-type") ?? guessMimeType(filePath);
  return { buffer, mimeType };
}

// ─── Google Drive ────────────────────────────────────────────────────────────

function extractGDriveFolderId(url: string): string | null {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

async function listGDriveFolder(folderUrl: string): Promise<CloudFile[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured. Add it to .env.local to enable Google Drive imports.");
  }

  const folderId = extractGDriveFolderId(folderUrl);
  if (!folderId) throw new Error("Could not extract folder ID from Google Drive URL");

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent("files(id,name,size,mimeType)");
  const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=200&key=${apiKey}`;

  const res = await fetch(apiUrl);
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Google Drive API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const files: { id: string; name: string; size: string; mimeType: string }[] = data.files ?? [];

  const mediaFiles = files.filter((f) =>
    f.mimeType.startsWith("image/") || f.mimeType.startsWith("video/"),
  );

  return mediaFiles.map((f) => ({
    name: f.name,
    downloadUrl: f.id,
    size: parseInt(f.size || "0", 10),
    mimeType: f.mimeType,
  }));
}

export async function downloadGDriveFile(
  fileId: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY not configured");

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`,
  );

  if (!res.ok) {
    throw new Error(`Google Drive download failed (${res.status}): ${await res.text()}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get("content-type") ?? "application/octet-stream";
  return { buffer, mimeType };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function listCloudFolder(url: string): Promise<{ provider: Provider; files: CloudFile[] }> {
  const provider = detectProvider(url);
  if (!provider) throw new Error("Unsupported URL. Paste a Dropbox or Google Drive shared folder link.");

  const files = provider === "dropbox"
    ? await listDropboxFolder(url)
    : await listGDriveFolder(url);

  return { provider, files };
}

export async function downloadCloudFile(
  provider: Provider,
  folderUrl: string,
  fileRef: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (provider === "dropbox") {
    return downloadDropboxFile(folderUrl, fileRef);
  }
  return downloadGDriveFile(fileRef);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function guessMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
  };
  return map[ext] ?? "application/octet-stream";
}

export function mediaTypeFromMime(mime: string): "image" | "video" {
  return mime.startsWith("video/") ? "video" : "image";
}
