import { Home, Bot, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "cortana", label: "Hey, Cortana", icon: Bot },
    { id: "trophy", label: "Trophy Room", icon: Trophy },
  ];

  return (
    <div className="flex items-center justify-center space-x-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isCortana = tab.id === "cortana";
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            size={isCortana ? "lg" : "default"}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-all",
              isCortana && "bg-primary/90 hover:bg-primary text-primary-foreground scale-110 shadow-lg",
              isActive && !isCortana && "bg-accent text-accent-foreground",
              !isActive && "hover:bg-accent/50"
            )}
          >
            <Icon size={isCortana ? 24 : 20} />
            <span className="text-xs font-medium">{tab.label}</span>
          </Button>
        );
      })}
    </div>
  );
};