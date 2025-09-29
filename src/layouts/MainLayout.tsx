import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-20">
        <Outlet />
      </main>
    </div>
  );
}