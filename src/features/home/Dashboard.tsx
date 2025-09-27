import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  TrendingUp, 
  Fish, 
  Calendar,
  Target,
  Award,
  ChevronLeft,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
import OfficerQuickActions from "@/components/dashboard/OfficerQuickActions";
import RoleBasedWelcome from "@/components/dashboard/RoleBasedWelcome";
import { useUserClubs } from "@/hooks/useClubMembership";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  // Get user's clubs to show officer actions for the first club
  // In a real app, you might want to let users select which club
  const { data: userClubs = [] } = useUserClubs();
  const primaryClub = userClubs[0]?.club;
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-water-blue-dark to-fishing-green-dark text-white p-4">
        <div className="flex items-center mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold ml-2">Personal Dashboard</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Role-based welcome message */}
        <RoleBasedWelcome 
          clubId={primaryClub?.id} 
          userName={user?.email?.split('@')[0]} 
        />
        
        {/* Officer Quick Actions - only shown if user has officer role */}
        {primaryClub && (
          <OfficerQuickActions clubId={primaryClub.id} />
        )}
        
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
                <div className="text-2xl font-bold text-trophy-gold">47</div>
                <div className="text-sm text-muted-foreground">Tournaments</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-fishing-green">12</div>
                <div className="text-sm text-muted-foreground">Top 5 Finishes</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">3</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">8.4 lbs</div>
                <div className="text-xs text-muted-foreground">Biggest Bass</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">24.8 lbs</div>
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
              <Badge variant="outline">1,247 / 2,000 pts</Badge>
            </div>
            <Progress value={62} className="w-full" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Events Fished</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Finish</span>
                  <span className="font-semibold">15th</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Best Finish</span>
                  <span className="font-semibold text-trophy-gold">2nd</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Winnings</span>
                  <span className="font-semibold text-success">$3,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Fish Caught</span>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Weight Total</span>
                  <span className="font-semibold">387.2 lbs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AOY Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-trophy-gold" />
                AOY Standings
              </div>
              <Link to="/leaderboard">
                <Button variant="outline" size="sm">View Full</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-accent p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-trophy-gold rounded-full flex items-center justify-center text-sm font-bold text-white">
                    12
                  </div>
                  <div>
                    <p className="font-semibold">Mike Johnson (You)</p>
                    <p className="text-sm text-muted-foreground">Alabama Bass Nation</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">1,247 pts</div>
                  <div className="text-sm text-success flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Up 3 spots
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2">
                <span>11. James Wilson</span>
                <span className="font-semibold">1,298 pts</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span>13. Robert Davis</span>
                <span className="font-semibold">1,189 pts</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span>14. Tom Anderson</span>
                <span className="font-semibold">1,156 pts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Plans Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-water-blue" />
                My Tournament Plans
              </div>
              <Link to="/plans">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-accent rounded-lg">
                <p className="font-semibold text-sm">Saved Plans</p>
                <p className="text-2xl font-bold text-water-blue">6</p>
              </div>
              <div className="p-3 bg-accent rounded-lg">
                <p className="font-semibold text-sm">Avg Confidence</p>
                <p className="text-2xl font-bold text-fishing-green">79%</p>
              </div>
            </div>
            <Link to="/plans">
              <Button className="w-full" variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Manage Tournament Plans
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-trophy-gold" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
              <div className="w-12 h-12 bg-trophy-gold rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Top 5 Finish</p>
                <p className="text-sm text-muted-foreground">Smith Lake Championship - 2nd Place</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
              <div className="w-12 h-12 bg-fishing-green rounded-full flex items-center justify-center">
                <Fish className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Personal Best</p>
                <p className="text-sm text-muted-foreground">8.4 lb Largemouth - Lake Guntersville</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
              <div className="w-12 h-12 bg-water-blue rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Consistency Award</p>
                <p className="text-sm text-muted-foreground">5 consecutive top-10 finishes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
};

export default Dashboard;