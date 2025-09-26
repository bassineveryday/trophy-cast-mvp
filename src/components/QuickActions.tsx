import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Calendar, Trophy, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const QuickActions = () => {
  const actions = [
    {
      to: "/catch-logging",
      icon: Camera,
      label: "Log Catch",
      className: "bg-gradient-nature hover:shadow-glow text-white font-bold text-sm shadow-lg border-0"
    },
    {
      to: "/calendar",
      icon: Calendar,
      label: "Calendar",
      className: "border-2 border-water-blue/40 hover:bg-water-blue/10 hover:border-water-blue hover:shadow-glow",
      iconColor: "text-water-blue"
    },
    {
      to: "/leaderboard",
      icon: Trophy,
      label: "AOY Standings", 
      className: "border-2 border-trophy-gold/40 hover:bg-trophy-gold/10 hover:border-trophy-gold hover:shadow-trophy",
      iconColor: "text-trophy-gold"
    },
    {
      to: "/ai-coach",
      icon: Brain,
      label: "AI Coach",
      className: "border-2 border-fishing-green/40 hover:bg-fishing-green/10 hover:border-fishing-green hover:shadow-glow",
      iconColor: "text-fishing-green",
      badge: "Preview"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-background to-muted/30 rounded-2xl p-6 shadow-card-custom border border-border/50"
    >
      <h3 className="text-lg font-bold mb-4 text-center">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link key={action.to} to={action.to}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Button 
                variant={action.className.includes("gradient") ? "default" : "outline"}
                className={`w-full h-20 font-bold text-sm ${action.className}`}
              >
                <div className="flex flex-col items-center">
                  <action.icon className={`w-6 h-6 mb-1 ${action.iconColor || ''}`} />
                  <span>{action.label}</span>
                </div>
              </Button>
              {action.badge && (
                <Badge className="absolute -top-2 -right-2 bg-trophy-gold text-foreground text-xs px-2 py-1">
                  {action.badge}
                </Badge>
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};