import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink, RefreshCw } from "lucide-react";

export default function EventsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tour events pulled from Ticketmaster
          </p>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Sync Now
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Upcoming Events</CardTitle>
            <Badge variant="outline" className="text-xs">
              Not connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No events yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Add your Ticketmaster API key to .env to sync events
            </p>
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <a
                href="https://developer.ticketmaster.com/products-and-docs/apis/getting-started/"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Get API Key
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
