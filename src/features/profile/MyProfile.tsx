import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { User, Trophy, Fish, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MyProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Profile load error:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get tournament count
      const { count: tournamentCount } = await supabase
        .from('catches')
        .select('tournament_id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('tournament_id', 'is', null);

      // Get total fish count
      const { count: fishCount } = await supabase
        .from('catches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get biggest catch
      const { data: catches } = await supabase
        .from('catches')
        .select('weight')
        .eq('user_id', user.id)
        .order('weight', { ascending: false })
        .limit(1);

      setStats({
        tournaments: tournamentCount || 0,
        totalFish: fishCount || 0,
        bestWeight: catches?.[0]?.weight || 0,
      });
    } catch (error: any) {
      console.error('Stats load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Angler',
        });

      if (error) throw error;

      toast({
        title: 'Profile created',
        description: 'Your profile has been created successfully',
      });

      loadProfile();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <BackButton />
      
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
        </div>

        {!profile ? (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Profile Yet</h3>
              <p className="text-muted-foreground mb-4">Create your angler profile to get started</p>
              <Button onClick={createProfile}>Create Profile</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-center">{profile.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground">
                  {profile.club && <div>Club: {profile.club}</div>}
                  {profile.city && profile.home_state && (
                    <div>{profile.city}, {profile.home_state}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-heading font-bold mb-4">Career Stats</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats?.tournaments || 0}</div>
                  <div className="text-xs text-muted-foreground">Tournaments</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Fish className="w-8 h-8 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold">{stats?.totalFish || 0}</div>
                  <div className="text-xs text-muted-foreground">Total Fish</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <div className="text-2xl font-bold">{stats?.bestWeight.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Best (lbs)</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
