"use client";

import { useMemo, useState, useCallback } from "react";
import type { WorkspacePage, PageTreeNode } from "@/lib/workspace-types";

function buildTree(pages: WorkspacePage[]): PageTreeNode[] {
  const map = new Map<string, PageTreeNode>();
  const roots: PageTreeNode[] = [];

  for (const page of pages) {
    map.set(page.id, { page, children: [] });
  }

  for (const page of pages) {
    const node = map.get(page.id)!;
    if (page.parent_page_id && map.has(page.parent_page_id)) {
      map.get(page.parent_page_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function usePageTree(pages: WorkspacePage[]) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");

  const activePages = useMemo(
    () => pages.filter((p) => !p.is_archived),
    [pages],
  );

  const archivedPages = useMemo(
    () => pages.filter((p) => p.is_archived),
    [pages],
  );

  const filteredPages = useMemo(() => {
    if (!filter) return activePages;
    const lower = filter.toLowerCase();
    return activePages.filter((p) => p.title.toLowerCase().includes(lower));
  }, [activePages, filter]);

  const tree = useMemo(() => buildTree(filteredPages), [filteredPages]);
  const archivedTree = useMemo(() => buildTree(archivedPages), [archivedPages]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isExpanded = useCallback(
    (id: string) => expandedIds.has(id),
    [expandedIds],
  );

  return {
    tree,
    archivedTree,
    filter,
    setFilter,
    toggleExpanded,
    isExpanded,
  };
}
