import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PrototypeLayoutProps {
  title?: string;
}

export default function PrototypeLayout({ title }: PrototypeLayoutProps) {
  const { enabled, role } = useDemoMode();

  const roleDisplay = enabled 
    ? (role === "jake" ? "Jake (Angler)" : "Club President") 
    : "Demo Off";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/prototype">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Link>
            </Button>
            {title && <h1 className="text-xl font-semibold">{title}</h1>}
          </div>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {roleDisplay}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}