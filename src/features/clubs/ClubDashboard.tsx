import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Trophy,
  ChevronLeft,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Fish,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import alabamaLogo from "@/assets/alabama-bass-logo.png";
import { useDemoMode, DEMO_CLUB } from '@/contexts/DemoModeContext';
import { DemoClubBanner } from '@/components/demo/DemoClubBanner';

const ClubDashboard = () => {
  const { isDemoMode, currentDemoUser, getDemoClub } = useDemoMode();
  
  // Use demo club data if in demo mode
  const clubData = isDemoMode 
    ? { ...getDemoClub(), memberCount: 28 }
    : {
        name: "Alabama Bass Nation",
        memberCount: 2847,
        description: "Official State Chapter"
      };
  const upcomingTournaments = [
    {
      name: "Lake Guntersville Championship",
      date: "September 28, 2024",
      time: "6:00 AM",
      location: "Cathedral Caverns State Park",
      entryFee: "$200",
      prizePool: "$15,000",
      registered: 45,
      maxAnglers: 60
    },
    {
      name: "Wheeler Lake Open",
      date: "October 12, 2024", 
      time: "5:30 AM",
      location: "First Creek Launch",
      entryFee: "$175",
      prizePool: "$12,500",
      registered: 38,
      maxAnglers: 50
    }
  ];

  const recentResults = [
    {
      tournament: "Smith Lake Championship",
      date: "March 25, 2024",
      winner: "David Thompson",
      weight: "18.45 lbs",
      prize: "$3,500",
      yourPlace: "3rd",
      yourWeight: "17.33 lbs"
    },
    {
      tournament: "Coosa River Open",
      date: "March 10, 2024", 
      winner: "Sarah Martinez",
      weight: "16.89 lbs",
      prize: "$3,000",
      yourPlace: "8th",
      yourWeight: "14.22 lbs"
    }
  ];

  const topMembers = [
    { rank: 1, name: "Jake Patterson", points: 1847, avatar: "JP" },
    { rank: 2, name: "Maria Santos", points: 1723, avatar: "MS" },
    { rank: 3, name: "Tommy Lee", points: 1685, avatar: "TL" },
    { rank: 4, name: "David Thompson", points: 1598, avatar: "DT" },
    { rank: 5, name: "Sarah Martinez", points: 1543, avatar: "SM" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Add top padding if demo mode is active */}
      {isDemoMode && <div className="h-12" />}
      
      {/* Demo Club Banner */}
      {isDemoMode && <div className="p-4"><DemoClubBanner showOfficerTools={false} /></div>}
      {/* Header */}
      <div className="bg-gradient-to-r from-water-blue-dark to-fishing-green-dark text-white p-4">
        <div className="flex items-center mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold ml-2">Club Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <img src={alabamaLogo} alt="Alabama Bass Nation" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{clubData.name}</h2>
            <p className="text-sm opacity-90">{clubData.description}</p>
            <div className="flex items-center mt-1">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {clubData.memberCount} active members{isDemoMode ? " (Demo)" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="tournaments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="standings">AOY Leaderboard</TabsTrigger>
            <TabsTrigger value="members">Member Roster</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tournaments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-water-blue" />
                    Upcoming Tournaments
                  </div>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      Demo Data
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTournaments.map((tournament, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{tournament.name}</h3>
                      <Badge className="bg-success text-success-foreground">
                        Open
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{tournament.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{tournament.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{tournament.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{tournament.entryFee}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-4 text-sm">
                        <span>
                          <strong>{tournament.registered}</strong>/{tournament.maxAnglers} registered
                        </span>
                        <span className="text-success font-semibold">
                          Prize: {tournament.prizePool}
                        </span>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Register
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tournament Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">2024 Season Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-accent rounded-lg">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">Tournaments</div>
                  </div>
                  <div className="p-3 bg-accent rounded-lg">
                    <div className="text-2xl font-bold text-success">$285K</div>
                    <div className="text-sm text-muted-foreground">Total Prizes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="standings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                    AOY Leaderboard
                  </div>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      Demo Standings
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topMembers.map((member, index) => (
                  <div key={member.rank} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {member.rank <= 3 ? (
                          <Trophy className={`w-5 h-5 ${
                            member.rank === 1 ? 'text-trophy-gold' :
                            member.rank === 2 ? 'text-gray-400' : 'text-amber-600'
                          }`} />
                        ) : (
                          <span className="font-bold text-lg">{member.rank}</span>
                        )}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-sm font-bold">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-muted-foreground">Active Member</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{member.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center py-2">
                  <div className="text-sm text-muted-foreground">...</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg border border-primary">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className="font-bold text-lg">12</span>
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">
                        MJ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Mike Johnson (You)</p>
                      <p className="text-sm text-success flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Up 3 spots
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">1,247</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-water-blue" />
                    Member Roster Preview
                  </div>
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      Demo Members
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-sm font-bold">JP</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Jake Patterson</p>
                        <p className="text-sm text-muted-foreground">Chapter President</p>
                      </div>
                    </div>
                    <Badge className="bg-trophy-gold text-primary-foreground">#1 AOY</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-sm font-bold">MS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Maria Santos</p>
                        <p className="text-sm text-muted-foreground">Tournament Director</p>
                      </div>
                    </div>
                    <Badge variant="outline">#2 AOY</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-sm font-bold">TL</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Tommy Lee</p>
                        <p className="text-sm text-muted-foreground">Active Member</p>
                      </div>
                    </div>
                    <Badge variant="outline">#3 AOY</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-sm font-bold">DT</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">David Thompson</p>
                        <p className="text-sm text-muted-foreground">Active Member</p>
                      </div>
                    </div>
                    <Badge variant="outline">#4 AOY</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-accent rounded-lg border border-primary">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">JG</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">Jake the Grassroots Angler (You)</p>
                        <p className="text-sm text-success flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Active Member
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">#5 AOY</Badge>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    View All 2,847 Members
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClubDashboard;