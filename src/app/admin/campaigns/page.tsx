import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, ExternalLink, Plus } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Facebook and Instagram ad campaigns
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Active Campaigns</CardTitle>
            <Badge variant="outline" className="text-xs">
              Not connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Megaphone className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No campaigns yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Add your Meta access token and ad account ID to .env
            </p>
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <a
                href="https://developers.facebook.com/apps"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Meta Developers
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
