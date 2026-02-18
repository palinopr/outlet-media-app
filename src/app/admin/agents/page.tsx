import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Play, RefreshCw } from "lucide-react";

const agents = [
  {
    name: "ticketmaster-scraper",
    description: "Syncs event data and TM1 numbers from Ticketmaster",
    status: "idle" as const,
    lastRun: null as string | null,
  },
  {
    name: "meta-ads-manager",
    description: "Creates and optimizes Facebook/Instagram ad campaigns",
    status: "idle" as const,
    lastRun: null as string | null,
  },
  {
    name: "campaign-monitor",
    description: "Monitors campaign performance and pauses underperformers",
    status: "idle" as const,
    lastRun: null as string | null,
  },
];

const statusColor: Record<string, string> = {
  idle: "secondary",
  running: "default",
  error: "destructive",
};

export default function AgentsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Agents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Autonomous workers that manage your campaigns
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <Card key={agent.name}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-mono">{agent.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {agent.description}
                    </p>
                  </div>
                </div>
                <Badge variant={statusColor[agent.status] as "secondary" | "default" | "destructive"}>
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Last run: {agent.lastRun ?? "Never"}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                    <RefreshCw className="h-3 w-3" />
                    Logs
                  </Button>
                  <Button size="sm" className="h-7 text-xs gap-1.5">
                    <Play className="h-3 w-3" />
                    Run
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
