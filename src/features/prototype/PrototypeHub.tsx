import React from "react";
import { Link } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PrototypeScreen {
  title: string;
  description: string;
  path: string;
  isReal: boolean; // true if linking to existing route, false if prototype stub
}

const screens: PrototypeScreen[] = [
  { title: "Home Page", description: "Landing page", path: "/", isReal: true },
  { title: "Angler Dashboard", description: "Personal angler view", path: "/prototype/angler", isReal: false },
  { title: "President Dashboard", description: "Club admin view", path: "/prototype/president", isReal: false },
  { title: "Club Members", description: "Member management", path: "/prototype/club-members", isReal: false },
  { title: "Club Events", description: "Event scheduling", path: "/prototype/club-events", isReal: false },
  { title: "Tournament List", description: "Browse tournaments", path: "/tournaments", isReal: true },
  { title: "Tournament Detail", description: "Individual tournament", path: "/tournament/demo-tourn-classic", isReal: true },
  { title: "Leaderboard", description: "Rankings & standings", path: "/leaderboard", isReal: true },
  { title: "Profile Screen", description: "User profiles", path: "/profile", isReal: true },
  { title: "Messages Inbox", description: "Message center", path: "/messages", isReal: true },
  { title: "Message Thread", description: "Chat conversations", path: "/messages/demo-thread", isReal: true },
  { title: "AI Coach Overview", description: "AI fishing assistant", path: "/ai-coach", isReal: true },
];

function setQueryParam(name: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  window.history.pushState({}, "", url.toString());
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function PrototypeHub() {
  const { enabled, role } = useDemoMode();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">TrophyCast Prototype</h1>
          <p className="text-muted-foreground text-lg">Investor Demo - All Core Features</p>
        </header>

        {/* Demo Mode Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Demo Mode Control</CardTitle>
            <CardDescription>
              Switch between user roles to see different perspectives
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button 
              variant={!enabled ? "default" : "outline"} 
              size="sm"
              onClick={() => setQueryParam("demo", null)}
            >
              Off
            </Button>
            <Button 
              variant={role === "jake" ? "default" : "outline"} 
              size="sm"
              onClick={() => setQueryParam("demo", "jake")}
            >
              Jake (Angler)
            </Button>
            <Button 
              variant={role === "president" ? "default" : "outline"} 
              size="sm"
              onClick={() => setQueryParam("demo", "president")}
            >
              President (Admin)
            </Button>
          </CardContent>
        </Card>

        {/* Screen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {screens.map((screen) => (
            <Card key={screen.path} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {screen.title}
                  {screen.isReal && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      LIVE
                    </span>
                  )}
                  {!screen.isReal && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      STUB
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{screen.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={screen.path}>View Screen</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Prototype Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• <strong>LIVE</strong> screens are fully functional features</p>
            <p>• <strong>STUB</strong> screens are prototype placeholders with demo data</p>
            <p>• Toggle demo mode to see different user perspectives</p>
            <p>• All navigation works - explore freely!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}