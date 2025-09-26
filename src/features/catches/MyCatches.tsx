import { Badge } from "@/components/ui/badge";
import { Fish, Scale, Ruler, Trophy, Anchor, Waves, TrendingUp, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UniversalAvatar from "@/components/UniversalAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCatches } from "@/data/mockData";
import { enhancedMockCatches } from "@/data/enhancedMockData";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";

const MyCatches = () => {
  // Use enhanced catch data that includes angler information  
  const catchesData = enhancedMockCatches;

  const totalCatches = catchesData.length + 38; // 42 total
  const totalWeight = catchesData.reduce((sum, catch_) => sum + catch_.weight, 0) + 178; // 198 total
  const averageSize = totalWeight / totalCatches;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Personal Best Highlight */}
      <Card className="bg-gradient-to-r from-trophy-gold/20 to-trophy-gold/10 border-trophy-gold/30 shadow-trophy">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-trophy-gold rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-trophy-gold-dark">Personal Best</h3>
              <p className="text-xl font-bold">7.1 lbs</p>
              <p className="text-sm text-muted-foreground">Lake Pueblo • May 2023</p>
              <p className="text-xs text-muted-foreground">Caught on Spinnerbait (Grass Edge)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Season Best Highlight */}
      <Card className="bg-gradient-to-r from-fishing-green/20 to-fishing-green/10 border-fishing-green/30 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-fishing-green rounded-full flex items-center justify-center">
              <Fish className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-fishing-green-dark">2025 Season Best</h3>
              <p className="text-xl font-bold">6.2 lbs</p>
              <p className="text-sm text-muted-foreground">Lake Guntersville • Tournament</p>
              <p className="text-xs text-muted-foreground">Deep Diving Crankbait (Main Lake Ledge)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Fish className="w-6 h-6 mx-auto mb-2 text-fishing-green" />
            <div className="text-xl font-bold">{totalCatches}</div>
            <div className="text-xs text-muted-foreground">Total Catches</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Scale className="w-6 h-6 mx-auto mb-2 text-water-blue" />
            <div className="text-xl font-bold">{totalWeight} lbs</div>
            <div className="text-xs text-muted-foreground">Total Weight</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Ruler className="w-6 h-6 mx-auto mb-2 text-trophy-gold" />
            <div className="text-xl font-bold">{averageSize.toFixed(1)} lbs</div>
            <div className="text-xs text-muted-foreground">Average Size</div>
          </CardContent>
        </Card>
      </div>

      {/* Catches List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Catches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {catchesData.map((catch_) => {
              const BadgeIcon = catch_.badge.icon;
              return (
                <div key={catch_.id} className="flex items-center space-x-4 p-3 bg-card rounded-lg border hover:shadow-md transition-shadow">
                  {/* Thumbnail placeholder */}
                  <div className="w-16 h-16 bg-water-blue/20 rounded-lg flex items-center justify-center">
                    <Fish className="w-8 h-8 text-water-blue" />
                  </div>
                  
                  {/* Catch Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-lg">{catch_.weight} lbs</p>
                      <Badge className={`${catch_.badge.color} text-white text-xs px-2 py-1`}>
                        <BadgeIcon className="w-3 h-3 mr-1" />
                        {catch_.badge.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{catch_.lure}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        {catch_.anglerId && catch_.anglerName && (
                        <UniversalAvatar
                          size="row"
                          name={catch_.anglerName}
                          anglerId={catch_.anglerId}
                          role="Tournament Angler"
                          club={{
                            id: "unknown",
                            abbreviation: "UNK"
                          }}
                          clickable={true}
                        />
                        )}
                        <p className="text-xs text-muted-foreground">{catch_.lake}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground">{catch_.time}</p>
                        {catch_.anglerId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/messages/new?to=${catch_.anglerId}&lake=${encodeURIComponent(catch_.lake)}`;
                            }}
                            aria-label={`Message ${catch_.anglerName}`}
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
};

export default MyCatches;