import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { useHybridData } from '@/hooks/useHybridData';
import { DemoContentBadge } from './DemoContentBadge';
import { DemoContentControls } from './DemoContentControls';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import UniversalAvatar from '@/components/UniversalAvatar';

interface LeaderboardEntry {
  id: string;
  weight: number;
  user_id: string;
  species: string;
  notes?: string;
  timestamp: string;
  profiles: {
    name: string;
    avatar_url?: string;
    home_state?: string;
    club?: string;
    is_demo?: boolean;
  };
}

interface EnhancedLeaderboardProps {
  tournamentId?: string;
  title?: string;
  maxEntries?: number;
}

export function EnhancedLeaderboard({ 
  tournamentId, 
  title = "Tournament Leaderboard",
  maxEntries = 10 
}: EnhancedLeaderboardProps) {
  const { getEnhancedTournamentResults, preferences } = useHybridData();
  const [results, setResults] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await getEnhancedTournamentResults(tournamentId);
        setResults(data.slice(0, maxEntries));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [tournamentId, maxEntries, getEnhancedTournamentResults, preferences]);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-trophy-gold" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{position}</div>;
    }
  };

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return <Badge className="bg-trophy-gold text-trophy-gold-foreground">1st Place</Badge>;
      case 2:
        return <Badge className="bg-gray-400 text-white">2nd Place</Badge>;
      case 3:
        return <Badge className="bg-amber-600 text-white">3rd Place</Badge>;
      default:
        return <Badge variant="outline">#{position}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            <DemoContentControls />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner message="Loading leaderboard..." />
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {title}
            <DemoContentControls />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Results Yet</h3>
          <p className="text-sm text-muted-foreground">
            Tournament results will appear here once catches are logged
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <DemoContentControls />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {results.map((entry, index) => {
          const position = index + 1;
          const isDemo = entry.profiles?.is_demo || false;
          
          return (
            <div
              key={entry.id}
              className={`
                flex items-center gap-4 p-4 rounded-lg border transition-colors
                ${position <= 3 
                  ? 'bg-gradient-to-r from-accent/50 to-transparent border-primary/20' 
                  : 'bg-card hover:bg-accent/30'
                }
              `}
            >
              {/* Position Icon */}
              <div className="flex-shrink-0">
                {getPositionIcon(position)}
              </div>

              {/* Angler Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <UniversalAvatar
                  name={entry.profiles?.name || 'Unknown Angler'}
                  photoUrl={entry.profiles?.avatar_url}
                  size="card"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">
                      {entry.profiles?.name || 'Unknown Angler'}
                    </h3>
                    {isDemo && (
                      <DemoContentBadge size="sm" variant="subtle" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {entry.profiles?.club && (
                      <span className="truncate">{entry.profiles.club}</span>
                    )}
                    {entry.profiles?.home_state && (
                      <>
                        <span>•</span>
                        <span>{entry.profiles.home_state}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Weight & Details */}
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-lg">
                  {entry.weight} lbs
                </div>
                {entry.notes && (
                  <div className="text-xs text-muted-foreground max-w-[120px] truncate">
                    {entry.notes}
                  </div>
                )}
              </div>

              {/* Position Badge */}
              <div className="flex-shrink-0">
                {getPositionBadge(position)}
              </div>
            </div>
          );
        })}

        {/* Demo Content Notice */}
        {results.some(r => r.profiles?.is_demo) && preferences.showDemoContent && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-dashed">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-4 h-4" />
              <span>
                Leaderboard includes demo profiles to showcase tournament features.
                Real tournament results will be prioritized when available.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}