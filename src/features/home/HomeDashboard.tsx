import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CalendarDays,
  Fish,
  ClipboardList,
  Trophy,
} from "lucide-react";

export default function HomeDashboard() {
  return (
    <div className="min-h-screen">
      {/* HERO / WELCOME */}
      <div className="bg-gradient-to-br from-sky-600 to-emerald-500 text-white px-5 py-6 rounded-b-2xl shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20" />
            <div>
              <p className="text-sm/4 opacity-90">Welcome back, Ty Hunt!</p>
              <div className="flex items-center gap-2">
                <p className="text-xs/5 opacity-90">2019 AOY Champion</p>
                <Badge className="bg-white/20 text-white border-white/30">⭐</Badge>
                <Badge className="bg-white/20 text-white border-white/30">🏆</Badge>
                <Badge className="bg-white/20 text-white border-white/30">7.1</Badge>
              </div>
            </div>
            <div className="ml-auto relative">
              <div className="h-8 w-8 rounded-full bg-white/20 grid place-items-center">
                <Bell className="h-4 w-4" />
              </div>
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-[10px] grid place-items-center">3</span>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Where Every Cast Counts
            </h1>
            <p className="text-sm/6 opacity-90">
              AI-powered tournament fishing companion
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="max-w-5xl mx-auto px-5 -mt-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Catches This Week */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Fish className="h-5 w-5 text-sky-600" />
                Catches This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-muted-foreground">0</div>
              </div>
              <Button asChild size="sm">
                <Link to="/catch-logging">Log Catch by Voice</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Active Plans */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
                Active Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-muted-foreground">0</div>
              </div>
              <Button asChild size="sm">
                <Link to="/plans">Open A Plan</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tournaments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <CalendarDays className="h-5 w-5 text-amber-600" />
                Upcoming Tournaments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-muted-foreground">0</div>
              </div>
              <Button asChild size="sm">
                <Link to="/tournaments">Add Tournament</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Bell className="h-5 w-5 text-indigo-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-muted-foreground">0</div>
              </div>
              <Button asChild size="sm">
                <Link to="/messages">View Messages</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RECENT ACTIVITY */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <EmptyRow text="No recent activity yet." />
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link to="/my-catches">View My Catches</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/catch-logging">Log a Catch</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/leaderboard">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" /> Leaderboard
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* helpers */
function EmptyRow({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground grid place-items-center">
      {text}
    </div>
  );
}
