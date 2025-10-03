import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Award,
  Fish,
  MessageSquare,
  CheckCircle,
  Upload,
  Heart,
  MessageCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

import { useDemoMode } from '@/contexts/DemoModeContext';
import { demoTournaments } from '@/demo/demoData';
import { useTournament } from '@/hooks/useTournaments';
import { useToast } from '@/hooks/use-toast';

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { enabled: demoMode } = useDemoMode();
  const [isSubmitCatchOpen, setIsSubmitCatchOpen] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOfficer, setIsOfficer] = useState(false);
  
  // Get tournament data
  const { data: realTournament } = useTournament(tournamentId || '');
  const demoTournament = demoTournaments.find(t => t.id === tournamentId);
  const tournament: any = demoMode ? demoTournament : realTournament;

  const canRegister = tournament && new Date(tournament.date) >= new Date();
  const isActive = tournament?.status === 'active';
  const isCompleted = tournament?.status === 'completed';
  
  // Fetch registration status and participant count
  useEffect(() => {
    if (!tournamentId || demoMode) return;
    
    async function fetchRegistrationData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Check if user is club officer
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id) as any;
        
        const isOfficerRole = roleData?.some((r: any) => 
          ['president', 'vice_president', 'tournament_director', 'club_admin', 'secretary'].includes(r.club_role)
        );
        setIsOfficer(isOfficerRole || false);
        
        // Check if current user is registered
        const { data: registrationData } = await supabase
          .from('tournament_registrations')
          .select('*')
          .eq('tournament_id', tournamentId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setIsUserRegistered(!!registrationData);
        
        // Get participant count
        const { count } = await supabase
          .from('tournament_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('tournament_id', tournamentId);
        
        setParticipantCount(count || 0);
      } catch (error) {
        console.error('Error fetching registration data:', error);
      }
    }
    
    fetchRegistrationData();
  }, [tournamentId, demoMode]);
  
  // Normalize tournament data
  const tournamentData = {
    ...tournament,
    time: tournament?.time || '6:00 AM',
    registered: demoMode ? (tournament?.registered || 0) : participantCount,
    max_participants: tournament?.max_participants || 50,
    description: tournament?.description || 'Tournament details coming soon',
    rules: tournament?.rules || '5 bass limit, minimum 12 inches',
    prizes: tournament?.prizes || { first: 500, second: 300, third: 150 },
    club: {
      id: tournament?.club?.id || tournament?.club_id,
      name: tournament?.club?.name || 'Club',
      logo_url: tournament?.club?.logo_url
    }
  };

  const participants = [
    { id: '1', name: 'Jake Patterson', avatar: '/src/assets/profiles/jake-patterson.jpg', club: 'Rocky Mountain Bass', boat: 'B-12' },
    { id: '2', name: 'Sarah Johnson', avatar: '/src/assets/profiles/sarah-johnson.jpg', club: 'Colorado Bass Fed', boat: 'B-7' },
    { id: '3', name: 'Mike Rodriguez', avatar: '/src/assets/profiles/mike-rodriguez.jpg', club: 'Rocky Mountain Bass', boat: 'B-23' },
    { id: '4', name: 'Chris Wilson', avatar: '/src/assets/profiles/chris-wilson.jpg', club: null, boat: 'B-15' },
  ];

  const leaderboard = [
    { rank: 1, angler: 'Sarah Johnson', avatar: '/src/assets/profiles/sarah-johnson.jpg', weight: 18.45, fish: 5, bigFish: 5.2, lastUpdate: '30 min ago' },
    { rank: 2, angler: 'Jake Patterson', avatar: '/src/assets/profiles/jake-patterson.jpg', weight: 17.23, fish: 5, bigFish: 4.8, lastUpdate: '45 min ago' },
    { rank: 3, angler: 'Mike Rodriguez', avatar: '/src/assets/profiles/mike-rodriguez.jpg', weight: 15.67, fish: 5, bigFish: 4.1, lastUpdate: '1 hr ago' },
    { rank: 4, angler: 'Chris Wilson', avatar: '/src/assets/profiles/chris-wilson.jpg', weight: 14.32, fish: 4, bigFish: 4.5, lastUpdate: '2 hr ago' },
  ];

  const feedPosts = [
    { id: '1', author: 'Tournament Director', avatar: null, time: '2 hours ago', content: 'Weather looking perfect for tomorrow! See you all at 6 AM sharp.', likes: 12, comments: 3 },
    { id: '2', author: 'Jake Patterson', avatar: '/src/assets/profiles/jake-patterson.jpg', time: '5 hours ago', content: 'Just finished pre-fishing. Can\'t wait for tournament day! Good luck everyone 🎣', likes: 8, comments: 2, image: '/src/assets/hero-fishing.jpg' },
    { id: '3', author: 'Sarah Johnson', avatar: '/src/assets/profiles/sarah-johnson.jpg', time: '1 day ago', content: 'First time fishing Lake Powell - any tips from the locals?', likes: 15, comments: 7 },
  ];

  const handleRegister = async () => {
    if (!tournament?.id || isRegistering) return;
    
    setIsRegistering(true);
    try {
      const { error } = await supabase.rpc('register_for_tournament', {
        p_tournament_id: tournament.id
      });
      
      if (error) throw error;
      
      toast({
        title: 'Registration Successful!',
        description: `You're registered for ${tournament?.name}`,
      });
      
      // Refetch registration status and participant count
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: registrationData } = await supabase
          .from('tournament_registrations')
          .select('*')
          .eq('tournament_id', tournament.id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setIsUserRegistered(!!registrationData);
      }
      
      const { count } = await supabase
        .from('tournament_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_id', tournament.id);
      
      setParticipantCount(count || 0);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'There was an error registering for the tournament. Please try again.',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSubmitCatch = () => {
    toast({
      title: 'Catch Submitted!',
      description: 'Your catch has been added to the leaderboard.',
    });
    setIsSubmitCatchOpen(false);
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Tournament Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This tournament doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/tournaments/dashboard')}>
              Back to Tournaments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-water-blue to-fishing-green text-white">
        <div className="container mx-auto p-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate('/tournaments/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>

          <div className="flex items-start gap-6">
            {/* Club Logo */}
            <div className="w-20 h-20 rounded-lg bg-white/10 backdrop-blur-sm p-2 hidden md:flex items-center justify-center">
              {tournamentData.club?.logo_url ? (
                <img src={tournamentData.club.logo_url} alt={tournamentData.club.name} className="w-full h-full object-contain" />
              ) : (
                <Trophy className="w-10 h-10" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{tournamentData.name}</h1>
              <Link to={`/clubs/${tournamentData.club?.id}`} className="text-lg hover:underline flex items-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                {tournamentData.club?.name || 'Independent Tournament'}
              </Link>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(tournamentData.date), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{tournamentData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{tournamentData.location}</span>
                </div>
              </div>
            </div>

            {/* Registration Button */}
            <div className="hidden md:flex flex-col gap-2">
              {isOfficer && (
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 px-6"
                  onClick={() => navigate(`/tournaments/${tournamentId}/check-in`)}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Check-In
                </Button>
              )}
              {isUserRegistered ? (
                <Badge className="bg-fishing-green text-white px-6 py-3 text-lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Registered ✓
                </Badge>
              ) : canRegister ? (
                <Button 
                  size="lg"
                  className="bg-fishing-green hover:bg-fishing-green/90 text-white px-8"
                  onClick={handleRegister}
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Registering...' : 'Register Now'}
                </Button>
              ) : (
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-6 py-3 text-lg">
                  {isCompleted ? 'Completed' : 'Registration Closed'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">
              Participants ({tournamentData.registered})
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Tournament Info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Tournament Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{tournamentData.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Rules & Format</h4>
                    <p className="text-sm text-muted-foreground">{tournamentData.rules}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Award className="w-5 h-5 text-trophy-gold" />
                      Prizes & Points
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-trophy-gold/10 p-3 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">1st Place</p>
                        <p className="text-xl font-bold text-trophy-gold">${tournamentData.prizes.first}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">2nd Place</p>
                        <p className="text-xl font-bold">${tournamentData.prizes.second}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">3rd Place</p>
                        <p className="text-xl font-bold">${tournamentData.prizes.third}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Tournament Times</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Check-in</p>
                          <p className="text-muted-foreground">5:30 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Launch</p>
                          <p className="text-muted-foreground">{tournamentData.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Weigh-in</p>
                          <p className="text-muted-foreground">2:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Awards</p>
                          <p className="text-muted-foreground">3:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Entry Fee</span>
                      <span className="font-bold flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-trophy-gold" />
                        {tournamentData.entry_fee || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Participants</span>
                      <span className="font-bold">
                        {tournamentData.registered}/{tournamentData.max_participants}
                      </span>
                    </div>
                    <Progress 
                      value={(tournamentData.registered / tournamentData.max_participants) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={canRegister ? "default" : "secondary"}>
                        {tournamentData.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Water Body Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><strong>Location:</strong> {tournamentData.location}</p>
                    <p><strong>Type:</strong> Reservoir</p>
                    <p><strong>Size:</strong> 1,900 acres</p>
                    <p><strong>Depth:</strong> Max 185 ft</p>
                    <p><strong>Species:</strong> Largemouth, Smallmouth, Striped Bass</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Registered Anglers</CardTitle>
                    <Badge variant="secondary">
                      {tournamentData.registered} anglers
                    </Badge>
                  </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {participants.map((participant) => (
                    <Card key={participant.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-3">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold mb-1">{participant.name}</h4>
                        {participant.club && (
                          <p className="text-xs text-muted-foreground mb-2">{participant.club}</p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Boat {participant.boat}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            {(isActive || isCompleted) ? (
              <>
                {isActive && isUserRegistered && (
                  <div className="flex justify-end">
                    <Dialog open={isSubmitCatchOpen} onOpenChange={setIsSubmitCatchOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-fishing-green hover:bg-fishing-green/90">
                          <Upload className="w-4 h-4 mr-2" />
                          Submit My Catch
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Catch</DialogTitle>
                          <DialogDescription>
                            Add your catch to the tournament leaderboard
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Species</label>
                            <Input placeholder="Largemouth Bass" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Weight (lbs)</label>
                              <Input type="number" step="0.01" placeholder="5.25" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Length (in)</label>
                              <Input type="number" step="0.1" placeholder="18.5" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Photo</label>
                            <Input type="file" accept="image/*" />
                          </div>
                          <Button onClick={handleSubmitCatch} className="w-full">
                            Submit Catch
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Live Leaderboard</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        Last updated 3 minutes ago
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Rank</TableHead>
                          <TableHead>Angler</TableHead>
                          <TableHead className="text-right">Weight</TableHead>
                          <TableHead className="text-right">Fish</TableHead>
                          <TableHead className="text-right">Big Fish</TableHead>
                          <TableHead className="text-right">Last Update</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboard.map((entry) => (
                          <TableRow key={entry.rank}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {entry.rank === 1 && <span className="text-xl">🥇</span>}
                                {entry.rank === 2 && <span className="text-xl">🥈</span>}
                                {entry.rank === 3 && <span className="text-xl">🥉</span>}
                                {entry.rank > 3 && <span className="font-bold">{entry.rank}</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={entry.avatar} alt={entry.angler} />
                                  <AvatarFallback>{entry.angler[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{entry.angler}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {entry.weight.toFixed(2)} lbs
                            </TableCell>
                            <TableCell className="text-right">{entry.fish}</TableCell>
                            <TableCell className="text-right font-semibold text-trophy-gold">
                              {entry.bigFish.toFixed(2)} lbs
                            </TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                              {entry.lastUpdate}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Fish className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Leaderboard Not Available Yet</h3>
                  <p className="text-muted-foreground text-center">
                    The leaderboard will be available when the tournament begins.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Feed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {feedPosts.map((post) => (
                  <div key={post.id} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={post.avatar || undefined} alt={post.author} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{post.author}</p>
                            <p className="text-sm text-muted-foreground">{post.time}</p>
                          </div>
                        </div>
                        <p className="mb-3">{post.content}</p>
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Post" 
                            className="rounded-lg mb-3 max-h-64 w-full object-cover"
                          />
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-fishing-green transition-colors">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-water-blue transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
