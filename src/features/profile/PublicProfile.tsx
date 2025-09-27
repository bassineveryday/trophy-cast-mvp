import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Trophy, 
  Fish, 
  Target,
  Award,
  Star,
  Share,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  MessageSquare,
  Activity,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { mockPublicProfiles } from "@/data/enhancedMockData";
import { useToast } from "@/hooks/use-toast";
import ProfileMessages from "./ProfileMessages";
import ProfileActivity from "./ProfileActivity";

const PublicProfile = () => {
  const { anglerId } = useParams<{ anglerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const activeTab = searchParams.get('tab') || 'overview';

  // Generate initials from name - consistent with UniversalAvatar
  const getInitials = (fullName: string) => {
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const angler = anglerId ? mockPublicProfiles[anglerId as keyof typeof mockPublicProfiles] : null;

  // ✅ Redirect fix: only redirect for truly invalid IDs, add debug logging
  useEffect(() => {
    console.log('PublicProfile Debug:', { anglerId, angler: !!angler });
    
    // Only redirect if we have an anglerId that definitely doesn't exist in our data
    if (anglerId && !angler && !['jake-patterson', 'maria-santos', 'tommy-lee', 'mike-johnson', 'chris-wilson', 'sarah-johnson', 'mike-rodriguez'].includes(anglerId)) {
      console.log('Redirecting invalid anglerId:', anglerId);
      navigate("/profile", { replace: true });
    }
  }, [anglerId, angler, navigate]);

  // Optional: show a tiny placeholder while params resolve (prevents weird flashes)
  if (!anglerId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  // While the redirect effect runs, render nothing to avoid the flash
  if (!angler) {
    return null;
  }

  // Handle following state
  useEffect(() => {
    if (anglerId && angler) {
      // Check if we're following this angler (mock - would be from API/state) 
      const followedAnglers = JSON.parse(sessionStorage.getItem('followedAnglers') || '[]');
      setIsFollowing(followedAnglers.includes(anglerId));
    }
  }, [anglerId, angler]);

  const handleFollowToggle = () => {
    const followedAnglers = JSON.parse(sessionStorage.getItem('followedAnglers') || '[]');
    
    if (isFollowing) {
      const updated = followedAnglers.filter((id: string) => id !== anglerId);
      sessionStorage.setItem('followedAnglers', JSON.stringify(updated));
      setIsFollowing(false);
      toast({
        title: `Unfollowed ${angler.name}`,
        description: "You will no longer see updates from this angler"
      });
    } else {
      const updated = [...followedAnglers, anglerId];
      sessionStorage.setItem('followedAnglers', JSON.stringify(updated));
      setIsFollowing(true);
      toast({
        title: `You're now following ${angler.name}`,
        description: "You'll see their latest catches and tournament results"
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Demo only",
      description: "Profile sharing coming soon"
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-fishing-green" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="bg-gradient-hero text-white px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Angler Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarImage src={angler.avatar} alt={`Avatar — ${angler.name}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {getInitials(angler.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">{angler.name}</h1>
                  {angler.titleLine && (
                    <div className="profile-titleLine text-sm font-medium text-primary mb-1">{angler.titleLine}</div>
                  )}
                  <p className="text-sm text-muted-foreground mb-1">{angler.homeClub}</p>
                  <p className="text-sm text-muted-foreground mb-3">{angler.location}</p>
                  
                  {/* Achievement Plaques - Compact Design */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                     <div 
                       className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 border border-yellow-500/30 rounded-lg p-2 text-center cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 backdrop-blur-sm"
                       onClick={() => toast({
                         title: "Tournament Wins",
                         description: `View all ${angler.stats.wins} tournament victories (demo)`
                       })}
                     >
                       <div className="text-lg font-bold text-yellow-600 mb-0.5">🥇</div>
                       <div className="text-base font-semibold text-yellow-700">{angler.stats.wins}</div>
                       <div className="text-[10px] text-yellow-600/80 font-medium leading-tight">Tournament Wins</div>
                     </div>
                     
                     <div 
                       className="bg-gradient-to-br from-emerald-400/20 to-emerald-600/30 border border-emerald-500/30 rounded-lg p-2 text-center cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
                       onClick={() => toast({
                         title: "Top 10 Finishes", 
                         description: `View all ${angler.stats.top10} top 10 results (demo)`
                       })}
                     >
                       <div className="text-lg font-bold text-emerald-600 mb-0.5">⭐</div>
                       <div className="text-base font-semibold text-emerald-700">{angler.stats.top10}</div>
                       <div className="text-[10px] text-emerald-600/80 font-medium leading-tight">Top 10 Finishes</div>
                     </div>
                     
                     <div 
                       className="bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-500/30 rounded-lg p-2 text-center cursor-pointer hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 backdrop-blur-sm"
                       onClick={() => toast({
                         title: "AOY Timeline",
                         description: `View ${angler.stats.aoyTitles} AOY championship timeline (demo)`
                       })}
                     >
                       <div className="text-lg font-bold text-amber-600 mb-0.5">🏆</div>
                       <div className="text-base font-semibold text-amber-700">{angler.stats.aoyTitles}</div>
                       <div className="text-[10px] text-amber-600/80 font-medium leading-tight">AOY Titles</div>
                     </div>
                    
                     <div 
                      className="bg-gradient-to-br from-blue-400/20 to-blue-600/30 border border-blue-500/30 rounded-lg p-2 text-center cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      onClick={() => navigate(`/tournament/lake-guntersville-sept/catch/catch-1`)}
                      aria-label={`Open catch detail for ${angler.stats.pbWeight} personal best bass`}
                    >
                      <div className="text-lg font-bold text-blue-600 mb-0.5">🎣</div>
                      <div className="text-base font-semibold text-blue-700">{angler.stats.pbWeight}</div>
                      <div className="text-[10px] text-blue-600/80 font-medium leading-tight">Big Bass (PB)</div>
                    </div>
                  </div>
                  
                  {/* Club Mini Plaques - Compact */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {angler.stats.aoyTitles > 0 && (
                      <div 
                        className="bg-gradient-to-r from-yellow-400/15 to-yellow-500/20 border border-yellow-500/25 rounded-full px-2 py-1 cursor-pointer hover:shadow-md hover:shadow-yellow-500/15 transition-all duration-200"
                        onClick={() => toast({
                          title: "2023 Club Champion",
                          description: `View ${angler.homeClub} championship details (demo)`
                        })}
                      >
                        <span className="text-[10px] font-semibold text-yellow-700">🏆 2023 Club Champion</span>
                      </div>
                    )}
                    <div 
                      className="bg-gradient-to-r from-gray-400/15 to-gray-500/20 border border-gray-500/25 rounded-full px-2 py-1 cursor-pointer hover:shadow-md hover:shadow-gray-500/15 transition-all duration-200"
                      onClick={() => toast({
                        title: "Member Since 2019",  
                        description: `${angler.homeClub} member details (demo)`
                      })}
                    >
                      <span className="text-[10px] font-semibold text-gray-700">Member Since 2019</span>
                    </div>
                  </div>

                   {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleFollowToggle}
                        className={isFollowing 
                          ? "bg-muted text-muted-foreground hover:bg-muted/80" 
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => navigate(`/messages/new?to=${anglerId}`)}
                        aria-label={`Message ${angler.name}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => toast({
                          title: "Share Profile",
                          description: "Profile sharing coming soon (demo)"
                        })}
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>


        {/* Profile Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            const newSearchParams = new URLSearchParams(searchParams);
            if (value === 'overview') {
              newSearchParams.delete('tab');
            } else {
              newSearchParams.set('tab', value);
            }
            setSearchParams(newSearchParams);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">

            {/* Season Snapshot - By Club */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <h3 className="text-base font-semibold">2024 Season Snapshot</h3>
              </div>
              
              {/* Club-specific cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {angler.clubSeasonSnapshots && Object.entries(angler.clubSeasonSnapshots).map(([clubId, clubData]) => (
                  <Card key={clubId} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                          <img 
                            src={clubData.clubLogo} 
                            alt={`${clubData.clubAcronym} logo`}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{clubData.clubAcronym}</h4>
                          <p className="text-xs text-muted-foreground">{clubData.clubName}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* 2x2 Stat Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className="text-center p-2 bg-gradient-to-br from-fishing-green/10 to-fishing-green/5 rounded-md border border-fishing-green/20 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => toast({
                            title: `${clubData.clubAcronym} Tournaments`,
                            description: `View tournament history for ${clubData.clubName} (demo)`
                          })}
                        >
                          <p className="text-lg font-bold text-fishing-green">{clubData.tournamentsFished}</p>
                          <p className="text-[10px] text-muted-foreground">🎣 Tournaments</p>
                        </div>
                        <div 
                          className="text-center p-2 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-md border border-emerald-500/20 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => toast({
                            title: `${clubData.clubAcronym} Top 10s`,
                            description: `View ${clubData.top10Finishes} top 10 finishes (demo)`
                          })}
                        >
                          <p className="text-lg font-bold text-emerald-600">{clubData.top10Finishes}</p>
                          <p className="text-[10px] text-muted-foreground">⭐ Top 10s</p>
                          <p className="text-[8px] text-emerald-600/70">
                            {Math.round((clubData.top10Finishes / clubData.tournamentsFished) * 100)}%
                          </p>
                        </div>
                        <div 
                          className="text-center p-2 bg-gradient-to-br from-trophy-gold/10 to-trophy-gold/5 rounded-md border border-trophy-gold/20 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => toast({
                            title: `${clubData.clubAcronym} AOY Standing`,
                            description: `View AOY timeline for ${clubData.clubName} (demo)`
                          })}
                        >
                          <p className="text-sm font-bold text-trophy-gold">{clubData.aoyPosition}</p>
                          <p className="text-[10px] text-muted-foreground">🏆 AOY Standing</p>
                        </div>
                        <div 
                          className="text-center p-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-md border border-blue-500/20 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => toast({
                            title: "Points Gap",
                            description: `${clubData.aoyDelta} in ${clubData.clubName} standings`
                          })}
                        >
                          <p className="text-xs font-bold text-blue-600">{clubData.aoyDelta}</p>
                          <p className="text-[10px] text-muted-foreground">📊 Points Gap</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Career Rollup Strip */}
              <Card className="bg-gradient-to-r from-accent/30 to-accent/10 border-accent/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Award className="w-4 h-4 mr-2 text-primary" />
                    Career Rollup — All Clubs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div 
                      className="text-center p-2 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg border border-primary/25 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => toast({
                        title: "Tournament History",
                        description: `View all ${angler.seasonSnapshot.tournamentsFished} tournaments fished this season (demo)`
                      })}
                    >
                      <p className="text-lg font-bold text-primary">{angler.seasonSnapshot.tournamentsFished}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Total Tournaments</p>
                    </div>
                    <div 
                      className="text-center p-2 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 rounded-lg border border-emerald-500/25 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => toast({
                        title: "Top 10 Finishes",
                        description: `View all ${angler.seasonSnapshot.top10Finishes} top 10 results this season (demo)`
                      })}
                    >
                      <p className="text-lg font-bold text-emerald-600">{angler.seasonSnapshot.top10Finishes}</p>
                      <p className="text-[10px] text-emerald-700/80 font-medium">Total Top 10s</p>
                    </div>
                    <div 
                      className="text-center p-2 bg-gradient-to-br from-trophy-gold/15 to-trophy-gold/5 rounded-lg border border-trophy-gold/25 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => toast({
                        title: "AOY Championships",
                        description: `View ${angler.stats.aoyTitles} career AOY championship timeline (demo)`
                      })}
                    >
                      <p className="text-lg font-bold text-trophy-gold">{angler.stats.aoyTitles}</p>
                      <p className="text-[10px] text-trophy-gold/80 font-medium">Career AOY Titles</p>
                    </div>
                    <div 
                      className="text-center p-2 bg-gradient-to-br from-water-blue/15 to-water-blue/5 rounded-lg border border-water-blue/25 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/tournament/lake-guntersville-sept/catch/catch-1`)}
                      aria-label={`Open catch detail for ${angler.stats.pbWeight} personal best bass`}
                    >
                      <p className="text-lg font-bold text-water-blue">{angler.stats.pbWeight}</p>
                      <p className="text-[10px] text-water-blue/80 font-medium">Big Bass PB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Highlights Carousel */}
            {angler.highlights && angler.highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-primary" />
                    Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-hidden">
                    <div className="flex space-x-4 animate-fade-in">
                      {angler.highlights.slice(0, 3).map((highlight, index) => (
                        <div 
                          key={highlight.id}
                          className="min-w-0 flex-1 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-4 border border-accent/30 cursor-pointer hover:shadow-lg transition-all duration-300"
                          onClick={() => {
                            if (highlight.type === "biggest-bass") {
                              navigate(`/tournament/lake-guntersville-sept/catch/catch-1`);
                            } else {
                              toast({
                                title: highlight.title,
                                description: `${highlight.description} • ${highlight.stats}`
                              });
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              {highlight.type === "biggest-bass" && <Fish className="w-6 h-6 text-water-blue" />}
                              {highlight.type === "tournament-win" && <Trophy className="w-6 h-6 text-trophy-gold" />}
                              {highlight.type === "aoy-standing" && <Award className="w-6 h-6 text-primary" />}
                              {highlight.type === "club-highlight" && <Star className="w-6 h-6 text-fishing-green" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-sm mb-1">{highlight.title}</h4>
                              <p className="text-xs text-muted-foreground mb-1">{highlight.description}</p>
                              <p className="text-xs text-primary font-medium">{highlight.stats}</p>
                              <p className="text-xs text-muted-foreground mt-1">{highlight.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Catches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Fish className="w-5 h-5 mr-2 text-fishing-green" />
                    Recent Catches
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: "Demo only",
                      description: "Full catch history coming soon"
                    })}
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 {angler.recentCatches.map((catch_, index) => (
                   <div 
                     key={index} 
                     className="flex items-center space-x-3 p-3 bg-accent rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => navigate(`/tournament/lake-guntersville-sept/catch/catch-${index + 1}`)}
                   >
                     <div className="w-12 h-12 bg-water-blue/10 rounded-lg flex items-center justify-center">
                       <Fish className="w-6 h-6 text-water-blue" />
                     </div>
                     <div className="flex-1">
                       <p className="font-medium">{catch_.lake}</p>
                       <p className="text-sm text-muted-foreground">
                         {catch_.weight} • {catch_.length} • {catch_.date}
                       </p>
                     </div>
                   </div>
                 ))}
              </CardContent>
            </Card>

            {/* Clubs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary" />
                  Clubs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {angler.clubs.map((clubId) => {
                    const clubDetail = angler.clubDetails?.[clubId];
                    return (
                      <div
                        key={clubId}
                        className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg border border-accent/30 cursor-pointer hover:shadow-md hover:bg-accent/30 transition-all duration-200"
                        onClick={() => toast({
                          title: clubDetail?.name || clubId,
                          description: "Club profile coming soon (demo)"
                        })}
                      >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-accent/40">
                          <img 
                            src={clubDetail?.logo || "/placeholder.svg"} 
                            alt={`${clubDetail?.acronym || clubId} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{clubDetail?.acronym || clubId.toUpperCase()}</h4>
                          <p className="text-xs text-muted-foreground">
                            {clubDetail?.name || clubId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <ProfileMessages anglerId={anglerId} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <ProfileActivity angler={angler} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicProfile;