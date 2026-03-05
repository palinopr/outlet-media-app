/**
 * Cloud storage import helpers for Dropbox and Google Drive shared links.
 *
 * Dropbox: requires DROPBOX_ACCESS_TOKEN env var
 * Google Drive: tries multiple methods silently (OAuth -> API key -> direct URL)
 *   so the user never sees an error unless all methods fail.
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

// ─── Google Drive (multi-method fallback) ────────────────────────────────────

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/** Which method succeeded for listing -- downloads should use the same one. */
let lastGDriveMethod: "oauth" | "apikey" | null = null;

async function getGDriveAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN ?? process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt) {
    return cachedAccessToken.token;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    cachedAccessToken = null;
    return null;
  }

  const data = await res.json();
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

function extractGDriveFolderId(url: string): string | null {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

function parseGDriveFiles(data: { files?: { id: string; name: string; size: string; mimeType: string }[] }): CloudFile[] {
  const files = data.files ?? [];
  return files
    .filter((f) => f.mimeType.startsWith("image/") || f.mimeType.startsWith("video/"))
    .map((f) => ({
      name: f.name,
      downloadUrl: f.id,
      size: parseInt(f.size || "0", 10),
      mimeType: f.mimeType,
    }));
}

/** Try listing with OAuth access token */
async function listGDriveOAuth(folderId: string): Promise<CloudFile[] | null> {
  const accessToken = await getGDriveAccessToken();
  if (!accessToken) return null;

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent("files(id,name,size,mimeType)");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=200`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!res.ok) return null;
  lastGDriveMethod = "oauth";
  return parseGDriveFiles(await res.json());
}

/** Try listing with API key (works for publicly shared folders) */
async function listGDriveApiKey(folderId: string): Promise<CloudFile[] | null> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent("files(id,name,size,mimeType)");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=200&key=${apiKey}`,
  );

  if (!res.ok) return null;
  lastGDriveMethod = "apikey";
  return parseGDriveFiles(await res.json());
}

async function listGDriveFolder(folderUrl: string): Promise<CloudFile[]> {
  const folderId = extractGDriveFolderId(folderUrl);
  if (!folderId) throw new Error("Could not extract folder ID from Google Drive URL");

  // Try OAuth first (full access), then API key (public folders only)
  const errors: string[] = [];
  const oauthResult = await listGDriveOAuth(folderId);
  if (oauthResult !== null) return oauthResult;
  errors.push("OAuth failed or not configured");

  const apiKeyResult = await listGDriveApiKey(folderId);
  if (apiKeyResult !== null) return apiKeyResult;
  errors.push("API key failed or not configured");

  throw new Error(
    `Google Drive: all access methods failed for this folder. Tried: ${errors.join(", ")}`,
  );
}

export async function downloadGDriveFile(
  fileId: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  // Try OAuth first
  const accessToken = await getGDriveAccessToken();
  if (accessToken) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      const mimeType = res.headers.get("content-type") ?? "application/octet-stream";
      return { buffer, mimeType };
    }
  }

  // Fall back to API key
  const apiKey = process.env.GOOGLE_API_KEY;
  if (apiKey) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`,
    );
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      const mimeType = res.headers.get("content-type") ?? "application/octet-stream";
      return { buffer, mimeType };
    }
  }

  throw new Error(`Google Drive download failed: all methods exhausted for file ${fileId}`);
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
