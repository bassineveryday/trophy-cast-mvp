import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { ContextAwareAIProvider } from "@/contexts/ContextAwareAIContext";
import { VoiceToggle } from "@/components/voice/VoiceToggle";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";

/**
 * AICoachLayout - Specialized layout for AI Coach feature flows
 * Provides consistent header, navigation, and AI-specific UI elements
 * Used for all /ai-coach/* routes
 */
export const AICoachLayout = () => {
  return (
    <ContextAwareAIProvider>
      <VoiceProvider>
        <Toaster />
        <Sonner />
        
        <div className="min-h-screen bg-background">
          {/* AI Coach Header - consistent across all AI coach pages */}
          <div className="bg-gradient-water text-white p-4">
            <div className="flex items-center mb-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold ml-2 flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                AI Coach
              </h1>
            </div>
          </div>

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