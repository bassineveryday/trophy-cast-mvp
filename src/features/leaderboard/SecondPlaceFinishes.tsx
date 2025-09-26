import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SecondPlaceFinishes = () => {
  const secondPlaceFinishes = [
    {
      tournament: "Wheeler Lake",
      date: "May 15, 2024",
      weight: "20.1 lbs",
      club: "River Valley Independent Bass Club"
    },
    {
      tournament: "Lake Mac",
      date: "July 22, 2023", 
      weight: "19.6 lbs",
      club: "Alabama Bass Nation – Chapter 12"
    },
    {
      tournament: "John Martin",
      date: "Sept 18, 2022",
      weight: "17.9 lbs", 
      club: "Colorado Bass Federation"
    },
    {
      tournament: "Smith Lake",
      date: "March 14, 2024",
      weight: "18.4 lbs", 
      club: "Alabama Bass Nation – Chapter 12"
    },
    {
      tournament: "Chatuge Lake",
      date: "August 6, 2023",
      weight: "16.7 lbs", 
      club: "River Valley Independent Bass Club"
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
          <Medal className="w-8 h-8 text-muted-foreground mr-3" />
          <h1 className="text-2xl font-bold">🥈 Second Place Finishes</h1>
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          {secondPlaceFinishes.map((finish, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <Medal className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{finish.tournament}</h3>
                      <p className="text-sm text-muted-foreground">{finish.club}</p>
                      <p className="text-sm text-muted-foreground">{finish.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-secondary">{finish.weight}</div>
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
              <Medal className="w-5 h-5 mr-2 text-muted-foreground" />
              Second Place Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-xs text-muted-foreground">Runner-ups</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">20.1</div>
                <div className="text-xs text-muted-foreground">Best 2nd (lbs)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-fishing-green">18.5</div>
                <div className="text-xs text-muted-foreground">Avg 2nd (lbs)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecondPlaceFinishes;