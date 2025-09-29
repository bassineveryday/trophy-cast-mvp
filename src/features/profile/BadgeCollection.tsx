import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Waves, TrendingUp, Anchor, Lock, Award, Target, Fish, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareModal } from "@/components/ShareModal";
import { useState } from "react";

const BadgeCollection = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Empty state for badges
  const earnedBadges: any[] = [];
  const lockedBadges: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-water-blue-dark/80 to-fishing-green-dark/80 text-white p-4">
        <div className="flex items-center mb-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mr-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-xl font-bold flex items-center">
          🏅 Badge Collection
        </h1>
        <p className="text-sm opacity-90">Tournament achievements & milestones</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Empty State for Badges */}
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-medium mb-2">No badges earned yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Participate in tournaments and achieve milestones to start earning badges and building your trophy case.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/tournaments">
                <Button variant="outline" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Join Tournament
                </Button>
              </Link>
              <Link to="/my-catches">
                <Button variant="outline" className="w-full">
                  <Fish className="w-4 h-4 mr-2" />  
                  Log Catches
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Share Button - Disabled for empty state */}
        <div className="mt-6">
          <Button 
            className="w-full"
            variant="outline"
            disabled
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Trophy Case
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
      />
    </div>
  );
};

export default BadgeCollection;