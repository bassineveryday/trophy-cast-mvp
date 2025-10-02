import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Medal, Crown } from "lucide-react";

export default function TrophyRoom() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Trophy Room" />
      
      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-4">
            <Award className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Trophy Room</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Showcase your best catches, tournament wins, and achievements
          </p>
        </div>

        {/* Placeholder Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Tournament Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-700 mb-1">0</p>
              <p className="text-sm text-gray-600">First place finishes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-700 mb-1">0</p>
              <p className="text-sm text-gray-600">Achievement badges</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-blue-600" />
                Personal Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700 mb-1">--</p>
              <p className="text-sm text-gray-600">Biggest catch</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                AOY Titles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-700 mb-1">0</p>
              <p className="text-sm text-gray-600">Angler of the Year</p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Message */}
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Start fishing and logging catches to build your trophy collection!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
