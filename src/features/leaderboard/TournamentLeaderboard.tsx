import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Trophy, Fish, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TournamentLeaderboard() {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!tournamentId) return;
    loadData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'catches',
          filter: `tournament_id=eq.${tournamentId}`
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    // Fallback polling every 5 seconds
    const pollInterval = setInterval(loadData, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [tournamentId]);

  const loadData = async () => {
    try {
      // Load tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) throw tournamentError;
      setTournament(tournamentData);

      // Load catches and aggregate
      const { data: catches, error: catchesError } = await supabase
        .from('catches')
        .select(`
          *,
          profiles:user_id (name, avatar_url)
        `)
        .eq('tournament_id', tournamentId);

      if (catchesError) throw catchesError;

      // Aggregate by angler
      const anglerMap = new Map();
      catches?.forEach((c: any) => {
        const userId = c.user_id;
        if (!anglerMap.has(userId)) {
          anglerMap.set(userId, {
            user_id: userId,
            angler_name: c.profiles?.name || 'Unknown Angler',
            total_weight: 0,
            fish_count: 0,
            big_fish: 0,
          });
        }
        const angler = anglerMap.get(userId);
        angler.total_weight += c.weight || 0;
        angler.fish_count += 1;
        angler.big_fish = Math.max(angler.big_fish, c.weight || 0);
      });

      // Sort by total weight
      const leaderboardData = Array.from(anglerMap.values())
        .sort((a, b) => b.total_weight - a.total_weight)
        .slice(0, 10);

      setLeaderboard(leaderboardData);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading leaderboard..." />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <BackButton />
      
      <div className="max-w-2xl mx-auto mt-8">
        {tournament && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-primary" />
                {tournament.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div>{tournament.location}</div>
                <div>{new Date(tournament.date).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        )}

        <h2 className="text-xl font-heading font-bold mb-4">Live Leaderboard</h2>

        {leaderboard.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Fish className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No catches logged yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((angler, index) => (
              <Card key={angler.user_id} className={index < 3 ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-muted text-foreground'
                      }`}>
                        {index === 0 ? <Trophy className="w-5 h-5" /> : index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{angler.angler_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-3">
                          <span>{angler.fish_count} fish</span>
                          <span>Big: {angler.big_fish.toFixed(2)} lbs</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {angler.total_weight.toFixed(2)} lbs
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Updates automatically • Polling every 5s
        </div>
      </div>
    </div>
  );
}
