import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trophy, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AOYStanding {
  member_id: string;
  member_name: string;
  boater_status: string;
  total_aoy_points: number;
  aoy_rank: number;
  season_year: number;
  avatar_url?: string;
}

interface UserStats extends AOYStanding {
  user_id?: string;
}

export default function AOYStandings() {
  const { toast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState('2025');
  const [standings, setStandings] = useState<AOYStanding[]>([]);
  const [rookieStandings, setRookieStandings] = useState<AOYStanding[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedSeason]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Fetch AOY standings from view with profile data
      const { data: standingsData, error: standingsError } = await supabase
        .from('aoy_standings')
        .select(`
          *,
          profiles:member_id (
            avatar_url
          )
        `)
        .eq('season_year', parseInt(selectedSeason))
        .order('aoy_rank', { ascending: true });

      if (standingsError) throw standingsError;

      // Map the data to include avatar_url from profiles
      const mappedStandings = standingsData?.map(s => ({
        ...s,
        avatar_url: (s as any).profiles?.avatar_url || null
      })) || [];

      setStandings(mappedStandings);

      // Find current user's stats
      if (user) {
        const userStanding = mappedStandings?.find(s => s.member_id === user.id);
        if (userStanding) {
          setUserStats(userStanding as UserStats);
        }
      }

      // For now, rookies will be empty since is_rookie field doesn't exist
      // This can be updated when the field is added to the database
      setRookieStandings([]);

    } catch (error) {
      console.error('Error fetching AOY data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load AOY standings',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🏆</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="font-semibold">{rank}</span>;
  };

  const getRowBackground = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'border-l-4 border-l-water-blue bg-water-blue/10';
    }
    if (rank === 1) return 'bg-gradient-to-r from-[#FFD700]/20 to-transparent';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300/20 to-transparent';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-transparent';
    return '';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">Loading AOY standings...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Season Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-trophy-gold" />
          Angler of the Year
        </h2>
        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Personal Stats Card */}
      {userStats && (
        <Card className="border-water-blue/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">Your AOY Standing</span>
              <Badge variant="outline" className="text-base px-3 py-1">
                Rank #{userStats.aoy_rank}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-water-blue">{userStats.aoy_rank}</div>
              <div className="text-sm text-muted-foreground mt-1">Current Rank</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-trophy-gold">{userStats.total_aoy_points || 0}</div>
                <div className="text-xs text-muted-foreground">AOY Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold">—</div>
                <div className="text-xs text-muted-foreground">Events Fished</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-fishing-green">—</div>
                <div className="text-xs text-muted-foreground">Events Counted</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to Qualification</span>
                <span className="font-semibold text-muted-foreground">
                  Data coming soon
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-trophy-gold" />
            Full Standings - {selectedSeason} Season
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead className="text-right">AOY Points</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No standings data for {selectedSeason} season
                    </TableCell>
                  </TableRow>
                ) : (
                  standings.map((standing) => {
                    const isCurrentUser = currentUserId === standing.member_id;
                    return (
                      <TableRow
                        key={standing.member_id}
                        className={getRowBackground(standing.aoy_rank, isCurrentUser)}
                      >
                        <TableCell className="text-center">
                          {getRankDisplay(standing.aoy_rank)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={standing.avatar_url || ''} alt={standing.member_name} />
                              <AvatarFallback>{standing.member_name?.[0] || 'A'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {standing.member_name || 'Unknown'}
                                {isCurrentUser && (
                                  <span className="text-xs text-water-blue font-semibold">(You)</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{standing.boater_status}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="text-lg font-bold text-trophy-gold">
                            {standing.total_aoy_points || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="font-semibold">
                            {standing.boater_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Rookie of the Year Section */}
      {rookieStandings.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="rookie" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-semibold">
                  Rookie of the Year Race ({rookieStandings.length} Rookies)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-center py-8 text-muted-foreground">
                Rookie of the Year data will be available when the is_rookie field is populated in the database.
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
