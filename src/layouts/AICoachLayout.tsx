import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Brain, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { ContextAwareAIProvider } from "@/contexts/ContextAwareAIContext";
import { VoiceToggle } from "@/components/voice/VoiceToggle";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
import { UniversalHeader } from "@/components/UniversalHeader";

/**
 * AICoachLayout - Specialized layout for AI Coach feature flows
 * Provides consistent header, navigation, and AI-specific UI elements
 * Used for all /ai-coach/* routes
 */
export const AICoachLayout = () => {
  const navigate = useNavigate();
  
  const handleCloseAICoach = () => {
    navigate('/');
  };
  
  return (
    <ContextAwareAIProvider>
      <VoiceProvider>
        <Toaster />
        <Sonner />
        
        <div className="min-h-screen bg-background">
          {/* Universal Header with AI Coach branding */}
          <UniversalHeader 
            title="AI Coach"
            customActions={
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseAICoach}
                className="h-11 w-11 p-0 hover:bg-accent"
                aria-label="Close AI Coach"
              >
                <X className="h-5 w-5" />
              </Button>
            }
          />

          <div className="p-4">
            {/* Voice controls - available on all AI coach pages */}
            <div className="mb-4 space-y-3">
              <VoiceToggle />
              
              {/* Demo notice - consistent across AI coach features */}
              <div className="text-center">
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  Demo only—no live AI
                </Badge>
              </div>
            </div>

            {/* AI Coach content area */}
            <Outlet />
          </div>

          {/* Context-aware AI button - available throughout AI coach flows */}
          <ContextAwareFloatingButton />
        </div>
      </VoiceProvider>
    </ContextAwareAIProvider>
  );
};