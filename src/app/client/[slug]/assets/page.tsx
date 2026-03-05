import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Image as ImageIcon, Video, ArrowLeft } from "lucide-react";
import { slugToLabel } from "@/lib/formatters";
import { supabaseAdmin } from "@/lib/supabase";
import { AssetGallery } from "./asset-gallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Assets`,
    description: `Ad creative assets for ${clientName}`,
  };
}

interface AssetRow {
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

export default async function ClientAssetsPage({ params }: Props) {
  const { slug } = await params;
  const clientName = slugToLabel(slug);

  let assets: AssetRow[] = [];
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("ad_assets")
      .select("id, file_name, public_url, media_type, placement, format, folder, labels, status, created_at, width, height")
      .eq("client_slug", slug)
      .order("created_at", { ascending: false });
    assets = data ?? [];
  }

  const mapped = assets.map((a) => ({
    id: a.id,
    fileName: a.file_name,
    publicUrl: a.public_url,
    mediaType: a.media_type,
    placement: a.placement,
    format: a.format,
    folder: a.folder,
    labels: a.labels ?? [],
    status: a.status,
    createdAt: a.created_at,
    width: a.width,
    height: a.height,
  }));

  const imageCount = mapped.filter((a) => a.mediaType === "image").length;
  const videoCount = mapped.filter((a) => a.mediaType === "video").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative">
          <Link
            href={`/client/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-cyan-400/70" />
                <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
                  Assets
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {clientName} Ad Assets
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Total Assets
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {mapped.length}
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Images
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tighter leading-none">
            {imageCount}
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
              <Video className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Videos
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-violet-400 tracking-tighter leading-none">
            {videoCount}
          </p>
        </div>
      </div>

      {/* Asset Gallery (always shown so import input is accessible) */}
      <AssetGallery assets={mapped} clientSlug={slug} />
    </div>
  );
}
