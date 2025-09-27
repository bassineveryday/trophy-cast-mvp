import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trophy, 
  MapPin, 
  DollarSign, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { useDemoAwareRoles } from '@/hooks/useDemoRoles';
import { useTournaments, useCreateTournament } from '@/hooks/useTournaments';
import { useClubs } from '@/hooks/useClubs';
import type { Tournament } from '@/types/database';
import { mockTournaments } from '@/data/mockData';

const createTournamentSchema = z.object({
  name: z.string().trim().min(1, 'Tournament name is required').max(100, 'Name must be less than 100 characters'),
  date: z.date({ required_error: 'Tournament date is required' }),
  location: z.string().trim().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  club_id: z.string().optional(),
  entry_fee: z.number().min(0, 'Entry fee must be positive').max(10000, 'Entry fee must be reasonable'),
  status: z.enum(['upcoming', 'active', 'completed', 'cancelled']).default('upcoming'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional()
});

type CreateTournamentFormData = z.infer<typeof createTournamentSchema>;

export default function TournamentDashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: tournaments = [], isLoading } = useTournaments();
  const { data: clubs = [] } = useClubs();
  const { isClubOfficer, isDemoMode } = useDemoAwareRoles();
  const createTournamentMutation = useCreateTournament();

  // Use mock data in demo mode, real data otherwise
  const displayTournaments = isDemoMode ? mockTournaments.map((t, index) => ({
    id: t.id,
    name: t.name,
    date: t.date,
    location: t.name, // Use name as location for mock data
    entry_fee: parseInt(t.fee.replace('$', '')),
    status: 'upcoming' as const,
    club: { name: t.club },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    club_id: index === 0 ? 'demo-alabama-bass-chapter-12' : 'other-club'
  })) : tournaments;

  const form = useForm<CreateTournamentFormData>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: '',
      location: '',
      entry_fee: 0,
      status: 'upcoming',
      description: ''
    }
  });

  // Separate tournaments by status and date
  const now = new Date();
  const upcomingTournaments = displayTournaments.filter(t => 
    t.status === 'upcoming' && new Date(t.date) >= now
  );
  const pastTournaments = displayTournaments.filter(t => 
    t.status === 'completed' || new Date(t.date) < now
  );
  const activeTournaments = displayTournaments.filter(t => t.status === 'active');

  const handleCreateTournament = async (data: CreateTournamentFormData) => {
    try {
      await createTournamentMutation.mutateAsync({
        name: data.name,
        date: format(data.date, 'yyyy-MM-dd'),
        location: data.location,
        club_id: data.club_id,
        entry_fee: data.entry_fee,
        status: data.status
      });
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="w-4 h-4 text-water-blue" />;
      case 'active': return <AlertCircle className="w-4 h-4 text-trophy-gold" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-fishing-green" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-water-blue/10 text-water-blue border-water-blue/20';
      case 'active': return 'bg-trophy-gold/10 text-trophy-gold border-trophy-gold/20';
      case 'completed': return 'bg-fishing-green/10 text-fishing-green border-fishing-green/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const TournamentCard = ({ tournament }: { tournament: Tournament }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{tournament.name}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {isDemoMode ? tournament.date : format(new Date(tournament.date), 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {tournament.location}
              </span>
            </div>
          </div>
          <Badge className={cn('flex items-center gap-1', getStatusColor(tournament.status))}>
            {getStatusIcon(tournament.status)}
            {tournament.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {tournament.club && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {tournament.club.name}
              </span>
            )}
            {tournament.entry_fee && tournament.entry_fee > 0 && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                ${tournament.entry_fee}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-trophy-gold" />
            Tournament Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track fishing tournaments
          </p>
        </div>
        
        {isClubOfficer && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Tournament</DialogTitle>
                <DialogDescription>
                  Set up a new fishing tournament for your club
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateTournament)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tournament Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Spring Bass Tournament 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tournament Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Lake Guntersville, AL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="club_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a club" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clubs.map((club) => (
                              <SelectItem key={club.id} value={club.id}>
                                {club.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="entry_fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Fee ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="50.00"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control} 
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tournament details, rules, prizes..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createTournamentMutation.isPending}
                    >
                      {createTournamentMutation.isPending ? 'Creating...' : 'Create Tournament'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tournament Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Upcoming ({upcomingTournaments.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Active ({activeTournaments.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Past ({pastTournaments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTournaments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Tournaments</h3>
                <p className="text-muted-foreground text-center mb-4">
                  There are no tournaments scheduled for the future.
                </p>
                {isClubOfficer && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Tournament
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeTournaments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Tournaments</h3>
                <p className="text-muted-foreground text-center">
                  There are no tournaments currently running.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastTournaments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Tournaments</h3>
                <p className="text-muted-foreground text-center">
                  Tournament history will appear here once tournaments are completed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}