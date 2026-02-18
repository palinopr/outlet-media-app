import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, DollarSign, CalendarDays, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Active Campaigns",
    value: "—",
    description: "Connect Meta API",
    icon: Megaphone,
  },
  {
    title: "Total Spend",
    value: "—",
    description: "This month",
    icon: DollarSign,
  },
  {
    title: "Events Tracked",
    value: "—",
    description: "Connect Ticketmaster",
    icon: CalendarDays,
  },
  {
    title: "Avg. ROAS",
    value: "—",
    description: "Return on ad spend",
    icon: TrendingUp,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Autonomous campaign overview
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          No APIs connected
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {stats.map(({ title, value, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Add Clerk API keys to .env", done: false },
              { label: "Add Ticketmaster API key to .env", done: false },
              { label: "Add Meta access token and ad account ID to .env", done: false },
              { label: "Deploy to Vercel", done: false },
            ].map(({ label, done }) => (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={`h-4 w-4 rounded-full border flex-shrink-0 ${
                    done ? "bg-green-500 border-green-500" : "border-muted-foreground"
                  }`}
                />
                <span className={done ? "line-through text-muted-foreground" : ""}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
