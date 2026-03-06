import Link from "next/link";
import { Image as ImageIcon, Video } from "lucide-react";
import type { Asset } from "@/features/assets/types";

interface Props {
  assets: Asset[];
  slug: string;
}

export function CampaignAssetsPanel({ assets, slug }: Props) {
  return (
    <section className="glass-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
            Linked Assets
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">Creative attached to this campaign</h2>
          <p className="mt-1 text-sm text-white/55">
            Recent uploads that matched this campaign by name and placement context.
          </p>
        </div>
        <Link
          href={`/client/${slug}/assets`}
          className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
        >
          Open library
        </Link>
      </div>

      {assets.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.03] px-4 py-6 text-sm text-white/45">
          No linked assets yet. Uploading files with the campaign name will attach them here.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <a
              key={asset.id}
              href={asset.publicUrl ?? undefined}
              target={asset.publicUrl ? "_blank" : undefined}
              rel={asset.publicUrl ? "noopener noreferrer" : undefined}
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]"
            >
              <div className="relative aspect-[1.15] overflow-hidden bg-white/[0.03]">
                {asset.mediaType === "video" ? (
                  <div className="flex h-full items-center justify-center">
                    <Video className="h-8 w-8 text-white/25" />
                  </div>
                ) : asset.publicUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.publicUrl}
                    alt={asset.fileName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-white/25" />
                  </div>
                )}

                <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                  {asset.placement && asset.placement !== "both" ? (
                    <span className="rounded-full bg-black/55 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80">
                      {asset.placement}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-black/55 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80">
                    {asset.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium text-white">{asset.fileName}</p>
                <div className="flex items-center justify-between gap-2 text-xs text-white/45">
                  <span className="truncate">{asset.folder ?? "Uncategorized"}</span>
                  {asset.width && asset.height ? (
                    <span className="font-mono">
                      {asset.width}x{asset.height}
                    </span>
                  ) : null}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
