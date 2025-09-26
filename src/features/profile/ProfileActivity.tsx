import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy,
  Fish,
  Calendar,
  Target,
  TrendingUp,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ProfileActivityProps {
  angler: any;
}

const ProfileActivity = ({ angler }: ProfileActivityProps) => {
  const { toast } = useToast();

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "tournament",
      title: "1st Place - Wheeler Lake Open",
      date: "Sept 20, 2024",
      details: "18.45 lbs • 5 fish limit",
      icon: Trophy,
      color: "text-trophy-gold",
      bgColor: "bg-trophy-gold/10"
    },
    {
      id: 2,
      type: "catch",
      title: "Personal Best Bass",
      date: "Sept 15, 2024",
      details: "8.2 lbs • Lake Guntersville • Spinnerbait",
      icon: Fish,
      color: "text-fishing-green",
      bgColor: "bg-fishing-green/10"
    },
    {
      id: 3,
      type: "tournament",
      title: "Registered - Smith Lake Championship",
      date: "Sept 10, 2024",
      details: "Oct 26, 2024 • $75 entry fee",
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: 4,
      type: "achievement",
      title: "5-Bass Limit Streak",
      date: "Sept 8, 2024",
      details: "4 consecutive tournaments with limits",
      icon: Target,
      color: "text-water-blue",
      bgColor: "bg-water-blue/10"
    }
  ];

  const upcomingTournaments = [
    {
      name: "Lake Guntersville Open",
      date: "Oct 12, 2024",
      lake: "Lake Guntersville",
      status: "Registered"
    },
    {
      name: "Smith Lake Championship", 
      date: "Oct 26, 2024",
      lake: "Smith Lake",
      status: "Registered"
    },
    {
      name: "Wheeler Lake Series #4",
      date: "Nov 2, 2024", 
      lake: "Wheeler Lake",
      status: "Open"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-accent rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toast({
                  title: activity.title,
                  description: "Activity details (demo)"
                })}
              >
                <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => toast({
              title: "Demo only",
              description: "Full activity history coming soon"
            })}
          >
            View All Activity
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Tournaments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Upcoming Tournaments
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({
                title: "Demo only",
                description: "Tournament registration coming soon"
              })}
            >
              View Calendar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingTournaments.map((tournament, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-accent rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toast({
                  title: tournament.name,
                  description: "Tournament details (demo)"
                })}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{tournament.name}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {tournament.lake} • {tournament.date}
                    </div>
                  </div>
                </div>
                
                <Badge 
                  className={tournament.status === 'Registered' 
                    ? 'bg-fishing-green/10 text-fishing-green' 
                    : 'bg-primary/10 text-primary'
                  }
                >
                  {tournament.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-fishing-green" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-fishing-green">78%</p>
              <p className="text-xs text-muted-foreground">Limit Rate</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-water-blue">3.2</p>
              <p className="text-xs text-muted-foreground">Avg per Fish</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-trophy-gold">12th</p>
              <p className="text-xs text-muted-foreground">AOY Ranking</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-primary">+15%</p>
              <p className="text-xs text-muted-foreground">vs Last Year</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => toast({
              title: "Demo only",
              description: "Detailed analytics coming soon"
            })}
          >
            View Detailed Stats
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileActivity;