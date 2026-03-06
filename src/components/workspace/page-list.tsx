"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Clock, FileText } from "lucide-react";
import type { WorkspacePage } from "@/lib/workspace-types";
import { timeAgo } from "@/lib/formatters";

interface PageListProps {
  pages: WorkspacePage[];
  basePath: string;
}

export function PageList({ pages, basePath }: PageListProps) {
  const router = useRouter();
  const activePages = pages.filter((p) => !p.is_archived);

  if (activePages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#dfdbd2] bg-white/80 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1efea]">
          <FileText className="h-7 w-7 text-[#9b9a97]" />
        </div>
        <p className="text-sm font-medium text-[#37352f]">No pages yet</p>
        <p className="mt-1 text-xs text-[#787774]">
          Create a page from the sidebar to get started
        </p>
      </div>
    );
  }

  // Sort: recently updated first
  const sorted = [...activePages].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e7e3da] bg-white shadow-[0_24px_60px_-48px_rgba(15,23,42,0.45)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[#efede8] px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#9b9a97]">
        <span>Page</span>
        <span>Last edited</span>
      </div>
      {sorted.map((page) => (
        <button
          key={page.id}
          onClick={() => router.push(`${basePath}/${page.id}`)}
          className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[#f3f1eb] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#fbfbfa]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-[22px]">{page.icon || "📄"}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#2f2f2f]">
                {page.title || "Untitled"}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#9b9a97]">
                <FileText className="h-3 w-3" />
                Open document
              </p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-[#787774]">
            <Clock className="h-3 w-3" />
            {timeAgo(page.updated_at)}
            <ChevronRight className="h-3.5 w-3.5 text-[#c0bbb2]" />
          </span>
        </button>
      ))}
    </div>
  );
}
