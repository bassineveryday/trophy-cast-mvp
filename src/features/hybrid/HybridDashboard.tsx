import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnhancedLeaderboard } from '@/components/hybrid/EnhancedLeaderboard';
import { EnhancedClubActivity } from '@/components/hybrid/EnhancedClubActivity';
import { DemoContentControls } from '@/components/hybrid/DemoContentControls';
import { DemoRoleBasedDashboard } from '@/components/demo/DemoRoleBasedDashboard';
import { ContextAwareFloatingButton } from '@/components/voice/ContextAwareFloatingButton';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useProfileData } from '@/hooks/useProfileData';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function HybridDashboard() {
  const { user } = useAuth();
  const { isDemoMode } = useDemoMode();
  const { profile, loading } = useProfileData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Loading hybrid dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {isDemoMode ? 'Demo Experience Dashboard' : `Welcome back, ${profile?.name || user?.email?.split('@')[0] || 'Angler'}!`}
            </h1>
            {!isDemoMode && profile?.club && (
              <p className="text-muted-foreground">
                {profile.club} • {profile.home_state}
              </p>
            )}
          </div>
        </div>
        {!isDemoMode && <DemoContentControls />}
      </div>

      {isDemoMode ? (
        <DemoRoleBasedDashboard />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedLeaderboard 
            title="Recent Tournament Results"
            maxEntries={8}
          />
          <EnhancedClubActivity />
        </div>
      )}

      <ContextAwareFloatingButton />
    </div>
  );
}