import { Link, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { Home, Trophy, Mic, Brain, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const BottomNavigation = () => {
  const location = useLocation();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleVoicePress = () => {
    setIsVoiceActive(true);
    toast({
      title: "Voice Command Active",
      description: "Listening... Say 'Log a catch' or ask a question",
    });
    
    // Simulate voice command processing
    voiceTimeoutRef.current = setTimeout(() => {
      setIsVoiceActive(false);
    }, 3000);
  };

  const handleVoiceRelease = () => {
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
    }
    setIsVoiceActive(false);
  };

  const handleAITap = () => {
    // Single tap opens AI chat
    window.location.href = '/ai-coach';
  };

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg mx-auto max-w-sm">
        <div className="flex items-center justify-between px-6 py-3">
          
          {/* Home - Left */}
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-200",
              location.pathname === "/" 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-200",
              location.pathname === "/" 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-accent"
            )}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium mt-1">Home</span>
          </Link>

          {/* AI Voice Command - Center */}
          <div className="flex flex-col items-center">
            <Button
              onClick={handleAITap}
              onMouseDown={handleVoicePress}
              onMouseUp={handleVoiceRelease}
              onMouseLeave={handleVoiceRelease}
              onTouchStart={handleVoicePress}
              onTouchEnd={handleVoiceRelease}
              className={cn(
                "w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg transition-all duration-200 transform",
                isVoiceActive ? "scale-110 shadow-xl bg-blue-500" : "hover:scale-105"
              )}
            >
              {isVoiceActive ? (
                <Waves className="w-6 h-6 text-white animate-pulse" />
              ) : (
                <div className="flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white mr-0.5" />
                  <Mic className="w-4 h-4 text-white ml-0.5" />
                </div>
              )}
            </Button>
            <span className="text-xs font-medium mt-1 text-center">
              {isVoiceActive ? "Listening..." : "AI Voice"}
            </span>
          </div>

          {/* Trophy Room - Right */}
          <Link
            to="/profile"
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-200",
              (location.pathname === "/profile" || location.pathname.includes("/tournaments")) 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-200",
              (location.pathname === "/profile" || location.pathname.includes("/tournaments")) 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-accent"
            )}>
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium mt-1">Trophy Room</span>
          </Link>

        </div>
      </div>
    </nav>
  );
};