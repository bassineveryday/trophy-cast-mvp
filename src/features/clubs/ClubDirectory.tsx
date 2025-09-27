import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MapPin, 
  Trophy, 
  Search,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDemoAwareRoles } from '@/hooks/useDemoRoles';

const mockClubs = [
  {
    id: 'demo-alabama-bass-chapter-12',
    name: 'Alabama Bass Nation - Chapter 12',
    location: 'Huntsville, AL',
    memberCount: 47,
    description: 'Official Alabama Bass Nation chapter focused on tournament fishing and conservation',
    recentTournaments: 12,
    isDemo: true,
    logo: '/src/assets/alabama-bass-logo.png'
  },
  {
    id: 'river-valley-independent',
    name: 'River Valley Independent Bass Club',
    location: 'Tennessee Valley, AL',
    memberCount: 32,
    description: 'Independent bass fishing club covering Tennessee Valley waters',
    recentTournaments: 8,
    isDemo: false,
    logo: '/src/assets/river-valley-logo.png'
  },
  {
    id: 'trophy-cast-fishing',
    name: 'Trophy Cast Fishing Club',
    location: 'Birmingham, AL',
    memberCount: 28,
    description: 'Competitive fishing club specializing in large mouth bass tournaments',
    recentTournaments: 6,
    isDemo: false,
    logo: '/src/assets/trophy-cast-logo.png'
  }
];

export default function ClubDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isDemoMode, currentDemoUser } = useDemoAwareRoles();

  const filteredClubs = mockClubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserClub = () => {
    if (isDemoMode && currentDemoUser) {
      return mockClubs.find(club => club.id === 'demo-alabama-bass-chapter-12');
    }
    return null;
  };

  const userClub = getUserClub();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Club Directory
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and connect with bass fishing clubs
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clubs by name, location, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* User's Club (if in demo mode) */}
      {userClub && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-primary">Your Club</h2>
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{userClub.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {userClub.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {userClub.memberCount} members
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Your Club
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                {userClub.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-trophy-gold" />
                    {userClub.recentTournaments} tournaments this year
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link to="/clubs">
                    <Button variant="outline" size="sm">
                      Club Hub
                    </Button>
                  </Link>
                  {isDemoMode && currentDemoUser?.club_role === 'president' && (
                    <Link to={`/clubs/${userClub.id}/manage`}>
                      <Button size="sm">
                        Manage Club
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Clubs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {userClub ? 'Other Clubs' : 'All Clubs'} ({filteredClubs.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{club.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {club.location}
                      </div>
                    </div>
                  </div>
                  {club.isDemo && (
                    <Badge variant="outline" className="text-xs">
                      Demo
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {club.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {club.memberCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {club.recentTournaments}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredClubs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Clubs Found</h3>
            <p className="text-muted-foreground text-center">
              No clubs match your search criteria. Try adjusting your search terms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}