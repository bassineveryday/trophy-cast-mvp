import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Plus, Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  club_id: string;
  entry_fee: number;
  participant_count?: number;
}

export default function TournamentDashboard() {
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isClubOfficer, setIsClubOfficer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user is club officer
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id) as any;
        
        const isOfficer = roleData?.some((r: any) => 
          ['president', 'vice_president', 'tournament_director', 'club_admin', 'secretary'].includes(r.role_name)
        );
        
        setIsClubOfficer(isOfficer || false);

        // Fetch tournaments filtered by user's club
        if (!profile?.club_id) {
          setIsLoading(false);
          return;
        }

        const { data: tournamentsData, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('club_id', profile.club_id)
          .order('date', { ascending: true });

        if (error) throw error;

        // Fetch participant counts for each tournament
        const tournamentsWithCounts = await Promise.all(
          (tournamentsData || []).map(async (tournament) => {
            const { count } = await supabase
              .from('tournament_registrations')
              .select('*', { count: 'exact', head: true })
              .eq('tournament_id', tournament.id);
            
            return {
              ...tournament,
              participant_count: count || 0
            };
          })
        );

        setTournaments(tournamentsWithCounts);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load tournaments'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [profile?.club_id, toast]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTournaments = tournaments.filter(t => new Date(t.date) >= today);
  const pastTournaments = tournaments.filter(t => new Date(t.date) < today);

  const TournamentCard = ({ tournament }: { tournament: Tournament }) => (
    <Link to={`/tournaments/${tournament.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{tournament.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-water-blue" />
            <span>{format(new Date(tournament.date), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-fishing-green" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{tournament.participant_count} participant{tournament.participant_count !== 1 ? 's' : ''}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-water-blue" />
            Tournament Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your club tournaments
          </p>
        </div>
      </div>

      {tournaments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No tournaments yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              {isClubOfficer 
                ? 'Create your first tournament to get started'
                : 'Check back soon for upcoming tournaments'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" defaultValue={["upcoming", "past"]} className="space-y-4">
          <AccordionItem value="upcoming" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-water-blue" />
                <span className="text-lg font-semibold">
                  Upcoming Tournaments ({upcomingTournaments.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {upcomingTournaments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming tournaments scheduled
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
                  {upcomingTournaments.map((tournament) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="past" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-fishing-green" />
                <span className="text-lg font-semibold">
                  Past Tournaments ({pastTournaments.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {pastTournaments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No past tournaments
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
                  {pastTournaments.map((tournament) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {isClubOfficer && (
        <Button 
          className="fixed bottom-8 right-8 z-50 h-14 rounded-full shadow-lg bg-water-blue hover:bg-water-blue/90 text-white"
          size="lg"
          onClick={() => toast({
            title: 'Coming Soon',
            description: 'Tournament creation will be available soon'
          })}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Tournament
        </Button>
      )}
    </div>
  );
}
