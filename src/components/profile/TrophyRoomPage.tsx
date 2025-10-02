import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, Star, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { MEMBER_PROFILES } from "@/data/memberProfiles";

const TrophyRoomPage = () => {
  const navigate = useNavigate();
  const { role } = useDemoMode();
  const [filter, setFilter] = useState<'all' | 'tournament' | 'award' | 'badge'>('all');

  // Get profile based on demo role
  const username = role === "jake" ? "jake-wilson" : role === "president" ? "mike-johnson" : null;
  const profile = username ? MEMBER_PROFILES[username] : null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-xl font-bold mb-2">Trophy Room</h2>
          <p className="text-muted-foreground mb-4">Enable demo mode to view trophy rooms</p>
          <Button onClick={() => navigate("/")}>Go to Homepage</Button>
        </div>
      </div>
    );
  }

  const filteredTrophies = filter === 'all' 
    ? profile.trophies 
    : profile.trophies.filter(t => t.category === filter);

  const getTrophyColor = (placement?: number) => {
    if (placement === 1) return 'text-trophy-gold';
    if (placement === 2) return 'text-gray-400';
    if (placement === 3) return 'text-amber-700';
    return 'text-primary';
  };

  const getTrophyBg = (placement?: number) => {
    if (placement === 1) return 'bg-trophy-gold/10 border-trophy-gold/30';
    if (placement === 2) return 'bg-gray-100 border-gray-300';
    if (placement === 3) return 'bg-amber-50 border-amber-300';
    return 'bg-primary/5 border-primary/20';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-hero text-white px-4 py-6 overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="pt-12 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-3 text-trophy-gold" />
          <h1 className="text-2xl font-bold mb-2">Trophy Room</h1>
          <p className="text-sm opacity-90">{profile.name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Stats Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-trophy-gold">{profile.trophies.length}</div>
                <div className="text-xs text-muted-foreground">Total Trophies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile.trophies.filter(t => t.placement === 1).length}
                </div>
                <div className="text-xs text-muted-foreground">Championships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-fishing-green">
                  {profile.trophies.filter(t => t.category === 'badge').length}
                </div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({profile.trophies.length})</TabsTrigger>
            <TabsTrigger value="tournament">
              Tournaments ({profile.trophies.filter(t => t.category === 'tournament').length})
            </TabsTrigger>
            <TabsTrigger value="award">
              Awards ({profile.trophies.filter(t => t.category === 'award').length})
            </TabsTrigger>
            <TabsTrigger value="badge">
              Badges ({profile.trophies.filter(t => t.category === 'badge').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Trophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrophies.map((trophy) => (
            <Card 
              key={trophy.id} 
              className={`relative overflow-hidden transition-all hover:shadow-lg ${getTrophyBg(trophy.placement)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Trophy Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    trophy.placement === 1 
                      ? 'bg-trophy-gold/20' 
                      : trophy.category === 'award'
                      ? 'bg-primary/20'
                      : 'bg-fishing-green/20'
                  }`}>
                    {trophy.placement === 1 ? (
                      <div className="relative">
                        <Trophy className={`w-6 h-6 ${getTrophyColor(trophy.placement)}`} />
                        {trophy.icon === '🏆' && (
                          <Sparkles className="w-3 h-3 text-trophy-gold absolute -top-1 -right-1 animate-pulse" />
                        )}
                      </div>
                    ) : trophy.category === 'award' ? (
                      <Award className={`w-6 h-6 ${getTrophyColor()}`} />
                    ) : trophy.placement ? (
                      <Trophy className={`w-6 h-6 ${getTrophyColor(trophy.placement)}`} />
                    ) : (
                      <Star className={`w-6 h-6 text-fishing-green`} />
                    )}
                  </div>

                  {/* Trophy Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm leading-tight">{trophy.title}</h3>
                      {trophy.icon && trophy.icon !== '🏆' && (
                        <span className="text-lg ml-2">{trophy.icon}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {trophy.year}
                      </Badge>
                      {trophy.placement && (
                        <Badge className={`text-xs ${
                          trophy.placement === 1 
                            ? 'bg-trophy-gold/20 text-trophy-gold border-trophy-gold' 
                            : trophy.placement === 2
                            ? 'bg-gray-200 text-gray-700 border-gray-400'
                            : 'bg-amber-100 text-amber-700 border-amber-400'
                        }`}>
                          {trophy.placement === 1 ? '1st Place' : 
                           trophy.placement === 2 ? '2nd Place' : 
                           trophy.placement === 3 ? '3rd Place' : `${trophy.placement}th Place`}
                        </Badge>
                      )}
                    </div>

                    {trophy.description && (
                      <p className="text-xs text-muted-foreground">{trophy.description}</p>
                    )}
                  </div>
                </div>

                {/* Sparkle effect for gold trophies */}
                {trophy.placement === 1 && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-4 h-4 text-trophy-gold animate-pulse" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrophies.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No trophies in this category yet</p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate("/profile")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrophyRoomPage;
