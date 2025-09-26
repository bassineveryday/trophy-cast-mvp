import { useState, useEffect } from "react";
import { Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const AIStatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Simulate AI sync pulses every 3-5 minutes
    const syncInterval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000);
    }, Math.random() * 120000 + 180000); // 3-5 minutes

    return () => {
      clearInterval(timeInterval);
      clearInterval(syncInterval);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Link
      to="/ai-coach/tournament-plan"
      className="block w-full bg-gradient-to-r from-background/95 to-accent/30 border-b border-trophy-gold/20 hover:from-background/90 hover:to-accent/40 transition-all duration-300"
    >
      <div className="flex items-center justify-center gap-2 px-4 py-2">
        <div className="relative">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-trophy-gold/20 ${isPulsing ? 'animate-pulse' : ''}`}>
            <Brain className={`w-3 h-3 text-trophy-gold ${isPulsing ? 'animate-pulse' : ''}`} />
          </div>
          {isPulsing && (
            <div className="absolute inset-0 rounded-full bg-trophy-gold/30 animate-ping" />
          )}
        </div>
        
        <div className="flex items-center gap-1 text-xs">
          <span className="text-muted-foreground">AI Coach synced as of</span>
          <span className="text-fishing-green font-medium">{formatTime(currentTime)}</span>
          
          {isPulsing && (
            <div className="flex items-center gap-1 ml-2">
              <Zap className="w-3 h-3 text-trophy-gold animate-pulse" />
              <span className="text-trophy-gold font-medium">Updating</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground hidden sm:block">
          Weather • Moon • Conditions Live
        </div>
      </div>
      
      {/* Subtle heartbeat line when syncing */}
      {isPulsing && (
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-trophy-gold to-transparent animate-pulse" />
      )}
    </Link>
  );
};

export default AIStatusBar;