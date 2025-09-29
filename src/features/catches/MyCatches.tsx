import { Badge } from "@/components/ui/badge";
import { Fish, Scale, Ruler, Trophy, Anchor, Waves, TrendingUp, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UniversalAvatar from "@/components/UniversalAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";

const MyCatches = () => {
  // Empty state for catches data
  const catchesData: any[] = [];

  const totalCatches = 0;
  const totalWeight = 0;
  const averageSize = 0;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Empty State for Catches */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardContent className="p-8 text-center">
          <Fish className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-medium mb-2">No catches yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start logging your catches to track your fishing progress and share with fellow anglers.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/catches/log">
              <Button variant="outline" className="w-full">
                <Fish className="w-4 h-4 mr-2" />
                Log Catch
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button variant="outline" className="w-full">
                <Trophy className="w-4 h-4 mr-2" />
                Join Tournament
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
};

export default MyCatches;