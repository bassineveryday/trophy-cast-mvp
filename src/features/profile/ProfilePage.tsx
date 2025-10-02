import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Fish, Target, Award, MapPin, MessageSquare, ArrowLeft, Calendar, Users, Home, Building, Star, TrendingUp } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { MEMBER_PROFILES } from "@/data/memberProfiles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BottomNavigation } from "@/components/BottomNavigation";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { role } = useDemoMode();
  const [activeTab, setActiveTab] = useState("overview");

  // Determine which profile to show
  const profileUsername = username || (role === "jake" ? "jake-wilson" : role === "president" ? "mike-johnson" : null);
  const profile = profileUsername ? MEMBER_PROFILES[profileUsername] : null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Profile not found</h2>
          <p className="text-muted-foreground mb-4">Enable demo mode or select a valid profile</p>
          <Button onClick={() => navigate("/")}>Go to Homepage</Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative bg-gradient-hero text-white px-4 py-6 overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-white hover:bg-white/20 z-10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="pt-12 text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(profile.name)}
          </div>
          <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
          <div className="flex items-center justify-center text-sm opacity-90 mb-2">
            <Home className="w-3 h-3 mr-1" />
            {profile.hometown}
          </div>
          <div className="text-xs opacity-75">Member since {profile.memberSince}</div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="tournaments" className="text-xs">Tournaments</TabsTrigger>
            <TabsTrigger value="catches" className="text-xs">Catches</TabsTrigger>
            <TabsTrigger value="following" className="text-xs">Following</TabsTrigger>
            <TabsTrigger value="trophies" className="text-xs">Trophies</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4">
            {/* Bio */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>
                
                {/* Clubs */}
                <div className="space-y-2">
                  {profile.clubs.map((club, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <Building className="w-4 h-4 text-primary" />
                      <span className="font-medium">{club.name}</span>
                      <Badge variant="outline" className="text-xs">{club.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Career Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-xl font-bold text-primary">{profile.stats.tournaments}</div>
                    <div className="text-xs text-muted-foreground">Tournaments</div>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-xl font-bold text-trophy-gold">{profile.stats.winRate}%</div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-xl font-bold text-fishing-green">{profile.stats.catches}</div>
                    <div className="text-xs text-muted-foreground">Catches</div>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-xl font-bold text-water-blue">{profile.stats.biggestBass} lbs</div>
                    <div className="text-xs text-muted-foreground">Biggest Bass</div>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-xl font-bold text-primary">#{profile.stats.rank}</div>
                    <div className="text-xs text-muted-foreground">Ranking</div>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-xl font-bold text-trophy-gold">{profile.stats.aoyPoints}</div>
                    <div className="text-xs text-muted-foreground">AOY Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trophy Room Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Trophy className="w-4 h-4 mr-2 text-trophy-gold" />
                    Trophy Collection
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/profile/trophy-room")}>
                    View Full Trophy Room
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {profile.trophies.slice(0, 6).map((trophy) => (
                    <div key={trophy.id} className="text-center p-3 bg-accent rounded-lg">
                      <Trophy className={`w-6 h-6 mx-auto mb-1 ${
                        trophy.placement === 1 ? 'text-trophy-gold' : 'text-primary'
                      }`} />
                      <div className="text-xs font-semibold line-clamp-2">{trophy.title}</div>
                      <div className="text-xs text-muted-foreground">{trophy.year}</div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  {profile.trophies.length} total trophies
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" disabled>
                <Users className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" className="flex-1" disabled>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </TabsContent>

          {/* TOURNAMENT HISTORY TAB */}
          <TabsContent value="tournaments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tournament History</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.tournamentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {profile.tournamentHistory.map((tournament) => (
                      <div key={tournament.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{tournament.name}</h4>
                          <Badge className={
                            tournament.placement === 1 ? 'bg-trophy-gold/20 text-trophy-gold' :
                            tournament.placement === 2 ? 'bg-gray-200 text-gray-700' :
                            tournament.placement === 3 ? 'bg-amber-100 text-amber-700' : ''
                          }>
                            {tournament.placement === 1 ? '🏆 1st' : 
                             tournament.placement === 2 ? '🥈 2nd' : 
                             tournament.placement === 3 ? '🥉 3rd' : `${tournament.placement}th`}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div><Calendar className="w-3 h-3 inline mr-1" />{tournament.date}</div>
                          <div><MapPin className="w-3 h-3 inline mr-1" />{tournament.location}</div>
                          <div><Fish className="w-3 h-3 inline mr-1" />{tournament.weightLbs} lbs, {tournament.fishCount} fish</div>
                          <div><Star className="w-3 h-3 inline mr-1" />{tournament.points} pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">No tournament history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATCH LOG TAB */}
          <TabsContent value="catches" className="space-y-4">
            {profile.catchLog.length > 0 ? (
              profile.catchLog.map((catchEntry) => (
                <Card key={catchEntry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{catchEntry.species}</h4>
                        <div className="text-xl font-bold text-fishing-green">
                          {catchEntry.weight} lbs <span className="text-sm text-muted-foreground">• {catchEntry.length}"</span>
                        </div>
                      </div>
                      <Badge variant="outline">{catchEntry.date}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs text-muted-foreground mb-3">
                      <div><MapPin className="w-3 h-3 inline mr-1" />{catchEntry.location} ({catchEntry.coords})</div>
                      <div><Calendar className="w-3 h-3 inline mr-1" />{catchEntry.time} • {catchEntry.weather}</div>
                      <div>💧 Water: {catchEntry.waterTemp}°F, {catchEntry.waterClarity}</div>
                      <div>🎣 {catchEntry.lure} ({catchEntry.lureColor})</div>
                      <div>🎯 Technique: {catchEntry.technique}</div>
                    </div>

                    {catchEntry.notes && (
                      <div className="text-sm italic border-l-2 border-primary pl-3 py-1">
                        "{catchEntry.notes}"
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Fish className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">No catch log available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* FOLLOWING TAB */}
          <TabsContent value="following" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Following ({profile.following.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.following.length > 0 ? (
                  profile.following.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {getInitials(person.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.club} • {person.role}</p>
                          <p className="text-xs text-muted-foreground">Since {person.followingSince}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {person.mutual && (
                          <Badge variant="secondary" className="text-xs">Mutual</Badge>
                        )}
                        <Button variant="outline" size="sm" disabled>Unfollow</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">Not following anyone yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TROPHIES TAB */}
          <TabsContent value="trophies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Trophy className="w-4 h-4 mr-2 text-trophy-gold" />
                    All Trophies & Achievements
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/profile/trophy-room")}>
                    Full Trophy Room
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {profile.trophies.slice(0, 8).map((trophy) => (
                    <div key={trophy.id} className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                      <Trophy className={`w-6 h-6 ${
                        trophy.placement === 1 ? 'text-trophy-gold' : 
                        trophy.category === 'award' ? 'text-primary' : 'text-fishing-green'
                      }`} />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{trophy.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {trophy.year} {trophy.placement && `• ${trophy.placement === 1 ? '1st' : trophy.placement === 2 ? '2nd' : trophy.placement === 3 ? '3rd' : `${trophy.placement}th`} Place`}
                        </p>
                      </div>
                      {trophy.icon && <span className="text-xl">{trophy.icon}</span>}
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <Button variant="outline" onClick={() => navigate("/profile/trophy-room")}>
                    View All {profile.trophies.length} Trophies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
