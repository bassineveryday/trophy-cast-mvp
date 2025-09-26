import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Top20Finishes = () => {
  const top20Finishes = [
    {
      tournament: "Lake Martin",
      date: "August 15, 2024",
      weight: "11.7 lbs",
      place: "14th",
      club: "Alabama Bass Nation – Chapter 12"
    },
    {
      tournament: "Wheeler Lake",
      date: "June 22, 2024", 
      weight: "10.9 lbs",
      place: "18th",
      club: "River Valley Independent Bass Club"
    },
    {
      tournament: "Cherry Creek",
      date: "March 4, 2024",
      weight: "9.8 lbs", 
      place: "19th",
      club: "Colorado Bass Federation"
    },
    {
      tournament: "Smith Lake",
      date: "November 12, 2023",
      weight: "12.3 lbs", 
      place: "15th",
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
          <Target className="w-8 h-8 text-water-blue mr-3" />
          <h1 className="text-2xl font-bold">Top 20 Finishes</h1>
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          {top20Finishes.map((finish, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-water-blue/10 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-water-blue" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{finish.tournament}</h3>
                        <span className="text-sm font-bold text-water-blue bg-water-blue/10 px-2 py-1 rounded">
                          {finish.place} Place
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{finish.club}</p>
                      <p className="text-sm text-muted-foreground">{finish.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-water-blue">{finish.weight}</div>
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
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-water-blue" />
              Top 20 Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">31</div>
                <div className="text-xs text-muted-foreground">Top 20s</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-fishing-green">12.3</div>
                <div className="text-xs text-muted-foreground">Best Top 20 (lbs)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-water-blue">11.2</div>
                <div className="text-xs text-muted-foreground">Avg Top 20 (lbs)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Top20Finishes;