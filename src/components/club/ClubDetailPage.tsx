import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Trophy, Calendar, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoModeContext";

const ClubDetailPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { role } = useDemoMode();

  // Mock club data based on clubId
  const getClubData = () => {
    if (clubId === "alabama-bass-chapter-12") {
      return {
        name: "Alabama Bass Chapter 12",
        description: "Competitive bass fishing club serving North Alabama. We host monthly tournaments and promote conservation of our local waterways.",
        location: "Huntsville, AL",
        memberCount: 23,
        upcomingTournaments: [
          { id: "1", name: "Fall Classic", date: "Oct 15, 2025", location: "Lake Guntersville", entries: 18 },
          { id: "2", name: "Alabama State Championship", date: "Oct 10, 2025", location: "Lake Guntersville", entries: 42 }
        ],
        members: [
          { id: "1", name: "Mike Johnson", role: "President", initials: "MJ" },
          { id: "2", name: "Tom Wilson", role: "Vice President", initials: "TW" },
          { id: "3", name: "Jake Wilson", role: "Member", initials: "JW" },
          { id: "4", name: "Sarah Martinez", role: "Secretary", initials: "SM" },
          { id: "5", name: "David Brown", role: "Member", initials: "DB" },
          { id: "6", name: "Chris Anderson", role: "Member", initials: "CA" },
          { id: "7", name: "Jennifer Lee", role: "Treasurer", initials: "JL" },
          { id: "8", name: "Robert Taylor", role: "Member", initials: "RT" }
        ]
      };
    }
    
    if (clubId === "tennessee-valley-anglers") {
      return {
        name: "Tennessee Valley Anglers",
        description: "Family-friendly fishing club focused on recreation and youth development. Join us for fun tournaments and community events.",
        location: "Huntsville, AL",
        memberCount: 28,
        upcomingTournaments: [
          { id: "1", name: "Tennessee Valley Open", date: "Oct 22, 2025", location: "Pickwick Lake", entries: 15 },
          { id: "2", name: "Fall Family Tournament", date: "Nov 5, 2025", location: "Wheeler Lake", entries: 22 }
        ],
        members: [
          { id: "1", name: "John Smith", role: "President", initials: "JS" },
          { id: "2", name: "Jake Wilson", role: "Member", initials: "JW" },
          { id: "3", name: "Mary Johnson", role: "Secretary", initials: "MJ" },
          { id: "4", name: "Paul Davis", role: "Member", initials: "PD" },
          { id: "5", name: "Lisa Brown", role: "Treasurer", initials: "LB" },
          { id: "6", name: "Kevin White", role: "Member", initials: "KW" },
          { id: "7", name: "Amy Garcia", role: "Vice President", initials: "AG" },
          { id: "8", name: "Dan Miller", role: "Member", initials: "DM" }
        ]
      };
    }

    // Default club
    return {
      name: "Bass Fishing Club",
      description: "Local bass fishing club",
      location: "Alabama",
      memberCount: 15,
      upcomingTournaments: [],
      members: []
    };
  };

  const club = getClubData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-hero text-white px-4 py-6 overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="pt-12 text-center">
          <h1 className="text-2xl font-bold mb-2">{club.name}</h1>
          <div className="flex items-center justify-center text-sm opacity-90">
            <MapPin className="w-4 h-4 mr-1" />
            {club.location}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{club.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-2xl font-bold text-primary">{club.memberCount}</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="text-2xl font-bold text-primary">{club.upcomingTournaments.length}</div>
                    <div className="text-xs text-muted-foreground">Upcoming Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                  Upcoming Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {club.upcomingTournaments.length > 0 ? (
                  club.upcomingTournaments.map((tournament) => (
                    <div key={tournament.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <h4 className="font-semibold">{tournament.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {tournament.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {tournament.location}
                      </div>
                      <Badge variant="outline" className="mt-2">{tournament.entries} entries</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming tournaments</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Club Members
                  </div>
                  <Badge>{club.memberCount} total</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {club.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {member.initials}
                      </div>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    {member.role === "President" && (
                      <Badge variant="secondary" className="text-xs">
                        <Trophy className="w-3 h-3 mr-1" />
                        President
                      </Badge>
                    )}
                    {member.role === "Vice President" && (
                      <Badge variant="outline" className="text-xs">Officer</Badge>
                    )}
                    {member.role === "Secretary" && (
                      <Badge variant="outline" className="text-xs">Officer</Badge>
                    )}
                    {member.role === "Treasurer" && (
                      <Badge variant="outline" className="text-xs">Officer</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                  Tournament Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {club.upcomingTournaments.length > 0 ? (
                  club.upcomingTournaments.map((tournament) => (
                    <div key={tournament.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{tournament.name}</h4>
                        <Badge variant="secondary">{tournament.entries} entries</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {tournament.date}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {tournament.location}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        View Details
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">No tournaments scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClubDetailPage;
