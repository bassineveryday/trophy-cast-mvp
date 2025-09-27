import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Trophy, 
  TrendingUp, 
  Fish, 
  Calendar,
  Target,
  Award,
  ChevronLeft,
  Star,
  Users,
  Bell,
  Crown,
  Shield,
  FileText,
  DollarSign,
  Leaf,
  User,
  Info,
  MapPin,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
import OfficerQuickActions from "@/components/dashboard/OfficerQuickActions";
import RoleBasedWelcome from "@/components/dashboard/RoleBasedWelcome";
import { useUserClubs } from "@/hooks/useClubMembership";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode, DEMO_CLUB } from "@/contexts/DemoModeContext";
import { useUserEffectiveRoles } from "@/hooks/useRBAC";
import { DemoClubBanner } from "@/components/demo/DemoClubBanner";
import { DemoOfficerQuickActions } from "@/components/demo/DemoOfficerQuickActions";
import { DemoRoleBasedDashboard } from "@/components/demo/DemoRoleBasedDashboard";
import { PersonalizedWelcome } from "@/components/dashboard/PersonalizedWelcome";

const PersonalizedDashboard = () => {
  const { user, profile } = useAuth();
  const { isDemoMode, currentDemoUser, getDemoClub } = useDemoMode();
  
  // Get user's clubs to show officer actions for the first club
  const { data: userClubs = [] } = useUserClubs();
  const primaryClub = userClubs[0]?.club;
  
  // Get user's roles
  const { data: userRoles = [] } = useUserEffectiveRoles(primaryClub?.id);
  const isOfficer = userRoles.some(role => 
    ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director', 'club_admin'].includes(role.role_name)
  );

  // Determine display data based on mode
  const displayUser = isDemoMode ? currentDemoUser : profile;
  const displayClub = isDemoMode ? getDemoClub() : primaryClub;
  const userName = displayUser?.name || user?.email?.split('@')[0] || 'User';

  // Mock upcoming tournaments - in real app, fetch from API based on user's clubs
  const upcomingTournaments = [
    {
      name: isDemoMode ? "Lake Guntersville Championship (Demo)" : "Lake Guntersville Championship",
      date: "September 28, 2024",
      time: "6:00 AM",
      location: "Cathedral Caverns State Park",
      club: isDemoMode ? getDemoClub().name : "Alabama Bass Nation"
    },
    {
      name: isDemoMode ? "Wheeler Lake Open (Demo)" : "Wheeler Lake Open",
      date: "October 12, 2024", 
      time: "5:30 AM",
      location: "First Creek Launch",
      club: isDemoMode ? getDemoClub().name : "Local Bass Club"
    }
  ];

  // Mock recent activity - in real app, fetch user's recent catches/achievements
  const recentActivity = [
    {
      type: "tournament",
      title: "Tournament Registration",
      description: `Registered for ${upcomingTournaments[0].name}`,
      time: "2 days ago",
      icon: Calendar
    },
    {
      type: "catch",
      title: "New Personal Best",
      description: "8.4 lb Largemouth - Lake Guntersville",
      time: "5 days ago",
      icon: Fish
    },
    {
      type: "achievement",
      title: "Top 5 Finish",
      description: "2nd Place - Smith Lake Championship",
      time: "1 week ago",
      icon: Trophy
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Add top padding if demo mode is active */}
      {isDemoMode && <div className="h-12" />}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-water-blue-dark to-fishing-green-dark text-white p-4">
        <div className="flex items-center mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold ml-2">
            {isDemoMode ? 'Demo Dashboard' : 'Personal Dashboard'}
          </h1>
        </div>
        
        {/* Personalized Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {userName}!</h2>
            <p className="text-sm opacity-90 flex items-center gap-2">
              {displayClub && (
                <>
                  <Users className="w-4 h-4" />
                  {displayClub.name}
                  {isDemoMode && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                      Demo
                    </Badge>
                  )}
                </>
              )}
            </p>
          </div>
          {displayClub && (
            <div className="text-right">
              <p className="text-sm opacity-75">Your Club</p>
              <p className="font-semibold">{(displayClub as any).abbreviation || displayClub.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Personalized Welcome Banner */}
        <PersonalizedWelcome />

        {/* Demo Mode Content */}
        {isDemoMode && <DemoRoleBasedDashboard />}

        {/* Real User Content */}
        {!isDemoMode && isOfficer && primaryClub && (
          <OfficerQuickActions clubId={primaryClub.id} />
        )}

        {/* Upcoming Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-water-blue" />
                Your Upcoming Tournaments
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
                    Registered
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
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{tournament.club}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Tournament Plan
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-water-blue" />
                Recent Activity
              </div>
              {isDemoMode && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                  Demo Activity
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Career Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
              Career Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-trophy-gold">
                  {isDemoMode ? "23" : "47"}
                </div>
                <div className="text-sm text-muted-foreground">Tournaments</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-fishing-green">
                  {isDemoMode ? "8" : "12"}
                </div>
                <div className="text-sm text-muted-foreground">Top 5 Finishes</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">{isDemoMode ? "2" : "3"}</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{isDemoMode ? "7.2 lbs" : "8.4 lbs"}</div>
                <div className="text-xs text-muted-foreground">Biggest Bass</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{isDemoMode ? "22.1 lbs" : "24.8 lbs"}</div>
                <div className="text-xs text-muted-foreground">Best Bag</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Season Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-water-blue" />
              2024 Season Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">AOY Points Progress</span>
              <Badge variant="outline">
                {isDemoMode ? "892 / 1,500 pts" : "1,247 / 2,000 pts"}
              </Badge>
            </div>
            <Progress value={isDemoMode ? 59 : 62} className="w-full" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Events Fished</span>
                  <span className="font-semibold">{isDemoMode ? "6" : "8"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Finish</span>
                  <span className="font-semibold">{isDemoMode ? "12th" : "15th"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Best Finish</span>
                  <span className="font-semibold text-trophy-gold">
                    {isDemoMode ? "1st" : "2nd"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Winnings</span>
                  <span className="font-semibold text-success">
                    {isDemoMode ? "$2,150" : "$3,450"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Fish Caught</span>
                  <span className="font-semibold">{isDemoMode ? "87" : "124"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Weight Total</span>
                  <span className="font-semibold">{isDemoMode ? "268.4 lbs" : "387.2 lbs"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Club-Specific Content */}
        {displayClub && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-water-blue" />
                {displayClub.name} Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Club Meeting:</strong> Next meeting is October 15th at 7:00 PM. 
                  {isDemoMode && " (Demo announcement)"}
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tournament Alert:</strong> Registration for the Fall Championship closes in 3 days.
                  {isDemoMode && " (Demo event)"}
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/club-dashboard">View Club Dashboard</Link>
                </Button>
                {isOfficer || (isDemoMode && currentDemoUser && ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director'].includes(currentDemoUser.club_role)) && (
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/clubs/${displayClub.id}/manage`}>Club Management</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
};

export default PersonalizedDashboard;