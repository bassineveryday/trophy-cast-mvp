import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Users, Cloud, Sun, CloudRain, Wind, Trophy, Brain, AlertTriangle, Eye } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
import { UniversalHeader } from "@/components/UniversalHeader";
import { mockOfficerNotes } from "@/data/mockMessages";
import OfficerNote from "@/components/OfficerNote";
import { useToast } from "@/hooks/use-toast";

const TournamentDetail = () => {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const { toast } = useToast();
  
  // Mock tournament data - in real app this would come from API
  const tournaments = {
    'lake-guntersville': {
      name: 'Lake Guntersville',
      club: 'Alabama Bass Nation – Chapter 12',
      date: 'September 28, 2024',
      startTime: '6:00 AM',
      weighInTime: '3:00 PM',
      entryFee: '$100',
      registered: true,
      daysAway: 6,
      location: 'Honeycomb Creek Launch',
      clubColor: 'fishing-green',
      forecast: [
        { day: 'Fri', icon: Sun, high: 74, low: 58, wind: 'W 8mph' },
        { day: 'Sat', icon: Cloud, high: 72, low: 60, wind: 'W 10mph' },
        { day: 'Sun', icon: CloudRain, high: 68, low: 55, wind: 'NW 12mph' },
        { day: 'Mon', icon: Sun, high: 71, low: 57, wind: 'N 6mph' },
        { day: 'Tue', icon: Cloud, high: 69, low: 59, wind: 'E 5mph' }
      ]
    },
    'wheeler-lake': {
      name: 'Wheeler Lake',
      club: 'River Valley Independent Bass Club',
      date: 'October 12, 2024',
      startTime: '5:30 AM',
      weighInTime: '2:30 PM',
      entryFee: '$100',
      registered: true,
      daysAway: 20,
      location: 'Ingalls Harbor Launch',
      clubColor: 'water-blue',
      earlyOutlook: true,
      forecast: []
    },
    'smith-lake': {
      name: 'Smith Lake',
      club: 'Alabama Bass Nation – Chapter 12',
      date: 'October 26, 2024',
      startTime: '6:00 AM',
      weighInTime: '3:00 PM',
      entryFee: '$100',
      registered: false,
      daysAway: 34,
      location: 'Duncan Bridge Launch',
      clubColor: 'accent',
      earlyOutlook: true,
      forecast: []
    }
  };

  const tournament = tournaments[tournamentId as keyof typeof tournaments];
  
  // Find officer notes related to this tournament
  const relatedNotes = mockOfficerNotes.filter(note => 
    note.eventDetails?.tournamentId === tournamentId ||
    note.eventDetails?.lake === tournament?.name ||
    (tournament && note.title.toLowerCase().includes(tournament.name.toLowerCase()))
  );

  const handleVolunteer = (noteId: string) => {
    toast({
      title: "Volunteer recorded!",
      description: "Officers will be notified of your response.",
    });
  };
  
  if (!tournament) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Tournament Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UniversalHeader 
        title={tournament.name}
        customActions={
          <Button size="sm" variant="outline" asChild>
            <Link to="/club-dashboard">
              <Eye className="mr-2 h-4 w-4" />
              View Club
            </Link>
          </Button>
        }
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-water-blue-dark/80 to-fishing-green-dark/80 text-white p-4">
        <h1 className="text-xl font-bold">{tournament.name}</h1>
        <p className="text-sm opacity-90">{tournament.club}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Related Officer Notes */}
        {relatedNotes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Tournament Notices
            </h2>
            {relatedNotes.map(note => (
              <OfficerNote 
                key={note.id}
                note={note}
                onVolunteer={handleVolunteer}
              />
            ))}
          </div>
        )}

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
              Tournament Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{tournament.date}</p>
                  <p className="text-xs text-muted-foreground">Tournament Date</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{tournament.startTime}</p>
                  <p className="text-xs text-muted-foreground">Start Time</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{tournament.location}</p>
                  <p className="text-xs text-muted-foreground">Launch Location</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{tournament.entryFee}</p>
                  <p className="text-xs text-muted-foreground">Entry Fee</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge className={tournament.registered ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                  {tournament.registered ? "Registered ✅" : "Not Registered ❌"}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">Starts in {tournament.daysAway} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="w-5 h-5 mr-2 text-water-blue" />
              Weather Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tournament.daysAway <= 7 ? (
              <div>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {tournament.forecast && tournament.forecast.map((day, index) => {
                    const IconComponent = day.icon;
                    return (
                      <div key={index} className="text-center p-2 bg-accent/30 rounded-lg">
                        <p className="text-xs font-medium mb-1">{day.day}</p>
                        <IconComponent className="w-6 h-6 mx-auto mb-1 text-water-blue" />
                        <p className="text-xs font-bold">{day.high}°/{day.low}°</p>
                        <p className="text-xs text-muted-foreground">{day.wind}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground text-center">Demo forecast • not live data</p>
              </div>
            ) : (
              <div className="bg-water-blue/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Sun className="w-4 h-4 mr-2 text-water-blue" />
                  Early Outlook
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Typical {tournament.date.includes('October') ? 'early-October' : 'late-September'} conditions:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Water temp: 62–65°F</li>
                  <li>• Prevailing W winds 8-12mph</li>
                  <li>• Morning lows in mid-50s</li>
                  <li>• Afternoon highs 68-74°F</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Historical averages • not live data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Plan Hooks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-fishing-green" />
              Game Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {/* Manual save button removed - AI handles plans automatically */}
              <Button 
                variant="outline" 
                onClick={() => navigate('/plans')}
                className="w-full"
              >
                View All Plans
              </Button>
              <Link to="/ai-coach">
                <Button variant="outline" className="w-full">
                  Open in AI Coach
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Club Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Club Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{tournament.club}</p>
                <p className="text-sm text-muted-foreground">Tournament Host</p>
              </div>
              <Link to="/club-dashboard">
                <Button variant="outline" size="sm">
                  View Club Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Interactive GPS Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-water-blue" />
              GPS Catch Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-water-blue/10 to-fishing-green/10 rounded-lg h-64 relative border-2 border-dashed border-muted overflow-hidden">
              {/* Lake background */}
              <div className="absolute inset-0 bg-gradient-to-br from-water-blue/20 to-fishing-green/20" />
              
              {/* GPS Pins */}
              <Link 
                to={`/tournament/${tournamentId}/catch/pin1`}
                className="absolute top-4 left-8 group cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-trophy-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="bg-background text-foreground px-2 py-1 rounded text-xs mt-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    5.7 lbs • Grass Edge
                  </div>
                </div>
              </Link>

              <Link 
                to={`/tournament/${tournamentId}/catch/pin2`}
                className="absolute top-12 right-12 group cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-fishing-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div className="bg-background text-foreground px-2 py-1 rounded text-xs mt-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    4.3 lbs • Rocky Point
                  </div>
                </div>
              </Link>

              <Link 
                to={`/tournament/${tournamentId}/catch/pin3`}
                className="absolute bottom-8 left-16 group cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-water-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div className="bg-background text-foreground px-2 py-1 rounded text-xs mt-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    3.9 lbs • Creek Mouth
                  </div>
                </div>
              </Link>

              <Link 
                to={`/tournament/${tournamentId}/catch/pin4`}
                className="absolute bottom-6 right-8 group cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-destructive text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform">
                    4
                  </div>
                  <div className="bg-background text-foreground px-2 py-1 rounded text-xs mt-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    6.2 lbs • Big Bass!
                  </div>
                </div>
              </Link>

              {/* Launch ramp indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  🚤
                </div>
                <div className="text-xs text-muted-foreground text-center mt-1 whitespace-nowrap">Launch</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">Tap pins to view catch details</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
};

export default TournamentDetail;