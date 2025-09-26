import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Waves, TrendingUp, Anchor, Lock, Award, Target, Fish, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareModal } from "@/components/ShareModal";
import { useState } from "react";

const BadgeCollection = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  
  const earnedBadges = [
    {
      id: 'first-keeper',
      name: 'First Keeper',
      icon: Anchor,
      color: 'bg-amber-600 text-white',
      description: 'Your first keeper of the tournament',
      earned: true
    },
    {
      id: 'deep-water',
      name: 'Deep Water Bite',
      icon: Waves,
      color: 'bg-water-blue text-white',
      description: 'Mastered deep water fishing',
      earned: true
    },
    {
      id: 'pattern-change',
      name: 'Pattern Change',
      icon: TrendingUp,
      color: 'bg-fishing-green text-white',
      description: 'Adapted tactics to changing conditions',
      earned: true
    },
    {
      id: 'big-bass',
      name: 'Big Bass – Tournament Leader',
      icon: Trophy,
      color: 'bg-trophy-gold text-white',
      description: 'Caught the biggest bass of the tournament',
      earned: true
    }
  ];

  const lockedBadges = [
    {
      id: 'limit-out',
      name: 'Limit Out',
      icon: Award,
      description: 'Catch a full 5-fish limit',
      earned: false
    },
    {
      id: 'double-digit',
      name: 'Double Digit Day',
      icon: Target,
      description: 'Catch 10+ bass in one tournament',
      earned: false
    },
    {
      id: 'back-to-back',
      name: 'Back-to-Back Winner',
      icon: Fish,
      description: 'Win consecutive tournaments',
      earned: false
    }
  ];

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
          🏅 Jake's Badge Collection
        </h1>
        <p className="text-sm opacity-90">Tournament achievements & milestones</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Earned Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
              Earned Badges ({earnedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {earnedBadges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div key={badge.id} className="bg-card rounded-lg p-4 border shadow-sm">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Locked Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2 text-muted-foreground" />
              Locked Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {lockedBadges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div key={badge.id} className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center relative">
                        <IconComponent className="w-6 h-6 text-muted-foreground" />
                        <Lock className="w-3 h-3 absolute -top-1 -right-1 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-muted-foreground">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tournament Badges</span>
                <span className="text-sm text-muted-foreground">4/7 earned</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-trophy-gold h-2 rounded-full" style={{ width: '57%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Keep fishing to unlock more achievements!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Share Button */}
        <div className="mt-6">
          <Button 
            className="w-full bg-trophy-gold hover:bg-trophy-gold-dark text-white font-bold"
            onClick={() => setShowShareModal(true)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share My Trophy Case
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