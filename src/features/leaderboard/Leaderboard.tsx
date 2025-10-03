import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Medal,
  Award,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import UniversalAvatar from "@/components/UniversalAvatar";
import { PageHeader } from "@/components/PageHeader";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { BottomNavigation } from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import AOYStandings from "./AOYStandings";

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
  { id: "mj", rank: 1, name: "Mike Johnson", anglerId: "mike-johnson", weightLbs: 24.8, bigLbs: 5.6, change: "up", avatar: "MJ" },
  { id: "dt", rank: 2, name: "David Thompson", anglerId: "david-thompson", weightLbs: 23.5, bigLbs: 4.8, change: "flat", avatar: "DT" },
  { id: "jw", rank: 3, name: "Jake Wilson", anglerId: "jake-wilson", weightLbs: 22.9, bigLbs: 5.2, change: "up", avatar: "JW", previousRank: 5 },
  { id: "sm", rank: 4, name: "Sarah Martinez", anglerId: "sarah-martinez", weightLbs: 21.7, bigLbs: 4.9, change: "down", avatar: "SM" },
  { id: "ca", rank: 5, name: "Chris Anderson", anglerId: "chris-anderson", weightLbs: 20.3, bigLbs: 3.9, change: "down", avatar: "CA" },
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
  const [selectedTournament, setSelectedTournament] = useState("fall-classic");
  const { role } = useDemoMode();

  // Tournament leaderboard data
  const tournamentLeaderboards = {
    "fall-classic": [
      { rank: 1, name: "Mike Johnson", club: "Alabama Bass Chapter 12", weight: "24.8 lbs", fishCount: 5, points: 100, initials: "MJ", isDemo: role === "president" },
      { rank: 2, name: "David Thompson", club: "Trophy Cast Elite", weight: "23.5 lbs", fishCount: 5, points: 99, initials: "DT" },
      { rank: 3, name: "Jake Wilson", club: "Alabama Bass Chapter 12", weight: "22.9 lbs", fishCount: 5, points: 98, initials: "JW", isDemo: role === "jake" },
      { rank: 4, name: "Sarah Martinez", club: "River Valley IBC", weight: "21.7 lbs", fishCount: 5, points: 97, initials: "SM" },
      { rank: 5, name: "Chris Anderson", club: "Tennessee Valley Anglers", weight: "20.3 lbs", fishCount: 5, points: 96, initials: "CA" },
      { rank: 6, name: "Tommy Lee", club: "Alabama Bass Chapter 12", weight: "19.8 lbs", fishCount: 5, points: 95, initials: "TL" },
      { rank: 7, name: "Jennifer White", club: "Trophy Cast Elite", weight: "18.5 lbs", fishCount: 4, points: 94, initials: "JW" },
      { rank: 8, name: "Robert Taylor", club: "River Valley IBC", weight: "17.9 lbs", fishCount: 4, points: 93, initials: "RT" }
    ],
    "presidents-cup": [
      { rank: 1, name: "Mike Johnson", club: "Alabama Bass Chapter 12", weight: "26.2 lbs", fishCount: 5, points: 100, initials: "MJ", isDemo: role === "president" },
      { rank: 2, name: "Maria Santos", club: "River Valley IBC", weight: "25.1 lbs", fishCount: 5, points: 99, initials: "MS" },
      { rank: 3, name: "Tommy Lee", club: "Alabama Bass Chapter 12", weight: "23.8 lbs", fishCount: 5, points: 98, initials: "TL" },
      { rank: 4, name: "Jake Wilson", club: "Alabama Bass Chapter 12", weight: "22.4 lbs", fishCount: 5, points: 97, initials: "JW", isDemo: role === "jake" },
      { rank: 5, name: "Chris Wilson", club: "Trophy Cast Elite", weight: "21.6 lbs", fishCount: 5, points: 96, initials: "CW" },
      { rank: 6, name: "David Brown", club: "Tennessee Valley Anglers", weight: "20.9 lbs", fishCount: 5, points: 95, initials: "DB" },
      { rank: 7, name: "Sarah Martinez", club: "River Valley IBC", weight: "19.7 lbs", fishCount: 4, points: 94, initials: "SM" },
      { rank: 8, name: "Paul Davis", club: "Alabama Bass Chapter 12", weight: "18.3 lbs", fishCount: 4, points: 93, initials: "PD" }
    ],
    "state-championship": [
      { rank: 1, name: "David Thompson", club: "Trophy Cast Elite", weight: "28.9 lbs", fishCount: 5, points: 100, initials: "DT" },
      { rank: 2, name: "Mike Johnson", club: "Alabama Bass Chapter 12", weight: "27.3 lbs", fishCount: 5, points: 99, initials: "MJ", isDemo: role === "president" },
      { rank: 3, name: "Maria Santos", club: "River Valley IBC", weight: "26.1 lbs", fishCount: 5, points: 98, initials: "MS" },
      { rank: 4, name: "Tommy Lee", club: "Alabama Bass Chapter 12", weight: "24.5 lbs", fishCount: 5, points: 97, initials: "TL" },
      { rank: 5, name: "Jake Wilson", club: "Alabama Bass Chapter 12", weight: "23.7 lbs", fishCount: 5, points: 96, initials: "JW", isDemo: role === "jake" },
      { rank: 6, name: "Chris Anderson", club: "Tennessee Valley Anglers", weight: "22.4 lbs", fishCount: 5, points: 95, initials: "CA" },
      { rank: 7, name: "Jennifer White", club: "Trophy Cast Elite", weight: "21.8 lbs", fishCount: 5, points: 94, initials: "JW" },
      { rank: 8, name: "Robert Taylor", club: "River Valley IBC", weight: "20.6 lbs", fishCount: 4, points: 93, initials: "RT" }
    ]
  };

  // Sort defensively in case data updates live
  const liveData = useMemo(
    () => [...LIVE_LEADERBOARD].sort((a, b) => a.rank - b.rank),
    []
  );

  const currentTournamentData = tournamentLeaderboards[selectedTournament as keyof typeof tournamentLeaderboards];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Leaderboard" />

      {/* Body */}
      <div className="p-4">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="live">Live Tournament</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
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
                  const isUser = (role === "president" && angler.name === "Mike Johnson") || (role === "jake" && angler.name === "Jake Wilson");
                  const isHot = angler.name === "Jake Wilson" && angler.previousRank;

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
                              id: angler.anglerId.includes("wilson") || angler.anglerId.includes("johnson") ? "alabama-bass-chapter-12" :
                                  angler.anglerId.includes("santos") ? "river-valley" :
                                  angler.anglerId.includes("thompson") ? "trophy-cast" : "alabama-bass-nation",
                              abbreviation: angler.anglerId.includes("wilson") || angler.anglerId.includes("johnson") ? "ABC-12" :
                                           angler.anglerId.includes("santos") ? "RVIBC" :
                                           angler.anglerId.includes("thompson") ? "TCES" : "ABN-12"
                            }}
                            role="Tournament Angler"
                            city={angler.anglerId.includes("wilson") || angler.anglerId.includes("johnson") ? "Huntsville, AL" :
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

          {/* Rankings Tab */}
          <TabsContent value="rankings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-trophy-gold" />
                    <span>Tournament Rankings</span>
                  </div>
                  <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Tournament" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall-classic">Fall Classic</SelectItem>
                      <SelectItem value="presidents-cup">President's Cup</SelectItem>
                      <SelectItem value="state-championship">State Championship</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-sm text-muted-foreground">
                        <th className="text-left py-2 px-2">Rank</th>
                        <th className="text-left py-2 px-2">Angler</th>
                        <th className="text-left py-2 px-2">Club</th>
                        <th className="text-right py-2 px-2">Weight</th>
                        <th className="text-center py-2 px-2">Fish</th>
                        <th className="text-right py-2 px-2">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTournamentData.map((angler) => (
                        <tr
                          key={angler.rank}
                          className={[
                            "border-b hover:bg-accent/50 transition-colors",
                            angler.isDemo ? "bg-primary/10 border-primary/20" : ""
                          ].join(" ")}
                        >
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-center w-8">
                              {angler.rank === 1 && <Crown className="h-5 w-5 text-trophy-gold" />}
                              {angler.rank === 2 && <Medal className="h-5 w-5 text-gray-400" />}
                              {angler.rank === 3 && <Award className="h-5 w-5 text-amber-600" />}
                              {angler.rank > 3 && <span className="font-semibold text-sm">{angler.rank}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
                                {angler.initials}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm truncate">
                                  {angler.name}
                                  {angler.isDemo && <span className="ml-1 text-xs text-primary">(You)</span>}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <p className="text-sm text-muted-foreground truncate max-w-[120px]">{angler.club}</p>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <p className="font-bold text-sm">{angler.weight}</p>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <Badge variant="outline" className="text-xs">{angler.fishCount}</Badge>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <p className="font-semibold text-sm text-primary">{angler.points}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 text-center">
                  <Button variant="outline" size="sm">
                    View Full Standings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AOY */}
          <TabsContent value="aoy" className="space-y-4">
            <AOYStandings />
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Leaderboard;