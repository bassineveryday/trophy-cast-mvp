import { Button } from "@/components/ui/button";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/contexts/VoiceContext";
import { useContextAwareAI } from "@/contexts/ContextAwareAIContext";
import { VoiceWaveform } from "./VoiceWaveform";
import { AIResponseBubble } from "./AIResponseBubble";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ContextAwareFloatingButtonProps {
  className?: string;
}

export const ContextAwareFloatingButton: React.FC<ContextAwareFloatingButtonProps> = ({ 
  className 
}) => {
  const navigate = useNavigate();
  const { 
    isVoiceModeEnabled, 
    voiceState, 
    transcript, 
    startListening,
    toggleVoiceMode
  } = useVoice();
  
  const { getContextPrompt, getContextResponse } = useContextAwareAI();
  const [showResponse, setShowResponse] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ message: string; actions: Array<{ label: string; action: () => void }> } | null>(null);
  const [showLiveBadge, setShowLiveBadge] = useState(false);

  if (!isVoiceModeEnabled) return null;

  const handleSingleTap = () => {
    if (voiceState === "idle") {
      navigate("/ai-coach");
    }
  };

  const handleTapAndHold = () => {
    if (voiceState === "idle") {
      startListening();
      
      // Mock listening process
      setTimeout(() => {
        const response = getContextResponse("mock voice input");
        setAiResponse(response);
        setShowResponse(true);
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
          setShowResponse(false);
        }, 4000);
      }, 2000);
    }
  };

  const handleLongPress = () => {
    toggleVoiceMode();
    
    if (!isVoiceModeEnabled) {
      setShowLiveBadge(true);
      setTimeout(() => setShowLiveBadge(false), 2000);
    }
  };

  const getButtonColor = () => {
    switch (voiceState) {
      case "listening":
        return "bg-trophy-gold hover:bg-trophy-gold/90 text-white shadow-lg shadow-trophy-gold/25";
      case "processing":
        return "bg-water-blue hover:bg-water-blue/90 text-white shadow-lg shadow-water-blue/25";
      case "result":
        return "bg-fishing-green hover:bg-fishing-green/90 text-white shadow-lg shadow-fishing-green/25";
      default:
        return isVoiceModeEnabled 
          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg" 
          : "bg-muted hover:bg-muted/90 text-muted-foreground";
    }
  };

  const getIcon = () => {
    switch (voiceState) {
      case "processing":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case "listening":
        return <Brain className="w-5 h-5" />;
      default:
        return isVoiceModeEnabled ? (
          <div className="relative">
            <Brain className="w-5 h-5" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-trophy-gold animate-pulse" />
          </div>
        ) : (
          <Brain className="w-5 h-5 opacity-50" />
        );
    }
  };

  const getPulseAnimation = () => {
    if (voiceState === "listening") {
      return {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      };
    }
    return {};
  };

  const buttonProps = {
    onMouseDown: () => {
      // Start timer for long press
      const timer = setTimeout(handleLongPress, 800);
      
      const handleMouseUp = () => {
        clearTimeout(timer);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mouseup', handleMouseUp);
    },
    onTouchStart: (e: any) => {
      e.preventDefault();
      const timer = setTimeout(handleLongPress, 800);
      
      const handleTouchEnd = () => {
        clearTimeout(timer);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchend', handleTouchEnd);
    },
    onClick: (e: any) => {
      e.preventDefault();
      // Determine if it's a tap and hold or single tap based on timing
      if (voiceState === "idle") {
        const isQuickTap = true; // Simplified - in real implementation, track timing
        if (isQuickTap) {
          handleTapAndHold(); // For demo, always do tap and hold
        } else {
          handleSingleTap();
        }
      }
    }
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <div className="relative">
        {/* Waveform Animation */}
        <VoiceWaveform isListening={voiceState === "listening"} />
        
        {/* AI Response Bubble */}
        <AIResponseBubble 
          response={aiResponse}
          isVisible={showResponse && voiceState === "result"}
          onDismiss={() => setShowResponse(false)}
        />
        
        {/* AI Button */}
        <motion.div animate={getPulseAnimation()}>
          <Button
            {...buttonProps}
            disabled={voiceState === "processing"}
            className={cn(
              "w-14 h-14 rounded-full shadow-lg transition-all duration-300 relative overflow-hidden",
              getButtonColor()
            )}
            aria-label="AI Coach — push to talk"
          >
            {getIcon()}
            
            {/* Live Badge */}
            <AnimatePresence>
              {showLiveBadge && isVoiceModeEnabled && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-fishing-green text-white text-xs px-1.5 py-0.5 rounded-full font-medium"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  LIVE
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
        
        {/* Context Prompt Helper */}
        {voiceState === "listening" && (
          <motion.div 
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 max-w-[280px] shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              {getContextPrompt()}
            </p>
          </motion.div>
        )}
        
        {/* Off State Tooltip */}
        {!isVoiceModeEnabled && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
            AI paused (no live updates)
          </div>
        )}
      </div>
    </div>
  );
};