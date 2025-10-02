import { Outlet, useLocation } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";

export function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-20">
        <Outlet />
      </main>
      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}