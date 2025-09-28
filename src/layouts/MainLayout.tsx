import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ContextAwareAIProvider } from "@/contexts/ContextAwareAIContext";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { Navigation } from "@/components/Navigation";
import { BottomNavigation } from "@/components/BottomNavigation";
import DemoSwitcher from "@/components/DemoSwitcher";
import BackButton from "@/components/BackButton";


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
        
        {/* Navigation */}
        <Navigation />
        <BackButton />
        
        {/* Main content area */}
        <main className="min-h-screen pb-16">
          <Outlet />
        </main>
        
        
        <DemoSwitcher />
      </VoiceProvider>
    </ContextAwareAIProvider>
  );
};