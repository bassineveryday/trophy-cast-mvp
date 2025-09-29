import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fish, Trophy, Archive } from "lucide-react";

const HomeDashboard = () => {
  const quickActions = [
    {
      to: "/catch-logging",
      icon: Fish,
      label: "Log Catch by Voice",
      description: "Use voice commands to quickly log your catches"
    },
    {
      to: "/leaderboard", 
      icon: Trophy,
      label: "Live Leaderboard",
      description: "Check current tournament standings"
    },
    {
      to: "/my-catches",
      icon: Archive, 
      label: "My Fish Room",
      description: "View all your logged catches"
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to TrophyCast
        </h1>
        <p className="text-muted-foreground">
          Your bass fishing tournament companion
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map(({ to, icon: Icon, label, description }) => (
          <Card key={to} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-lg">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {description}
              </p>
              <Button asChild className="w-full">
                <Link to={to}>
                  {label}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeDashboard;