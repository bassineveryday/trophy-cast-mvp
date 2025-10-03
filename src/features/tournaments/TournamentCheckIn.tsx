import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Trophy, Calendar, Users, CheckCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Registration {
  user_id: string;
  checked_in: boolean;
  checked_in_at: string | null;
  profiles: {
    avatar_url: string | null;
    name: string;
  };
}

interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
}

export default function TournamentCheckIn() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isOfficer, setIsOfficer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isStartingEvent, setIsStartingEvent] = useState(false);
  const [eventStarted, setEventStarted] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate(`/tournaments/${tournamentId}`);
          return;
        }

        // Check if user is club officer
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id) as any;
        
        const isOfficerRole = roleData?.some((r: any) => 
          ['president', 'vice_president', 'tournament_director', 'club_admin', 'secretary'].includes(r.role_name)
        );

        if (!isOfficerRole) {
          toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: 'Only club officers can access check-in',
          });
          navigate(`/tournaments/${tournamentId}`);
          return;
        }

        setIsOfficer(true);
        await fetchData();
      } catch (error) {
        console.error('Error checking access:', error);
        navigate(`/tournaments/${tournamentId}`);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [tournamentId, navigate, toast]);

  const fetchData = async () => {
    if (!tournamentId) return;

    try {
      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) throw tournamentError;
      setTournament(tournamentData);

      // Fetch registrations with profile data
      const { data: registrationsData, error: registrationsError } = await supabase
        .from('tournament_registrations')
        .select(`
          user_id,
          checked_in,
          checked_in_at,
          profiles:user_id (
            avatar_url,
            name
          )
        `)
        .eq('tournament_id', tournamentId);

      if (registrationsError) throw registrationsError;
      setRegistrations(registrationsData as any);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load check-in data',
      });
    }
  };

  const handleCheckInToggle = async (userId: string, currentStatus: boolean) => {
    if (!tournamentId) return;

    try {
      const { error } = await supabase.rpc('check_in_angler', {
        p_tournament_id: tournamentId,
        p_user_id: userId,
        p_is_checked_in: !currentStatus,
      });

      if (error) throw error;

      // Update local state
      setRegistrations(prev =>
        prev.map(reg =>
          reg.user_id === userId
            ? {
                ...reg,
                checked_in: !currentStatus,
                checked_in_at: !currentStatus ? new Date().toISOString() : null,
              }
            : reg
        )
      );

      toast({
        title: 'Updated',
        description: `Check-in status updated`,
      });
    } catch (error) {
      console.error('Error updating check-in:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update check-in status',
      });
    }
  };

  const handleStartEvent = async () => {
    if (!tournamentId || isStartingEvent || eventStarted) return;

    setIsStartingEvent(true);
    try {
      // Create event for today
      const { data: eventId, error: createError } = await supabase.rpc(
        'create_event_for_today',
        { p_tournament_id: tournamentId }
      );

      if (createError) throw createError;

      // Seed entries for the event
      const { error: seedError } = await supabase.rpc('seed_entries_for_event', {
        p_event_id: eventId,
      });

      if (seedError) throw seedError;

      setEventStarted(true);
      toast({
        title: 'Event Started!',
        description: `Event ID: ${eventId}`,
      });
    } catch (error) {
      console.error('Error starting event:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start event',
      });
    } finally {
      setIsStartingEvent(false);
    }
  };

  const checkedInCount = registrations.filter(r => r.checked_in).length;
  const totalCount = registrations.length;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!isOfficer || !tournament) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-water-blue to-fishing-green text-white">
        <div className="container mx-auto p-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate(`/tournaments/${tournamentId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournament
          </Button>

          <div className="flex items-center gap-4">
            <Trophy className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(tournament.date), 'MMMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-water-blue" />
                Check-In Status
              </CardTitle>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {checkedInCount} / {totalCount} checked in
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="w-full bg-fishing-green hover:bg-fishing-green/90 text-white"
              onClick={handleStartEvent}
              disabled={isStartingEvent || eventStarted}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {eventStarted ? 'Event Started' : isStartingEvent ? 'Starting...' : 'Start Event for Today'}
            </Button>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead className="text-center">Checked In</TableHead>
                  <TableHead>Check-In Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No registered members
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.map((registration) => (
                    <TableRow key={registration.user_id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={registration.profiles?.avatar_url || ''}
                            alt={registration.profiles?.name || 'Member'}
                          />
                          <AvatarFallback>
                            {registration.profiles?.name?.[0] || 'M'}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {registration.profiles?.name || 'Unknown Member'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={registration.checked_in}
                            onCheckedChange={() =>
                              handleCheckInToggle(registration.user_id, registration.checked_in)
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {registration.checked_in_at
                          ? format(new Date(registration.checked_in_at), 'h:mm a')
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
