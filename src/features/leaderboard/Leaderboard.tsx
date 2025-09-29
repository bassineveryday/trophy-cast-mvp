import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  Crown,
  Medal,
  Award,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import UniversalAvatar from "@/components/UniversalAvatar";

/* ------------ Types ------------ */
type ChangeDir = "up" | "down" | "flat";

interface LiveAngler {
  id: string;
  rank: number;
  name: string;
  anglerId: string;
  weightLbs: number;
  bigLbs: number;
  change: ChangeDir;
  avatar: string; // initials
  previousRank?: number;
  isUser?: boolean;
}

interface AOYAngler {
  id: string;
  rank: number;
  name: string;
  anglerId: string;
  points: number;
  earnings: string;
  avatar: string; // initials
  isUser?: boolean;
}

/* ------------ Empty State Data ------------ */
const LIVE_LEADERBOARD: LiveAngler[] = [];

const AOY_STANDINGS: AOYAngler[] = [];

/* ------------ Helpers ------------ */
const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-trophy-gold" aria-label="1st place" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" aria-label="2nd place" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" aria-label="3rd place" />;
  return <span className="w-6 text-center text-sm font-semibold" aria-label={`${rank} place`}>{rank}</span>;
};

const ChangeIcon = ({ change }: { change: ChangeDir }) => {
  if (change === "up") return <TrendingUp className="h-4 w-4 text-success" aria-label="rank up" />;
  if (change === "down") return <TrendingDown className="h-4 w-4 text-destructive" aria-label="rank down" />;
  return <Minus className="h-4 w-4 text-muted-foreground" aria-label="no change" />;
};

const formatWeight = (n: number) => n.toFixed(2);

/* ------------ Component ------------ */
const Leaderboard = () => {
  const eventTitle = "Smith Lake Championship";
  const lastUpdated = "Updated 2 min ago";

  // Sort defensively in case data updates live
  const liveData = useMemo(
    () => [...LIVE_LEADERBOARD].sort((a, b) => a.rank - b.rank),
    []
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-trophy-gold to-trophy-gold-light p-4 text-primary-foreground">
        <div className="mb-4 flex items-center">
          <Link to="/" aria-label="Back to Home">
            <Button variant="ghost" size="sm" className="p-2 text-primary-foreground hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-2 text-xl font-bold">Leaderboards</h1>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{eventTitle}</h2>
            <p className="text-sm opacity-90">Live Tournament Results</p>
          </div>
          <Badge
            className="bg-success text-success-foreground"
            aria-live="polite"
            aria-label="Live updates active"
          >
            LIVE
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live">Live Tournament</TabsTrigger>
            <TabsTrigger value="aoy">AOY Standings</TabsTrigger>
          </TabsList>

          {/* Live */}
          <TabsContent value="live" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-trophy-gold" aria-hidden />
                    <span>Current Standings</span>
                  </div>
                  <Badge variant="outline" className="text-xs" aria-live="polite">
                    {lastUpdated}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {liveData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Leaderboard is empty</p>
                    <p className="text-xs mt-2">Tournament results will appear here during live events.</p>
                  </div>
                ) : (
                  <>
                    {liveData.map((angler) => (
                      <div key={angler.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        {/* Angler data would be rendered here */}
                      </div>
                    ))}
                    <div className="pt-4 text-center">
                      <Button variant="outline" size="sm" disabled>
                        No tournament data available
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tournament Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tournament Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Prize Pool</span>
                  <span className="font-semibold">$15,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Entry Fee</span>
                  <span className="font-semibold">$200</span>
                </div>
                <div className="flex justify-between">
                  <span>Anglers</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Remaining</span>
                  <span className="font-semibold text-destructive">2:34:15</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AOY */}
          <TabsContent value="aoy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-trophy-gold" aria-hidden />
                  <span>Angler of the Year Race</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {AOY_STANDINGS.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">AOY standings are empty</p>
                    <p className="text-xs mt-2">Angler of the Year standings will appear here once tournaments begin.</p>
                  </div>
                ) : (
                  <>
                    {AOY_STANDINGS.map((angler) => (
                      <div key={angler.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        {/* AOY data would be rendered here */}
                      </div>
                    ))}
                    <div className="pt-4 text-center">
                      <Button variant="outline" size="sm" disabled>
                        No AOY data available
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* AOY Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your AOY Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-muted-foreground">--</div>
                    <div className="text-xs text-muted-foreground">Points This Month</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-muted-foreground">--</div>
                    <div className="text-xs text-muted-foreground">Ranking Change</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;