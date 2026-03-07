/**
 * Auto-classifies imported assets by analyzing filename patterns,
 * image dimensions, and matching against the client's events/campaigns.
 *
 * Placement rules (from Meta ad creative conventions):
 *   1:1   (1080x1080)  -> post
 *   4:5   (1080x1350)  -> post
 *   9:16  (1080x1920)  -> story
 *   1.91:1 (1200x630)  -> feed (link ad)
 *   16:9  (1920x1080)  -> feed
 *   video with "reel"  -> story
 */

import { listEffectiveCampaignRowsForClientSlug } from "@/lib/campaign-client-assignment";
import { supabaseAdmin } from "@/lib/supabase";

export interface AssetClassification {
  placement: "post" | "story" | "feed" | "both";
  folder: string | null;
  labels: string[];
  width: number | null;
  height: number | null;
  campaignId: string | null;
  campaignName: string | null;
}

// ─── Dimension reading (no external deps) ────────────────────────────────────

function readPngDimensions(buf: Buffer): { w: number; h: number } | null {
  // PNG signature: 137 80 78 71 13 10 26 10, then IHDR chunk at byte 16
  if (buf.length < 24) return null;
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function readJpegDimensions(buf: Buffer): { w: number; h: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset < buf.length - 8) {
    if (buf[offset] !== 0xff) break;
    const marker = buf[offset + 1];
    // SOF markers: C0-C3, C5-C7, C9-CB, CD-CF
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      const h = buf.readUInt16BE(offset + 5);
      const w = buf.readUInt16BE(offset + 7);
      return { w, h };
    }
    const len = buf.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return null;
}

function readGifDimensions(buf: Buffer): { w: number; h: number } | null {
  // GIF87a / GIF89a: width at bytes 6-7, height at bytes 8-9 (little-endian)
  if (buf.length < 10) return null;
  const sig = buf.toString("ascii", 0, 6);
  if (sig !== "GIF87a" && sig !== "GIF89a") return null;
  return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
}

function readWebpDimensions(buf: Buffer): { w: number; h: number } | null {
  if (buf.length < 30) return null;
  const riff = buf.toString("ascii", 0, 4);
  const webp = buf.toString("ascii", 8, 12);
  if (riff !== "RIFF" || webp !== "WEBP") return null;
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8 " && buf.length >= 30) {
    return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L" && buf.length >= 25) {
    const bits = buf.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

export function readImageDimensions(
  buf: Buffer,
  mimeType: string,
): { w: number; h: number } | null {
  if (mimeType === "image/png") return readPngDimensions(buf);
  if (mimeType === "image/gif") return readGifDimensions(buf);
  if (mimeType === "image/jpeg") return readJpegDimensions(buf);
  if (mimeType === "image/webp") return readWebpDimensions(buf);
  return null;
}

// ─── Filename parsing ────────────────────────────────────────────────────────

const DIM_RE = /(\d{3,4})\s*x\s*(\d{3,4})/i;
const PLACEMENT_KEYWORDS: Record<string, "post" | "story" | "feed"> = {
  post: "post",
  feed: "feed",
  story: "story",
  reel: "story",
  reels: "story",
  stories: "story",
  igs: "story",
};

function parseFilenameHints(fileName: string): {
  dimW: number | null;
  dimH: number | null;
  placementHint: "post" | "story" | "feed" | null;
  nameTokens: string[];
} {
  const dimMatch = fileName.match(DIM_RE);
  const dimW = dimMatch ? parseInt(dimMatch[1], 10) : null;
  const dimH = dimMatch ? parseInt(dimMatch[2], 10) : null;

  const lower = fileName.toLowerCase();
  let placementHint: "post" | "story" | "feed" | null = null;
  for (const [kw, placement] of Object.entries(PLACEMENT_KEYWORDS)) {
    if (lower.includes(kw)) {
      placementHint = placement;
      break;
    }
  }

  // Extract meaningful name tokens (strip extension, dimensions, common filler)
  const base = fileName.replace(/\.[^.]+$/, "");
  const cleaned = base
    .replace(DIM_RE, "")
    .replace(/px/gi, "")
    .replace(/[_\-()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const nameTokens = cleaned
    .split(" ")
    .filter((t) => t.length > 1 && !/^\d+$/.test(t));

  return { dimW, dimH, placementHint, nameTokens };
}

// ─── Placement from aspect ratio ─────────────────────────────────────────────

function placementFromRatio(w: number, h: number): "post" | "story" | "feed" {
  const ratio = w / h;
  if (ratio >= 0.95 && ratio <= 1.05) return "post"; // 1:1
  if (ratio >= 0.75 && ratio <= 0.85) return "post"; // 4:5
  if (ratio >= 0.5 && ratio <= 0.6) return "story"; // 9:16
  if (ratio >= 1.8) return "feed"; // 1.91:1 or 16:9
  if (ratio < 0.7) return "story"; // tall = story
  return "post"; // default square-ish = post
}

// ─── Event/campaign matching ─────────────────────────────────────────────────

interface MatchCandidate {
  id: string | null;
  name: string;
}

async function getCampaignCandidates(clientSlug: string): Promise<MatchCandidate[]> {
  const campaigns = await listEffectiveCampaignRowsForClientSlug<{
    campaign_id: string;
    client_slug: string | null;
    name: string | null;
  }>("campaign_id, client_slug, name", clientSlug);

  return campaigns
    .filter((campaign) => typeof campaign.name === "string" && campaign.name.trim().length > 0)
    .map((campaign) => ({
      id: campaign.campaign_id,
      name: campaign.name as string,
    }));
}

async function getEventCandidates(clientSlug: string): Promise<MatchCandidate[]> {
  if (!supabaseAdmin) return [];

  const { data: events } = await supabaseAdmin
    .from("tm_events")
    .select("name")
    .eq("client_slug", clientSlug);

  return (events ?? []).map((event) => ({
    id: null,
    name: event.name,
  }));
}

function matchCandidate(
  nameTokens: string[],
  candidates: MatchCandidate[],
): MatchCandidate | null {
  if (candidates.length === 0 || nameTokens.length === 0) return null;
  const joined = nameTokens.join(" ").toLowerCase();

  let bestMatch: MatchCandidate | null = null;
  let bestScore = 0;

  for (const c of candidates) {
    const words = c.name.toLowerCase().split(/\s+/);
    let hits = 0;
    for (const w of words) {
      if (w.length > 2 && joined.includes(w.toLowerCase())) hits++;
    }
    const score = hits / words.length;
    if (hits >= 2 && score > bestScore) {
      bestScore = score;
      bestMatch = c;
    }
  }

  return bestMatch;
}

// ─── Folder name formatting ──────────────────────────────────────────────────

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const PLACEMENT_FOLDER: Record<string, string> = {
  post: "Post",
  story: "Story",
  feed: "Feed",
  both: "General",
};

// ─── Main classifier ────────────────────────────────────────────────────────

export async function classifyAsset(
  fileName: string,
  buffer: Buffer,
  mimeType: string,
  clientSlug: string,
): Promise<AssetClassification> {
  const isVideo = mimeType.startsWith("video/");
  const { dimW, dimH, placementHint, nameTokens } = parseFilenameHints(fileName);

  // 1. Get actual dimensions (images only)
  let width: number | null = null;
  let height: number | null = null;

  if (!isVideo) {
    const dims = readImageDimensions(buffer, mimeType);
    if (dims) {
      width = dims.w;
      height = dims.h;
    } else if (dimW && dimH) {
      width = dimW;
      height = dimH;
    }
  } else if (dimW && dimH) {
    width = dimW;
    height = dimH;
  }

  // 2. Determine placement
  let placement: "post" | "story" | "feed" | "both";
  if (placementHint) {
    placement = placementHint;
  } else if (width && height) {
    placement = placementFromRatio(width, height);
  } else if (isVideo) {
    // Videos without dimension info -- check filename for "reel" etc
    const lower = fileName.toLowerCase();
    placement = lower.includes("reel") || lower.includes("story") ? "story" : "both";
  } else {
    placement = "both";
  }

  // 3. Match against campaigns first, then events for foldering context
  const [campaignCandidates, eventCandidates] = await Promise.all([
    getCampaignCandidates(clientSlug),
    getEventCandidates(clientSlug),
  ]);
  const campaignMatch = matchCandidate(nameTokens, campaignCandidates);
  const eventMatch = campaignMatch ? null : matchCandidate(nameTokens, eventCandidates);

  // 4. Build folder path
  const placementFolder = PLACEMENT_FOLDER[placement];
  let folder: string | null;
  if (campaignMatch) {
    folder = `${titleCase(campaignMatch.name)}/${placementFolder}`;
  } else if (eventMatch) {
    folder = `${titleCase(eventMatch.name)}/${placementFolder}`;
  } else {
    folder = placementFolder;
  }

  // 5. Build labels
  const labels: string[] = [];
  if (placement !== "both") labels.push(placement);
  if (isVideo) labels.push("video");
  if (campaignMatch) labels.push(titleCase(campaignMatch.name));
  else if (eventMatch) labels.push(titleCase(eventMatch.name));
  if (width && height) labels.push(`${width}x${height}`);

  return {
    placement,
    folder,
    labels,
    width,
    height,
    campaignId: campaignMatch?.id ?? null,
    campaignName: campaignMatch ? titleCase(campaignMatch.name) : null,
  };
}
