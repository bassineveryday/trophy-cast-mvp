import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, Award, Fish, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Home, label: "Home", color: "water-blue" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard", color: "trophy-gold" },
    { to: "/ai-coach", icon: Brain, label: "AI Coach", featured: true, color: "trophy-gold" },
    { to: "/catch-logging", icon: Fish, label: "Log Catch", color: "fishing-green" },
    { to: "/trophy-room", icon: Award, label: "Trophy Room", color: "amber" },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg mx-auto max-w-md">
        <div className="flex items-center justify-between px-2 py-3 gap-1">
          {navItems.map(({ to, icon: Icon, label, featured, color }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-200 flex-1",
                featured && "scale-110"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-200",
                location.pathname === to && color === "water-blue" && "bg-[hsl(var(--water-blue))]/10 text-[hsl(var(--water-blue))]",
                location.pathname === to && color === "trophy-gold" && "bg-[hsl(var(--trophy-gold))]/10 text-[hsl(var(--trophy-gold))]",
                location.pathname === to && color === "fishing-green" && "bg-[hsl(var(--fishing-green))]/10 text-[hsl(var(--fishing-green))]",
                location.pathname === to && color === "amber" && "bg-amber-500/10 text-amber-500",
                location.pathname !== to && color === "water-blue" && "text-[hsl(var(--water-blue))]/70 hover:text-[hsl(var(--water-blue))] hover:bg-[hsl(var(--water-blue))]/5",
                location.pathname !== to && color === "trophy-gold" && "text-[hsl(var(--trophy-gold))]/70 hover:text-[hsl(var(--trophy-gold))] hover:bg-[hsl(var(--trophy-gold))]/5",
                location.pathname !== to && color === "fishing-green" && "text-[hsl(var(--fishing-green))]/70 hover:text-[hsl(var(--fishing-green))] hover:bg-[hsl(var(--fishing-green))]/5",
                location.pathname !== to && color === "amber" && "text-amber-500/70 hover:text-amber-500 hover:bg-amber-500/5",
                featured && location.pathname !== to && "bg-[hsl(var(--trophy-gold))]/10"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-xs font-medium mt-1",
                location.pathname === to && color === "water-blue" && "text-[hsl(var(--water-blue))]",
                location.pathname === to && color === "trophy-gold" && "text-[hsl(var(--trophy-gold))]",
                location.pathname === to && color === "fishing-green" && "text-[hsl(var(--fishing-green))]",
                location.pathname === to && color === "amber" && "text-amber-500",
                location.pathname !== to && color === "water-blue" && "text-[hsl(var(--water-blue))]/70",
                location.pathname !== to && color === "trophy-gold" && "text-[hsl(var(--trophy-gold))]/70",
                location.pathname !== to && color === "fishing-green" && "text-[hsl(var(--fishing-green))]/70",
                location.pathname !== to && color === "amber" && "text-amber-500/70"
              )}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};