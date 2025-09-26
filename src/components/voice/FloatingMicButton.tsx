import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Loader2, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useVoice } from "@/contexts/VoiceContext";
import { VoiceWaveform } from "./VoiceWaveform";
import { TranscriptBubble } from "./TranscriptBubble";
import { ContextTips } from "./ContextTips";
import { VoiceCheatSheet } from "./VoiceCheatSheet";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface FloatingMicButtonProps {
  className?: string;
}

export const FloatingMicButton: React.FC<FloatingMicButtonProps> = ({ 
  className 
}) => {
  const { 
    voiceState, 
    transcript, 
    currentTip,
    showCheatSheet,
    isDemoMode,
    startListening,
    setShowCheatSheet,
    setDemoMode
  } = useVoice();
  
  const [showContextTips, setShowContextTips] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-open cheat sheet in demo mode
  useEffect(() => {
    if (isDemoMode && !showCheatSheet) {
      const timer = setTimeout(() => {
        setShowCheatSheet(true);
        setDemoMode(false); // Only show once
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isDemoMode, showCheatSheet, setShowCheatSheet, setDemoMode]);

  const handleMouseDown = () => {
    if (voiceState === "idle") {
      const timer = setTimeout(() => {
        setShowContextTips(true);
      }, 500); // Show tips after 500ms hold
      
      setPressTimer(timer);
    }
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    
    if (showContextTips) {
      setShowContextTips(false);
    } else if (voiceState === "idle") {
      startListening();
    }
  };

  const handleClick = () => {
    if (voiceState === "idle" && !showContextTips) {
      startListening();
    }
  };

  const getButtonColor = () => {
    switch (voiceState) {
      case "listening":
        return "bg-trophy-gold hover:bg-trophy-gold/90 text-white";
      case "processing":
        return "bg-water-blue hover:bg-water-blue/90 text-white";
      case "result":
        return "bg-fishing-green hover:bg-fishing-green/90 text-white";
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
  };

  const getIcon = () => {
    switch (voiceState) {
      case "processing":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      default:
        return <Mic className="w-5 h-5" />;
    }
  };

  const getPulseAnimation = () => {
    if (voiceState === "listening") {
      return {
        scale: [1, 1.1, 1],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      };
    }
    return {};
  };

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <div className="relative">
          {/* Waveform Animation */}
          <VoiceWaveform isListening={voiceState === "listening"} />
          
          {/* Context Tips */}
          <ContextTips 
            isVisible={showContextTips} 
            currentTip={currentTip}
          />
          
          {/* Transcript Bubble */}
          <TranscriptBubble 
            transcript={transcript} 
            isVisible={voiceState === "result"} 
          />
          
          {/* What can I say chip */}
          <motion.div
            className="absolute -top-20 -left-20 z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-muted/50 transition-colors text-xs px-2 py-1 bg-background/90 backdrop-blur-sm"
              onClick={() => setShowCheatSheet(true)}
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              What can I say?
            </Badge>
          </motion.div>
          
          {/* Mic Button */}
          <motion.div animate={getPulseAnimation()}>
            <Button
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              disabled={voiceState === "processing"}
              className={cn(
                "w-14 h-14 rounded-full shadow-lg transition-all duration-200 select-none",
                getButtonColor()
              )}
              aria-label="Voice Mode - Press and hold for tips, tap to speak"
            >
              {getIcon()}
            </Button>
          </motion.div>
          
          {/* Helper Text */}
          {voiceState === "listening" && (
            <motion.p 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Listening...
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Voice Cheat Sheet */}
      <VoiceCheatSheet 
        isOpen={showCheatSheet}
        onClose={() => setShowCheatSheet(false)}
      />
    </>
  );
};