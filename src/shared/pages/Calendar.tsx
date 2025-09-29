import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { TournamentCalendar } from "@/components/TournamentCalendar";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
import { mockTournaments } from "@/data/mockData";

const Calendar = () => {
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
          {mockTournaments.length} Events
        </Badge>
      </div>

      {/* Tournament Calendar */}
      <TournamentCalendar tournaments={mockTournaments} />

      {/* Quick Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2 text-water-blue" />
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-trophy-gold">3</p>
              <p className="text-xs text-muted-foreground">Registered Events</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-fishing-green">2</p>
              <p className="text-xs text-muted-foreground">Plans Ready</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
};

export default Calendar;