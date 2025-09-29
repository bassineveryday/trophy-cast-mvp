import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Trophy, Calendar, MapPin, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MyTournaments() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('created_by', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
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
    return <LoadingSpinner message="Loading tournaments..." />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <BackButton />
      
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-heading font-bold">My Tournaments</h1>
          <Link to="/host/new-tournament">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Tournament
            </Button>
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No tournaments hosted yet</p>
              <Link to="/host/new-tournament">
                <Button>Create Your First Tournament</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <Link key={tournament.id} to={`/leaderboard/${tournament.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{tournament.name}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(tournament.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {tournament.location}
                          </div>
                        </div>
                        {tournament.entry_fee > 0 && (
                          <div className="mt-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              ${tournament.entry_fee} entry
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded">
                        {tournament.status}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
