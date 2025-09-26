import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Heart, MessageCircle, Share, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FirstPlaceFinishes = () => {
  const firstPlaceFinishes = [
    {
      tournament: "Lake Guntersville",
      date: "April 12, 2024",
      weight: "21.4 lbs",
      club: "Alabama Bass Nation – Chapter 12"
    },
    {
      tournament: "Pueblo Reservoir",
      date: "June 9, 2023", 
      weight: "18.7 lbs",
      club: "Colorado Bass Federation"
    },
    {
      tournament: "Cedar Bluff",
      date: "Sept 2, 2022",
      weight: "19.3 lbs", 
      club: "Alabama Bass Nation – Chapter 12"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex items-center mb-6">
          <Trophy className="w-8 h-8 text-trophy-gold mr-3" />
          <h1 className="text-2xl font-bold">🏆 First Place Finishes</h1>
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          {firstPlaceFinishes.map((finish, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-trophy-gold/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-trophy-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{finish.tournament}</h3>
                      <p className="text-sm text-muted-foreground">{finish.club}</p>
                      <p className="text-sm text-muted-foreground">{finish.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-trophy-gold">{finish.weight}</div>
                    <div className="text-sm text-muted-foreground">Total Weight</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                First Place Summary
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // This would open share modal in real app
                  alert("Share to Club Feed feature coming soon!");
                }}
                className="text-xs"
              >
                <Share className="w-3 h-3 mr-1" />
                Share Highlight
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Total Wins</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-trophy-gold">21.4</div>
                <div className="text-xs text-muted-foreground">Best Win (lbs)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-fishing-green">19.8</div>
                <div className="text-xs text-muted-foreground">Avg Win (lbs)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FirstPlaceFinishes;