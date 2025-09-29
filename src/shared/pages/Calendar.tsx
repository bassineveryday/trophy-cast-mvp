import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { TournamentCalendar } from "@/components/TournamentCalendar";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
const Calendar = () => {
  // Empty tournaments array for demo cleanup
  const mockTournaments: any[] = [];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Tournament Calendar</h1>
            <p className="text-sm text-muted-foreground">Upcoming events and schedules</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          <CalendarIcon className="w-3 h-3 mr-1" />
          0 Events
        </Badge>
      </div>

      {/* Empty Calendar State */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardContent className="p-8 text-center">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-medium mb-2">No events yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tournament events and schedules will appear here once you join clubs and register for tournaments.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/tournaments">
              <Button variant="outline" className="w-full">
                <CalendarIcon className="w-4 h-4 mr-2" />
                View Tournaments
              </Button>
            </Link>
            <Link to="/club-dashboard">
              <Button variant="outline" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Join Clubs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
};

export default Calendar;