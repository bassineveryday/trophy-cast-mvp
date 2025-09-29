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

const Dashboard = () => {
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
        {/* Career Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
              Career Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-8 text-center text-muted-foreground">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No career stats yet</p>
              <p className="text-xs mt-1">Your tournament history will appear here</p>
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
            <div className="p-8 text-center text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No season data yet</p>
              <p className="text-xs mt-1">Your 2024 season stats will appear here</p>
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
            <div className="p-8 text-center text-muted-foreground">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No standings data yet</p>
              <p className="text-xs mt-1">AOY standings will appear here</p>
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
            <div className="p-8 text-center text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No plans created yet</p>
              <p className="text-xs mt-1">Create tournament plans to get started</p>
            </div>
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
            <div className="p-8 text-center text-muted-foreground">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No achievements yet</p>
              <p className="text-xs mt-1">Your achievements will appear here</p>
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