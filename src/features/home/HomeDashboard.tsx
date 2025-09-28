import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

// Import existing components
import Homepage from "./Homepage";
import Dashboard from "./Dashboard";

const HomeDashboard = () => {
  // Feature flags for different views
  const [useClassicDashboard, setUseClassicDashboard] = useState(false);
  const [showFeatureToggle, setShowFeatureToggle] = useState(false);

  // Feature-flagged rendering
  if (useClassicDashboard) {
    return (
      <div className="relative">
        {/* Feature Toggle - Development/Admin Only */}
        {showFeatureToggle && (
          <div className="fixed top-4 right-4 z-50 bg-background border rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Dashboard Mode</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">Rich</span>
              <Switch 
                checked={useClassicDashboard} 
                onCheckedChange={setUseClassicDashboard}
              />
              <span className="text-xs">Classic</span>
            </div>
          </div>
        )}
        
        {/* Classic Dashboard View */}
        <Dashboard />
      </div>
    );
  }

  // Default: Rich Homepage Experience
  return (
    <div className="relative">
      {/* Feature Toggle - Development/Admin Only */}
      {showFeatureToggle && (
        <div className="fixed top-4 right-4 z-50 bg-background border rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard Mode</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">Rich</span>
            <Switch 
              checked={useClassicDashboard} 
              onCheckedChange={setUseClassicDashboard}
            />
            <span className="text-xs">Classic</span>
          </div>
        </div>
      )}

      {/* Rich Homepage Experience */}
      <Homepage />
      
      {/* Optional: Show toggle in development */}
      {process.env.NODE_ENV === 'development' && (
        <Button
          variant="ghost" 
          size="sm"
          className="fixed bottom-4 left-4 z-40 opacity-30 hover:opacity-100"
          onClick={() => setShowFeatureToggle(!showFeatureToggle)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      )}
      feat(home): add Quick Actions (voice log, leaderboard, fish room)
    </div>
  );
};

export default HomeDashboard;
