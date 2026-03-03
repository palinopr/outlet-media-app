"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RunButton } from "@/components/admin/run-button";
import { Wifi, WifiOff } from "lucide-react";
import { timeAgo } from "@/lib/formatters";
import { AGENT_CONFIG, QUICK_RUN_AGENTS } from "./constants";

interface AgentSidebarProps {
  isOnline: boolean;
  lastSeen: string | null;
}

export function AgentSidebar({ isOnline, lastSeen }: AgentSidebarProps) {
  return (
    <div className="space-y-4">

      {/* Status card */}
      <Card className="border-border/60">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-center gap-2.5">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-emerald-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-zinc-500" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? "Agent online" : "Agent offline"}
            </span>
            <span className={`ml-auto h-2 w-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
          </div>
          <p className="text-xs text-muted-foreground">
            Last seen: {timeAgo(lastSeen)}
          </p>
          {!isOnline && (
            <p className="text-xs text-muted-foreground border-t border-border/60 pt-2 font-mono">
              cd agent && npm start
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick run */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 px-0.5">Quick run</p>
        <div className="space-y-2">
          {QUICK_RUN_AGENTS.map((id) => {
            const agent = AGENT_CONFIG[id];
            const Icon = agent.icon;
            return (
              <Card key={id} className="border-border/60">
                <CardContent className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium">{agent.name}</span>
                  </div>
                  <RunButton agentId={id} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
