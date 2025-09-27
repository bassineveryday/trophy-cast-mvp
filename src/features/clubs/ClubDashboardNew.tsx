import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, 
  Users, 
  MapPin, 
  Plus, 
  UserPlus, 
  UserMinus,
  Trophy,
  Calendar,
  Search,
  Filter
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useClubs, useCreateClub } from '@/hooks/useClubs';
import { useUserClubs, useJoinClub, useLeaveClub, useIsClubMember, useClubMembers } from '@/hooks/useClubMembership';
import { useTournamentsByClub } from '@/hooks/useTournaments';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Club } from '@/types/database';

const createClubSchema = z.object({
  name: z.string().trim().min(1, 'Club name is required').max(100, 'Name must be less than 100 characters'),
  location: z.string().trim().max(200, 'Location must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional()
});

type CreateClubFormData = z.infer<typeof createClubSchema>;

export default function ClubDashboardNew() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'member' | 'not-member'>('all');

  const { user } = useAuth();
  const { data: allClubs = [], isLoading } = useClubs();
  const { data: userClubs = [] } = useUserClubs();
  const createClubMutation = useCreateClub();

  const form = useForm<CreateClubFormData>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: '',
      location: '',
      description: ''
    }
  });

  // Real-time subscription for clubs
  useEffect(() => {
    const channel = supabase
      .channel('clubs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clubs'
        },
        () => {
          // Invalidate clubs query to refetch data
          window.location.reload(); // Simple approach - in production you'd use query invalidation
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreateClub = async (data: CreateClubFormData) => {
    try {
      await createClubMutation.mutateAsync({
        name: data.name,
        location: data.location || '',
        description: data.description || ''
      });
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating club:', error);
    }
  };

  // Filter clubs based on search and membership filter
  const filteredClubs = allClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (club.location && club.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const userClubIds = userClubs.map(uc => uc.club_id);
    const isMember = userClubIds.includes(club.id);
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'member' && isMember) ||
                         (filterType === 'not-member' && !isMember);
    
    return matchesSearch && matchesFilter;
  });

  const ClubCard = ({ club }: { club: Club }) => {
    const userClubIds = userClubs.map(uc => uc.club_id);
    const isMember = userClubIds.includes(club.id);
    
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedClub(club)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{club.name}</CardTitle>
              {club.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {club.location}
                </p>
              )}
            </div>
            {isMember && (
              <Badge className="bg-fishing-green/10 text-fishing-green border-fishing-green/20">
                Member
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {club.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {club.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>Members</span>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ClubDetailModal = ({ club }: { club: Club }) => {
    const { data: isMember = false } = useIsClubMember(club.id);
    const { data: members = [] } = useClubMembers(club.id);
    const { data: tournaments = [] } = useTournamentsByClub(club.id);
    const joinClubMutation = useJoinClub();
    const leaveClubMutation = useLeaveClub();

    const upcomingTournaments = tournaments.filter(t => new Date(t.date) >= new Date());
    const pastTournaments = tournaments.filter(t => new Date(t.date) < new Date());

    return (
      <Dialog open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {club.name}
            </DialogTitle>
            <DialogDescription>
              {club.location && (
                <span className="flex items-center gap-1 text-sm">
                  <MapPin className="w-3 h-3" />
                  {club.location}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Club Info */}
            {club.description && (
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{club.description}</p>
              </div>
            )}

            {/* Membership Actions */}
            <div className="flex gap-2">
              {isMember ? (
                <Button 
                  variant="outline" 
                  onClick={() => leaveClubMutation.mutate(club.id)}
                  disabled={leaveClubMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <UserMinus className="w-4 h-4" />
                  {leaveClubMutation.isPending ? 'Leaving...' : 'Leave Club'}
                </Button>
              ) : (
                <Button 
                  onClick={() => joinClubMutation.mutate(club.id)}
                  disabled={joinClubMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  {joinClubMutation.isPending ? 'Joining...' : 'Join Club'}
                </Button>
              )}
            </div>

            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members ({members.length})
                </TabsTrigger>
                <TabsTrigger value="tournaments" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Tournaments ({tournaments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="space-y-4">
                {members.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No members yet</p>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.profile?.avatar_url || ''} />
                            <AvatarFallback>
                              {member.profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.profile?.name || 'Unknown User'}</p>
                            <Badge variant="secondary" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tournaments" className="space-y-4">
                {tournaments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tournaments scheduled</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingTournaments.length > 0 && (
                      <div>
                        <h5 className="font-semibold mb-2 text-fishing-green">Upcoming</h5>
                        <div className="space-y-2">
                          {upcomingTournaments.map((tournament) => (
                            <div key={tournament.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium text-sm">{tournament.name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(tournament.date).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="secondary">{tournament.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {pastTournaments.length > 0 && (
                      <div>
                        <h5 className="font-semibold mb-2 text-muted-foreground">Past</h5>
                        <div className="space-y-2">
                          {pastTournaments.slice(0, 5).map((tournament) => (
                            <div key={tournament.id} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                              <div>
                                <p className="font-medium text-sm">{tournament.name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(tournament.date).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline">{tournament.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
            <Building2 className="w-8 h-8 text-primary" />
            Club Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and join fishing clubs in your area
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Club
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Club</DialogTitle>
              <DialogDescription>
                Start a new fishing club in your area
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateClub)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Lakeside Bass Anglers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Lake Guntersville, AL" {...field} />
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
                          placeholder="A friendly club for bass fishing enthusiasts..."
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
                    disabled={createClubMutation.isPending}
                  >
                    {createClubMutation.isPending ? 'Creating...' : 'Create Club'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clubs</SelectItem>
            <SelectItem value="member">My Clubs</SelectItem>
            <SelectItem value="not-member">Available to Join</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{allClubs.length}</p>
                <p className="text-sm text-muted-foreground">Total Clubs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-fishing-green" />
              <div>
                <p className="text-2xl font-bold">{userClubs.length}</p>
                <p className="text-sm text-muted-foreground">My Memberships</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-trophy-gold" />
              <div>
                <p className="text-2xl font-bold">{allClubs.filter(c => userClubs.some(uc => uc.club_id === c.id)).length}</p>
                <p className="text-sm text-muted-foreground">Active Clubs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No clubs found' : 'No clubs available'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create a club in your area!'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Club
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}

      {/* Club Detail Modal */}
      {selectedClub && <ClubDetailModal club={selectedClub} />}
    </div>
  );
}