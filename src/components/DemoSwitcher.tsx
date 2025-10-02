import React, { useCallback } from "react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Check, ChevronDown, User, Fish, Users, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function goHomeWithDemo(value: string | null) {
  const url = new URL(window.location.origin + "/");
  if (value === null) url.searchParams.delete("demo");
  else url.searchParams.set("demo", value);
  // Push new URL and notify listeners
  window.history.pushState({}, "", url.toString());
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function DemoSwitcher() {
  const { enabled, role } = useDemoMode();
  
  const setOff = useCallback(() => {
    goHomeWithDemo(null);
  }, []);
  
  const setJake = useCallback(() => {
    goHomeWithDemo("jake");
  }, []);
  
  const setPres = useCallback(() => {
    goHomeWithDemo("president");
  }, []);

  // Display label based on current mode
  const displayLabel = !enabled 
    ? "Your Profile" 
    : role === "jake" 
    ? "Viewing as: Jake" 
    : "Viewing as: President";

  return (
    <>
      {/* Demo Mode Banner - only shown when in demo mode */}
      {enabled && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b-2 border-yellow-400 h-10 flex items-center justify-center cursor-pointer hover:bg-yellow-100 transition-colors"
          onClick={setOff}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setOff()}
        >
          <p className="text-sm font-medium text-yellow-900 flex items-center gap-2">
            <span>👁️</span>
            <span className="hidden sm:inline">
              Viewing as {role === "jake" ? "Jake" : "President"} (Demo Mode)
            </span>
            <span className="sm:hidden">
              Demo: {role === "jake" ? "Jake" : "President"}
            </span>
            <span className="hidden sm:inline">- Click to return to Your Profile</span>
            <span className="sm:hidden">- Tap to exit</span>
          </p>
        </div>
      )}

      {/* Profile Switcher Dropdown - embedded only */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-background border-border hover:bg-accent min-w-[140px] sm:min-w-[180px]"
          >
              <User className="h-4 w-4 mr-2" />
              <span className="text-xs sm:text-sm">{displayLabel}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[200px] sm:w-[240px] bg-background/95 backdrop-blur-sm border-border shadow-lg"
          >
            <DropdownMenuItem 
              onClick={setOff}
              className="cursor-pointer hover:bg-accent"
            >
              <User className="h-4 w-4 mr-2" />
              <span className="flex-1">Your Profile</span>
              {!enabled && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={setJake}
              className="cursor-pointer hover:bg-accent"
            >
              <Fish className="h-4 w-4 mr-2" />
              <span className="flex-1">Jake (Active Angler Demo)</span>
              {role === "jake" && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={setPres}
              className="cursor-pointer hover:bg-accent"
            >
              <Users className="h-4 w-4 mr-2" />
              <span className="flex-1">President (Club Admin Demo)</span>
              {role === "president" && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => window.location.href = '/settings'}
              className="cursor-pointer hover:bg-accent"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="flex-1">Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => window.location.href = '/auth'}
              className="cursor-pointer hover:bg-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="flex-1">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
