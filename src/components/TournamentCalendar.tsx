import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGesture } from "react-use-gesture";
import { useState } from "react";
import { Tournament } from "@/types";

interface TournamentCalendarProps {
  tournaments: Tournament[];
}

export const TournamentCalendar = ({ tournaments }: TournamentCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const months = ['September 2024', 'October 2024', 'November 2024'];

  const bind = useGesture({
    onDrag: ({ movement: [mx], direction: [xDir], distance, cancel }) => {
      if (distance > 50) {
        if (xDir > 0 && currentMonth > 0) {
          setCurrentMonth(currentMonth - 1);
        } else if (xDir < 0 && currentMonth < months.length - 1) {
          setCurrentMonth(currentMonth + 1);
        }
        cancel();
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="shadow-card-custom border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-fishing-green" />
              Tournament Calendar
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => currentMonth > 0 && setCurrentMonth(currentMonth - 1)}
                disabled={currentMonth === 0}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {months[currentMonth]}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => currentMonth < months.length - 1 && setCurrentMonth(currentMonth + 1)}
                disabled={currentMonth === months.length - 1}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            {...bind()}
            className="space-y-4 touch-pan-y"
            key={currentMonth}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tournaments.map((tournament) => (
              <Link key={tournament.id} to={tournament.link}>
                <motion.div 
                  className={`p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-300 ${
                    tournament.registered 
                      ? 'bg-fishing-green/10 border-fishing-green hover:bg-fishing-green/20 hover:shadow-glow' 
                      : 'bg-muted/30 border-muted-foreground hover:bg-muted/50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-base">{tournament.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{tournament.club}</p>
                      <div className="flex items-center space-x-3 flex-wrap gap-2">
                        <Badge 
                          variant={tournament.registered ? "default" : "destructive"}
                          className="text-xs font-medium"
                        >
                          {tournament.registered ? "Registered ✅" : "Not Registered ❌"}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">{tournament.fee}</span>
                        <div className="flex items-center bg-water-blue/20 text-water-blue px-2 py-1 rounded-md">
                          <tournament.weatherIcon className="w-3 h-3 mr-1" />
                          <span className="text-xs font-medium">
                            {typeof tournament.weather === 'string' ? tournament.weather : `${tournament.weather.high}°/${tournament.weather.low}°`}
                          </span>
                        </div>
                        {/* Plan Badge - shows if tournament has an associated plan */}
                        {tournament.hasPlan && (
                          <Badge className="bg-trophy-gold/20 text-trophy-gold border-trophy-gold/30 text-xs">
                            📋 Plan
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold">{tournament.date}</p>
                      <p className="text-sm text-muted-foreground">{tournament.time}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};