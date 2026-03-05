"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import type { WorkspacePage } from "@/lib/workspace-types";

interface PageListProps {
  pages: WorkspacePage[];
  basePath: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PageList({ pages, basePath }: PageListProps) {
  const router = useRouter();
  const activePages = pages.filter((p) => !p.is_archived);

  if (activePages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No pages yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Create a page from the sidebar to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {activePages.map((page) => (
        <button
          key={page.id}
          onClick={() => router.push(`${basePath}/${page.id}`)}
          className="text-left p-4 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-all group"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">{page.icon || "📄"}</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate text-foreground group-hover:text-foreground">
                {page.title || "Untitled"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Updated {timeAgo(page.updated_at)}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
