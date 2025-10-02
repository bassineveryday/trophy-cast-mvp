import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Plus,
  Medal,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { useDemoMode } from '@/contexts/DemoModeContext';
import { demoTournaments } from '@/demo/demoData';
import { useTournaments } from '@/hooks/useTournaments';
import { useIsClubOfficer } from '@/hooks/useRoles';
import { format } from 'date-fns';

type SortOption = 'date' | 'name' | 'distance' | 'registrations';

export default function TournamentDashboard() {
  const { enabled: demoMode } = useDemoMode();
  const { data: realTournaments = [], isLoading } = useTournaments();
  const isClubOfficer = useIsClubOfficer();
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Use demo data if in demo mode, otherwise use real data
  const tournaments = demoMode ? demoTournaments : realTournaments;

  // Filter tournaments by status
  const now = new Date();
  const upcoming = tournaments.filter((t: any) => {
    const tDate = new Date(t.date);
    return (t.status === 'open' || t.status === 'upcoming') && tDate >= now;
  });
  const active = tournaments.filter((t: any) => t.status === 'active');
  const past = tournaments.filter((t: any) => {
    const tDate = new Date(t.date);
    return t.status === 'completed' || tDate < now;
  });

  // Mock user stats (in real app, fetch from API)
  const userStats = {
    totalTournaments: 24,
    bestFinish: "2nd",
    totalPoints: 1850,
    seasonRank: "#5 in Colorado"
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'Open Registration', color: 'bg-fishing-green text-white', icon: CheckCircle },
      closed: { label: 'Registration Closed', color: 'bg-yellow-500 text-white', icon: XCircle },
      active: { label: 'In Progress', color: 'bg-water-blue text-white', icon: AlertCircle },
      completed: { label: 'Completed', color: 'bg-muted text-muted-foreground', icon: CheckCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    const Icon = config.icon;
    return (
      <Badge className={cn('flex items-center gap-1', config.color)}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const TournamentCard = ({ tournament }: { tournament: any }) => {
    const registrationProgress = (tournament.registered / tournament.max_participants) * 100;
    const isUserRegistered = Math.random() > 0.5; // Mock - in real app check actual registration

    return (
      <Card className="hover:shadow-lg transition-shadow overflow-hidden group">
        {/* Banner Image */}
        <div className="h-48 bg-gradient-to-br from-water-blue/20 to-fishing-green/20 relative overflow-hidden">
          <img 
            src="/src/assets/hero-fishing.jpg" 
            alt={tournament.name}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            {getStatusBadge(tournament.status)}
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">{tournament.name}</CardTitle>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(tournament.date), 'MMM dd, yyyy')} • {tournament.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{tournament.location}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Host Club */}
          <Link 
            to={`/clubs/${tournament.club?.id || 'club'}`}
            className="flex items-center gap-2 hover:underline"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {tournament.club?.logo_url ? (
                <img src={tournament.club.logo_url} alt={tournament.club.name} className="w-full h-full object-cover" />
              ) : (
                <Trophy className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <span className="text-sm font-medium">{tournament.club?.name || 'Independent'}</span>
          </Link>

          {/* Registration Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                <Users className="w-3 h-3 inline mr-1" />
                {tournament.registered}/{tournament.max_participants} registered
              </span>
              <span className="font-medium">{Math.round(registrationProgress)}%</span>
            </div>
            <Progress value={registrationProgress} className="h-2" />
          </div>

          {/* Entry Fee & Action */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <DollarSign className="w-4 h-4 text-trophy-gold" />
              ${tournament.entry_fee}
            </div>
            <Link to={`/tournaments/${tournament.id}`}>
              <Button 
                size="sm"
                variant={isUserRegistered ? "outline" : "default"}
                className={!isUserRegistered ? "bg-fishing-green hover:bg-fishing-green/90" : ""}
              >
                {isUserRegistered ? "View Details" : "Register"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ title, description, showCreate }: { title: string; description: string; showCreate?: boolean }) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Trophy className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-4 max-w-md">{description}</p>
        {showCreate && isClubOfficer && (
          <Button className="bg-trophy-gold hover:bg-trophy-gold/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Tournament
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading && !demoMode) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Trophy className="w-10 h-10 text-trophy-gold" />
            My Tournaments
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and register for fishing tournaments
          </p>
        </div>
        
        {isClubOfficer && (
          <Button className="bg-trophy-gold hover:bg-trophy-gold/90 font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Create Tournament
          </Button>
        )}
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tournaments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-water-blue" />
              <span className="text-3xl font-bold">{userStats.totalTournaments}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Finish
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-trophy-gold" />
              <span className="text-3xl font-bold">{userStats.bestFinish} Place</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Season Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-fishing-green" />
              <span className="text-3xl font-bold">{userStats.totalPoints.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Season Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-trophy-gold" />
              <span className="text-3xl font-bold">{userStats.seasonRank}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Tabs */}
      <div className="flex items-center justify-between gap-4">
        <Tabs defaultValue="upcoming" className="flex-1">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Active ({active.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Past ({past.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              All ({tournaments.length})
            </TabsTrigger>
          </TabsList>

          {/* Sort Controls */}
          <div className="flex justify-end mt-4">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="registrations">Registrations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="upcoming" className="mt-6">
            {upcoming.length === 0 ? (
              <EmptyState 
                title="No Upcoming Tournaments"
                description="Check back soon for new tournaments!"
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((tournament: any) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {active.length === 0 ? (
              <EmptyState 
                title="No Active Tournaments"
                description="No tournaments are currently in progress."
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {active.map((tournament: any) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {past.length === 0 ? (
              <EmptyState 
                title="No Past Tournaments"
                description="Tournament history will appear here once tournaments are completed."
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((tournament: any) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            {tournaments.length === 0 ? (
              <EmptyState 
                title="No Tournaments Yet"
                description="No tournaments yet - create your first club tournament!"
                showCreate
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tournaments.map((tournament: any) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
