import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Top10Finishes = () => {
  const top10Finishes = [
    {
      tournament: "Lake Guntersville",
      date: "September 18, 2024",
      weight: "14.8 lbs",
      place: "7th",
      club: "Alabama Bass Nation – Chapter 12"
    },
    {
      tournament: "Wheeler Lake",
      date: "April 26, 2024", 
      weight: "13.9 lbs",
      place: "9th",
      club: "River Valley Independent Bass Club"
    },
    {
      tournament: "Smith Lake",
      date: "July 8, 2023",
      weight: "15.2 lbs", 
      place: "6th",
      club: "Alabama Bass Nation – Chapter 12"
    },
    {
      tournament: "Pueblo Reservoir",
      date: "May 12, 2023",
      weight: "12.4 lbs", 
      place: "10th",
      club: "Colorado Bass Federation"
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
          <Award className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Top 10 Finishes</h1>
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          {top10Finishes.map((finish, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{finish.tournament}</h3>
                        <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                          {finish.place} Place
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{finish.club}</p>
                      <p className="text-sm text-muted-foreground">{finish.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{finish.weight}</div>
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
              <Award className="w-5 h-5 mr-2 text-primary" />
              Top 10 Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">18</div>
                <div className="text-xs text-muted-foreground">Top 10s</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-fishing-green">15.2</div>
                <div className="text-xs text-muted-foreground">Best Top 10 (lbs)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-water-blue">14.1</div>
                <div className="text-xs text-muted-foreground">Avg Top 10 (lbs)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Top10Finishes;