import { Outlet } from "react-router-dom";
import { ContextAwareAIProvider } from "@/contexts/ContextAwareAIContext";

export function MainLayout() {
  return (
    <ContextAwareAIProvider>
      <div className="min-h-screen bg-background text-foreground">
        <main className="pb-20">
          <Outlet />
        </main>
      </div>
    </ContextAwareAIProvider>
  );
}