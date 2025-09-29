import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, User, Fish } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { to: "/catch-logging", icon: Fish, label: "Log Catch" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg mx-auto max-w-md">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-200",
                location.pathname === to 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-200",
                location.pathname === to 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-accent"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};