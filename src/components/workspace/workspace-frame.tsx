"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { WorkspacePage } from "@/lib/workspace-types";
import { cn } from "@/lib/utils";
import { PageSidebar } from "./page-sidebar";

interface WorkspaceFrameProps {
  children: ReactNode;
  pages: WorkspacePage[];
  basePath: string;
  clientSlug: string;
}

function formatWorkspaceName(clientSlug: string) {
  if (clientSlug === "admin") return "Outlet Media";

  return clientSlug
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function WorkspaceFrame({
  children,
  pages,
  basePath,
  clientSlug,
}: WorkspaceFrameProps) {
  const workspaceName = formatWorkspaceName(clientSlug);
  const workspaceHint = clientSlug === "admin" ? "Internal workspace" : "Shared client workspace";

  return (
    <div className="-mx-4 -my-4 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f3f2ef] text-[#37352f] sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8">
      <aside className="hidden w-[272px] shrink-0 border-r border-[#e6e3dc] bg-[#fbfbfa] md:flex">
        <PageSidebar
          pages={pages}
          basePath={basePath}
          clientSlug={clientSlug}
          workspaceName={workspaceName}
          workspaceHint={workspaceHint}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[linear-gradient(180deg,#f8f7f4_0%,#ffffff_14rem)]">
        <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-[#ece9e2] bg-[#fbfbfa]/90 px-3 backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b6a68] transition-colors hover:bg-[#efede8] hover:text-[#37352f] md:hidden"
                  aria-label="Open workspace navigation"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                showCloseButton={false}
                className="w-[280px] border-r border-[#e6e3dc] bg-[#fbfbfa] p-0 sm:max-w-[280px]"
              >
                <PageSidebar
                  pages={pages}
                  basePath={basePath}
                  clientSlug={clientSlug}
                  workspaceName={workspaceName}
                  workspaceHint={workspaceHint}
                />
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#37352f]">{workspaceName}</p>
              <p className="truncate text-xs text-[#9b9a97]">{workspaceHint}</p>
            </div>
          </div>

          <div
            className={cn(
              "rounded-full border border-[#e6e3dc] bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#787774]",
              clientSlug === "admin" && "text-[#6a5f3d]",
            )}
          >
            {clientSlug === "admin" ? "Admin access" : "Client access"}
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
