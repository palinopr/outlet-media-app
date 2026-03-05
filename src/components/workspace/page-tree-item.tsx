"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronRight, MoreHorizontal, Plus, Archive, Trash2, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PageTreeNode } from "@/lib/workspace-types";
import { cn } from "@/lib/utils";

interface PageTreeItemProps {
  node: PageTreeNode;
  depth: number;
  isNodeExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
  basePath: string;
  onCreateChild?: (parentId: string) => void;
  onArchive?: (pageId: string) => void;
  onRestore?: (pageId: string) => void;
  onDelete?: (pageId: string) => void;
  isArchived?: boolean;
}

export function PageTreeItem({
  node,
  depth,
  isNodeExpanded,
  onToggle,
  basePath,
  onCreateChild,
  onArchive,
  onRestore,
  onDelete,
  isArchived,
}: PageTreeItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === `${basePath}/${node.page.id}`;
  const hasChildren = node.children.length > 0;
  const expanded = isNodeExpanded(node.page.id);

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer text-sm hover:bg-muted/50 transition-colors",
          isActive && "bg-muted",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => router.push(`${basePath}/${node.page.id}`)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(node.page.id);
          }}
          className={cn(
            "h-5 w-5 flex items-center justify-center rounded hover:bg-muted shrink-0 transition-transform",
            !hasChildren && "invisible",
            expanded && "rotate-90",
          )}
        >
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </button>

        <span className="text-base shrink-0">{node.page.icon || "📄"}</span>
        <span className="flex-1 truncate text-foreground/80">{node.page.title || "Untitled"}</span>

        <div className="hidden group-hover:flex items-center gap-0.5">
          {!isArchived && onCreateChild && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateChild(node.page.id);
              }}
              className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted"
              title="Add child page"
            >
              <Plus className="h-3 w-3 text-muted-foreground" />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted"
              >
                <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {isArchived ? (
                <>
                  {onRestore && (
                    <DropdownMenuItem onClick={() => onRestore(node.page.id)}>
                      <RotateCcw className="h-3 w-3 mr-2" />
                      Restore
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(node.page.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete permanently
                    </DropdownMenuItem>
                  )}
                </>
              ) : (
                <>
                  {onArchive && (
                    <DropdownMenuItem onClick={() => onArchive(node.page.id)}>
                      <Archive className="h-3 w-3 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expanded &&
        node.children.map((child) => (
          <PageTreeItem
            key={child.page.id}
            node={child}
            depth={depth + 1}
            isNodeExpanded={isNodeExpanded}
            onToggle={onToggle}
            basePath={basePath}
            onCreateChild={onCreateChild}
            onArchive={onArchive}
            onRestore={onRestore}
            onDelete={onDelete}
            isArchived={isArchived}
          />
        ))}
    </div>
  );
}
