import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Bell, Sun, Cloud, Wind, MapPin, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import alabamaLogo from "@/assets/alabama-bass-logo.png";
import riverValleyLogo from "@/assets/river-valley-logo.png";

const TournamentAlerts = () => {
  const [countdowns, setCountdowns] = useState({
    guntersville: { days: 6, hours: 12 },
    wheeler: { days: 20, hours: 4 }
  });

  // Simulate countdown updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(prev => ({
        guntersville: {
          days: prev.guntersville.days,
          hours: prev.guntersville.hours > 0 ? prev.guntersville.hours - 1 : 23
        },
        wheeler: {
          days: prev.wheeler.days,
          hours: prev.wheeler.hours > 0 ? prev.wheeler.hours - 1 : 23
        }
      }));
    }, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  const tournaments = [
    {
      id: "guntersville",
      name: "Lake Guntersville",
      club: "Alabama Bass Nation",
      clubFull: "Alabama Bass Nation – Chapter 12",
      date: "Sept 28, 2025",
      launch: "6:00 AM",
      weighin: "2:00 PM",
      fee: "$100",
      registered: true,
      countdown: countdowns.guntersville,
      weather: {
        high: 74,
        low: 58,
        wind: "W 10 mph",
        icon: Sun
      },
      clubColor: "fishing-green",
      logo: alabamaLogo,
      link: "/tournament/lake-guntersville"
    },
    {
      id: "wheeler",
      name: "Wheeler Lake", 
      club: "River Valley Independent",
      clubFull: "River Valley Independent Bass Club",
      date: "Oct 12, 2025",
      launch: "6:30 AM",
      weighin: "2:30 PM", 
      fee: "$100",
      registered: false,
      countdown: countdowns.wheeler,
      weather: {
        high: 71,
        low: 55,
        wind: "W 12 mph",
        icon: Cloud
      },
      clubColor: "water-blue",
      logo: riverValleyLogo,
      link: "/tournament/wheeler-lake"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Tournament Alerts</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="p-4 space-y-6">
        {tournaments.length > 0 ? (
          tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={tournament.link}>
                <Card className={`hover:shadow-glow transition-all duration-300 border-l-4 border-${tournament.clubColor} cursor-pointer`}>
                  <CardHeader className={`bg-gradient-to-r from-${tournament.clubColor}/10 to-${tournament.clubColor}/5 pb-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={tournament.logo} 
                          alt={tournament.club} 
                          className="w-12 h-12 rounded-full shadow-md"
                        />
                        <div>
                          <CardTitle className="text-lg">{tournament.name}</CardTitle>
                          <p className="text-sm text-muted-foreground font-medium">{tournament.clubFull}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={tournament.registered ? "default" : "destructive"}
                        className="text-xs font-bold"
                      >
                        {tournament.registered ? "✅ Registered" : "❌ Not Registered"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4 pb-5">
                    {/* Date and Times */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-primary mb-2">{tournament.date}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Launch {tournament.launch}</span>
                        </div>
                        <span>•</span>
                        <span>Weigh-in {tournament.weighin}</span>
                      </div>
                    </div>

                    {/* Entry Fee */}
                    <div className="flex items-center mb-4">
                      <DollarSign className="w-4 h-4 mr-2 text-trophy-gold" />
                      <span className="text-sm font-medium">Entry Fee: {tournament.fee}</span>
                    </div>

                    {/* Countdown */}
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-lg font-bold text-primary">
                          Starts in {tournament.countdown.days} days {tournament.countdown.hours}h
                        </span>
                      </div>
                    </div>

                    {/* Weather Peek */}
                    <div className="flex items-center justify-between p-3 bg-water-blue/10 rounded-lg border border-water-blue/20">
                      <div className="flex items-center space-x-2">
                        <tournament.weather.icon className="w-5 h-5 text-water-blue" />
                        <span className="font-medium text-water-blue">Weather Peek</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          Hi {tournament.weather.high}°F / Lo {tournament.weather.low}°F
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Wind className="w-3 h-3 mr-1" />
                          {tournament.weather.wind}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">No Upcoming Tournaments</h2>
            <p className="text-muted-foreground">Check back later for tournament notifications</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TournamentAlerts;