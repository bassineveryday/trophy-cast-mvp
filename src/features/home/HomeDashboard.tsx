import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Trophy, Fish, Bell, Calendar } from "lucide-react";

export default function HomeDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to Trophy Cast</h1>
        <p className="text-sm text-muted-foreground">Where Every Cast Counts</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard
          to="/catch-logging"
          icon={Mic}
          title="Log Catch by Voice"
          desc="Tap, speak weight & length"
        />
        <ActionCard
          to="/leaderboard"
          icon={Trophy}
          title="Live Leaderboard"
          desc="See standings in real time"
        />
        <ActionCard
          to="/my-catches"
          icon={Fish}
          title="My Fish Room"
          desc="History, photos, trophies"
        />
      </div>

      {/* Upcoming Tournaments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Tournaments</CardTitle>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <EmptyLine text="No tournaments yet." />
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link to="/tournaments">Manage Events</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link to="/tournaments">Add Tournament</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notifications</CardTitle>
          <Bell className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <EmptyLine text="No notifications yet." />
          <div className="flex gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link to="/messages">Open Messages</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/profile">Notification Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <EmptyLine text="No recent activity yet." />
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link to="/my-catches">View My Catches</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/catch-logging">Log a Catch</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------- small helpers ------- */

function ActionCard({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">{desc}</p>
        <Button asChild className="w-full h-12">
          <Link to={to}>{title}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyLine({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center rounded-md border border-dashed p-6 text-sm text-muted-foreground">
      {text}
    </div>
  );
}
