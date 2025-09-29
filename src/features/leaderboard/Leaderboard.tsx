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

/* ------------ Mock Data ------------ */
const LIVE_LEADERBOARD: LiveAngler[] = [
  { id: "dt", rank: 1, name: "David Thompson", anglerId: "david-thompson", weightLbs: 18.45, bigLbs: 4.8, change: "up", avatar: "DT" },
  { id: "jp", rank: 2, name: "Jake Patterson", anglerId: "jake-patterson", weightLbs: 17.92, bigLbs: 5.2, change: "up", avatar: "JP", previousRank: 5 },
  { id: "mj", rank: 3, name: "Mike Johnson", anglerId: "mike-johnson", weightLbs: 17.33, bigLbs: 4.1, change: "up", avatar: "MJ" },
  { id: "sm", rank: 4, name: "Sarah Martinez", anglerId: "sarah-martinez", weightLbs: 16.89, bigLbs: 4.9, change: "down", avatar: "SM" },
  { id: "cw", rank: 5, name: "Chris Wilson", anglerId: "chris-wilson", weightLbs: 16.22, bigLbs: 3.9, change: "down", avatar: "CW" },
];

const AOY_STANDINGS: AOYAngler[] = [
  { id: "jp", rank: 1, name: "Jake Patterson", anglerId: "jake-patterson", points: 1847, earnings: "$12,450", avatar: "JP" },
  { id: "ms", rank: 2, name: "Maria Santos", anglerId: "maria-santos", points: 1723, earnings: "$9,875", avatar: "MS" },
  { id: "tl", rank: 3, name: "Tommy Lee", anglerId: "tommy-lee", points: 1685, earnings: "$8,200", avatar: "TL" },
  { id: "mj", rank: 12, name: "Mike Johnson", anglerId: "mike-johnson", points: 1247, earnings: "$3,450", avatar: "MJ", isUser: true },
];

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
                {liveData.map((angler) => {
                  const isUser = angler.name === "Mike Johnson";
                  const isHot = angler.name === "Jake Patterson";

                  return (
                    <div
                      key={angler.id}
                      className={[
                        "rounded-lg border p-4 transition-colors",
                        isUser ? "border-primary bg-accent" : "",
                        !isUser && isHot ? "border-success bg-success/10" : "hover:bg-muted/50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center">
                            <RankIcon rank={angler.rank} />
                          </div>

                          <UniversalAvatar
                            name={angler.name}
                            photoUrl="/placeholder.svg"
                            club={{
                              id: angler.anglerId.includes("patterson") ? "alabama-bass-nation" :
                                  angler.anglerId.includes("santos") ? "river-valley" :
                                  angler.anglerId.includes("thompson") ? "trophy-cast" : "alabama-bass-nation",
                              abbreviation: angler.anglerId.includes("patterson") ? "ABN-12" :
                                           angler.anglerId.includes("santos") ? "RVIBC" :
                                           angler.anglerId.includes("thompson") ? "TCES" : "ABN-12"
                            }}
                            role="Tournament Angler"
                            city={angler.anglerId.includes("patterson") ? "Huntsville, AL" :
                                 angler.anglerId.includes("santos") ? "Nashville, TN" :
                                 angler.anglerId.includes("thompson") ? "Birmingham, AL" : "Alabama"} 
                            anglerId={angler.anglerId}
                            size="card"
                            className={isUser ? "border-primary" : isHot ? "border-success" : ""}
                          />

                          <div>
                            <p 
                              className="font-semibold cursor-pointer hover:text-primary transition-colors"
                              onClick={() => window.location.href = `/anglers/${angler.anglerId}`}
                            >
                              {angler.name}
                              {isUser && <span className="ml-1 text-xs text-primary">(You)</span>}
                              {isHot && (
                                <Badge
                                  className="ml-2 text-xs"
                                  style={{ animation: "pulse 1.5s ease-in-out infinite" }}
                                >
                                  Hot Streak
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Big Fish: {formatWeight(angler.bigLbs)} lbs
                              {angler.previousRank && (
                                <span className="ml-2 font-medium text-success">
                                  ↑ from #{angler.previousRank}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-right">
                          <div>
                            <div className="text-lg font-bold">{formatWeight(angler.weightLbs)}</div>
                            <div className="text-xs text-muted-foreground">lbs</div>
                          </div>
                          <ChangeIcon change={angler.change} />
                          
                          {!isUser && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                const tournament = "Smith Lake Championship";
                                window.location.href = `/messages/new?to=${angler.anglerId}&tournament=${encodeURIComponent(tournament)}`;
                              }}
                              aria-label={`Message ${angler.name}`}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/leaderboard/full">View Full Leaderboard (47 anglers)</Link>
                  </Button>
                </div>
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
                {AOY_STANDINGS.map((angler) => (
                  <div
                    key={angler.id}
                    className={[
                      "rounded-lg border p-4 transition-colors",
                      angler.isUser ? "border-primary bg-accent" : "hover:bg-muted/50",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center">
                          <RankIcon rank={angler.rank} />
                        </div>

                        <UniversalAvatar
                          name={angler.name}
                          photoUrl="/placeholder.svg"
                          club={{
                            id: angler.anglerId.includes("patterson") ? "alabama-bass-nation" :
                                angler.anglerId.includes("santos") ? "river-valley" :
                                angler.anglerId.includes("tommy") ? "trophy-cast" : "alabama-bass-nation",
                            abbreviation: angler.anglerId.includes("patterson") ? "ABN-12" :
                                         angler.anglerId.includes("santos") ? "RVIBC" :
                                         angler.anglerId.includes("tommy") ? "TCES" : "ABN-12"
                          }}
                          role={angler.rank === 1 ? "AOY Champion" : "Tournament Angler"}
                          city={angler.anglerId.includes("patterson") ? "Huntsville, AL" :
                               angler.anglerId.includes("santos") ? "Nashville, TN" :
                               angler.anglerId.includes("tommy") ? "Birmingham, AL" : "Alabama"}
                          anglerId={angler.anglerId}
                          size="card"
                          isAOYChampion={angler.rank === 1}
                          className={angler.isUser ? "border-primary" : ""}
                        />

                        <div>
                          <p 
                            className="font-semibold cursor-pointer hover:text-primary transition-colors"
                            onClick={() => window.location.href = `/anglers/${angler.anglerId}`}
                          >
                            {angler.name}
                            {angler.isUser && <span className="ml-1 text-xs text-primary">(You)</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">Earnings: {angler.earnings}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-right">
                        <div>
                          <div className="text-lg font-bold">{angler.points}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                        
                        {!angler.isUser && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/messages/new?to=${angler.anglerId}`;
                            }}
                            aria-label={`Message ${angler.name}`}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="py-2 text-center">
                  <div className="text-sm text-muted-foreground" aria-hidden>
                    …
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/aoy">View Full AOY Standings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AOY Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your AOY Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-success">+85</div>
                    <div className="text-xs text-muted-foreground">Points This Month</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-fishing-green">3</div>
                    <div className="text-xs text-muted-foreground">Spots Gained</div>
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