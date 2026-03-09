"use client";

import { useState } from "react";
import { Clock3, MessageSquare } from "lucide-react";
import { PageTitle } from "./page-title";
import { PageIcon } from "./page-icon";
import { PageCover } from "./page-cover";
import { PlateEditor } from "./plate-editor";
import { CommentSidebar } from "./comment-sidebar";
import type { WorkspacePage } from "@/lib/workspace-types";
import { timeAgo } from "@/lib/formatters";

interface PageViewClientProps {
  clientSlug?: string;
  page: WorkspacePage;
  currentUserId: string;
}

export function PageViewClient({ page, currentUserId, clientSlug }: PageViewClientProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <div className="flex h-full bg-transparent">
      <div className="min-w-0 flex-1 overflow-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-20 pt-6 sm:px-8">
          <div className="mb-5 flex items-center justify-between gap-3 text-sm text-[#9b9a97]">
            <div className="min-w-0">
              <p className="truncate font-medium text-[#787774]">Workspace</p>
              <p className="truncate text-xs">Open page</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-xs text-[#9b9a97] sm:flex">
                <Clock3 className="h-3.5 w-3.5" />
                Edited {timeAgo(page.updated_at)}
              </span>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e5e1d8] bg-white px-3 text-sm font-medium text-[#57534e] transition-colors hover:bg-[#f7f5f1] hover:text-[#2f2f2f]"
                onClick={() => setCommentsOpen(!commentsOpen)}
                title="Comments"
              >
                <MessageSquare className="h-4 w-4" />
                Comments
              </button>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#ece8df] bg-white/95 shadow-[0_32px_80px_-56px_rgba(15,23,42,0.55)]">
            <PageCover pageId={page.id} coverImage={page.cover_image} />

            <div className="mx-auto w-full max-w-3xl px-5 pb-14 sm:px-10">
              <div className={page.cover_image ? "-mt-10 mb-6" : "mb-6 pt-8"}>
                <div className="flex items-start gap-4">
                  <PageIcon pageId={page.id} currentIcon={page.icon} />
                  <div className="min-w-0 flex-1 pt-2">
                    <PageTitle pageId={page.id} initialTitle={page.title} />
                    <p className="mt-2 text-sm text-[#9b9a97]">
                      Last edited {timeAgo(page.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              <PlateEditor clientSlug={clientSlug} pageId={page.id} initialContent={page.content} />
            </div>
          </div>
        </div>
      </div>

      <CommentSidebar
        clientSlug={clientSlug}
        pageId={page.id}
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
