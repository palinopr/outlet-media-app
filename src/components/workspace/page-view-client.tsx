"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "./page-title";
import { PageIcon } from "./page-icon";
import { PageCover } from "./page-cover";
import { PlateEditor } from "./plate-editor";
import { CommentSidebar } from "./comment-sidebar";
import type { WorkspacePage } from "@/lib/workspace-types";

interface PageViewClientProps {
  page: WorkspacePage;
  currentUserId: string;
}

export function PageViewClient({ page, currentUserId }: PageViewClientProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <PageCover pageId={page.id} coverImage={page.cover_image} />

          {/* Notion-style icon + title */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <PageIcon pageId={page.id} currentIcon={page.icon} />
              <div className="flex-1 min-w-0 pt-1">
                <PageTitle pageId={page.id} initialTitle={page.title} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 h-8 w-8 p-0 text-white/30 hover:text-white/60"
                onClick={() => setCommentsOpen(!commentsOpen)}
                title="Comments"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <PlateEditor pageId={page.id} initialContent={page.content} />
        </div>
      </div>

      <CommentSidebar
        pageId={page.id}
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
