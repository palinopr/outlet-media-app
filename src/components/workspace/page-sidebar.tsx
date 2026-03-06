"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ChevronDown, Archive, CheckSquare, Home, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WorkspacePage } from "@/lib/workspace-types";
import { usePageTree } from "@/hooks/use-page-tree";
import { PageTreeItem } from "./page-tree-item";

interface PageSidebarProps {
  pages: WorkspacePage[];
  basePath: string;
  clientSlug: string;
  workspaceName: string;
  workspaceHint: string;
}

export function PageSidebar({
  pages,
  basePath,
  clientSlug,
  workspaceName,
  workspaceHint,
}: PageSidebarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showArchived, setShowArchived] = useState(false);
  const { tree, archivedTree, filter, setFilter, toggleExpanded, isExpanded } =
    usePageTree(pages);
  const workspaceInitial = workspaceName.charAt(0).toUpperCase();

  const handleCreatePage = useCallback(
    async (parentId?: string) => {
      const res = await fetch("/api/workspace/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled",
          client_slug: clientSlug,
          parent_page_id: parentId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        startTransition(() => {
          router.push(`${basePath}/${data.id}`);
        });
      }
    },
    [clientSlug, basePath, router],
  );

  const handleArchive = useCallback(
    async (pageId: string) => {
      await fetch(`/api/workspace/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_archived: true }),
      });
      startTransition(() => router.refresh());
    },
    [router],
  );

  const handleRestore = useCallback(
    async (pageId: string) => {
      await fetch(`/api/workspace/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_archived: false }),
      });
      startTransition(() => router.refresh());
    },
    [router],
  );

  const handleDelete = useCallback(
    async (pageId: string) => {
      await fetch(`/api/workspace/pages/${pageId}`, {
        method: "DELETE",
      });
      startTransition(() => router.refresh());
    },
    [router],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 border-b border-[#ece9e2] px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ece8dd] text-sm font-semibold text-[#5f5135]">
            {workspaceInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#37352f]">{workspaceName}</p>
            <p className="truncate text-xs text-[#9b9a97]">{workspaceHint}</p>
          </div>
          <button
            type="button"
            onClick={() => handleCreatePage()}
            disabled={isPending}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#787774] transition-colors hover:bg-[#efede8] hover:text-[#37352f] disabled:opacity-50"
            title="New page"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="shrink-0 space-y-0.5 px-2 pt-3 pb-1">
        <button
          onClick={() => router.push(basePath)}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-[#6f6e69] transition-colors hover:bg-[#efede8] hover:text-[#37352f]"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => router.push(`${basePath}/tasks`)}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-[#6f6e69] transition-colors hover:bg-[#efede8] hover:text-[#37352f]"
        >
          <CheckSquare className="h-4 w-4" />
          <span>Tasks</span>
        </button>
      </div>

      <div className="shrink-0 px-2 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#9b9a97]" />
          <Input
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-8 rounded-md border-[#e6e3dc] bg-white px-8 text-xs text-[#37352f] placeholder:text-[#9b9a97] shadow-none focus-visible:border-[#d6d3cc] focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <span className="text-[11px] font-semibold text-[#9b9a97]">Pages</span>
        <button
          type="button"
          onClick={() => handleCreatePage()}
          disabled={isPending}
          className="flex h-5 w-5 items-center justify-center rounded text-[#9b9a97] transition-colors hover:bg-[#efede8] hover:text-[#37352f]"
          title="New page"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <ScrollArea className="flex-1 px-1">
        <div className="py-0.5">
          {tree.length === 0 && (
            <div className="px-3 py-8 text-center">
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1efea] text-[#9b9a97]">
                <FileText className="h-4 w-4" />
              </div>
              <p className="text-xs text-[#787774]">
                {filter ? "No pages match" : "No pages yet"}
              </p>
            </div>
          )}
          {tree.map((node) => (
            <PageTreeItem
              key={node.page.id}
              node={node}
              depth={0}
              isNodeExpanded={isExpanded}
              onToggle={toggleExpanded}
              basePath={basePath}
              onCreateChild={handleCreatePage}
              onArchive={handleArchive}
            />
          ))}
        </div>

        {archivedTree.length > 0 && (
          <div className="mt-4 border-t border-[#ece9e2] pt-2">
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-[#787774] transition-colors hover:text-[#37352f]"
            >
              <Archive className="h-3 w-3" />
              <span>Archived ({archivedTree.length})</span>
              <ChevronDown
                className={`ml-auto h-3 w-3 transition-transform ${showArchived ? "rotate-180" : ""}`}
              />
            </button>
            {showArchived &&
              archivedTree.map((node) => (
                <PageTreeItem
                  key={node.page.id}
                  node={node}
                  depth={0}
                  isNodeExpanded={isExpanded}
                  onToggle={toggleExpanded}
                  basePath={basePath}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  isArchived
                />
              ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
