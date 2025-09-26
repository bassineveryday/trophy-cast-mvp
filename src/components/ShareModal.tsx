import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Waves, TrendingUp, Anchor, X } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal = ({ isOpen, onClose }: ShareModalProps) => {
  const earnedBadges = [
    {
      name: 'First Keeper',
      icon: Anchor,
      color: 'bg-amber-600 text-white',
    },
    {
      name: 'Deep Water Bite',
      icon: Waves,
      color: 'bg-water-blue text-white',
    },
    {
      name: 'Pattern Change',
      icon: TrendingUp,
      color: 'bg-fishing-green text-white',
    },
    {
      name: 'Big Bass – Tournament Leader',
      icon: Trophy,
      color: 'bg-trophy-gold text-white',
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Share Trophy Case</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Share Preview */}
        <div className="bg-gradient-to-r from-water-blue-dark/80 to-fishing-green-dark/80 text-white p-4 rounded-lg">
          {/* Profile Header */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-12 h-12 border-2 border-trophy-gold">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-trophy-gold text-primary-foreground font-bold text-sm">JG</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold">Jake the Tournament Angler</h3>
              <p className="text-xs opacity-90">Tournament Warrior</p>
              <p className="text-xs text-trophy-gold">🏅 4 Badges Earned</p>
            </div>
          </div>

          {/* Badge Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {earnedBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div key={index} className="bg-white/10 rounded-lg p-2 text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${badge.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-medium">{badge.name}</p>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-center opacity-75">
            Auto-generated highlight • Trophy Cast App
          </p>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-4">
          Post to Facebook, Instagram, or Club Feed
        </p>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1" onClick={onClose}>
            Share Now
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};