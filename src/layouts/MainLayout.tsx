import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ContextAwareAIProvider } from "@/contexts/ContextAwareAIContext";
import { VoiceProvider } from "@/contexts/VoiceContext";

/**
 * MainLayout - Wrapper for all main application pages
 * Provides shared UI elements and context providers for the main app flow
 * Excludes standalone pages like auth, error, or specialized layouts
 */
export const MainLayout = () => {
  return (
    <ContextAwareAIProvider>
      <VoiceProvider>
        {/* Global toast notifications */}
        <Toaster />
        <Sonner />
        
        {/* Main content area */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </VoiceProvider>
    </ContextAwareAIProvider>
  );
};