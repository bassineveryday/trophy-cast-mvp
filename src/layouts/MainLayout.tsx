import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ContextAwareAIProvider } from "@/contexts/ContextAwareAIContext";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { Navigation } from "@/components/Navigation";
import { UniversalHeader } from "@/components/UniversalHeader";
import { DemoUserSwitcher } from "@/components/demo/DemoUserSwitcher";
import { useDemoMode } from "@/contexts/DemoModeContext";

/**
 * MainLayout - Wrapper for all main application pages
 * Provides shared UI elements and context providers for the main app flow
 * Excludes standalone pages like auth, error, or specialized layouts
 */
export const MainLayout = () => {
  const { isDemoMode } = useDemoMode();
  
  return (
    <ContextAwareAIProvider>
      <VoiceProvider>
        {/* Global toast notifications */}
        <Toaster />
        <Sonner />
        
        {/* Main layout with demo mode adjustments */}
        <div className={isDemoMode ? 'pt-12' : ''}>
          {/* Universal Header */}
          <UniversalHeader />
          
          {/* Navigation */}
          <Navigation />
          
          {/* Main content area */}
          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>
        
        {/* Demo User Switcher - floats over content */}
        <DemoUserSwitcher />
      </VoiceProvider>
    </ContextAwareAIProvider>
  );
};