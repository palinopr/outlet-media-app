"use client";

import { useRouter } from "next/navigation";
import { FileText, Clock } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 text-white/20" />
        </div>
        <p className="text-sm font-medium text-white/50">No pages yet</p>
        <p className="text-xs text-white/25 mt-1">
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
    <div className="space-y-1">
      {sorted.map((page) => (
        <button
          key={page.id}
          onClick={() => router.push(`${basePath}/${page.id}`)}
          className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
        >
          <span className="text-xl shrink-0">{page.icon || "📄"}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
              {page.title || "Untitled"}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs text-white/20 shrink-0">
            <Clock className="h-3 w-3" />
            {timeAgo(page.updated_at)}
          </span>
        </button>
      ))}
    </div>
  );
}
