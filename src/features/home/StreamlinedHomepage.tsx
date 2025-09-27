import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleBasedDashboard } from '@/components/RoleBasedDashboard';
import { OnboardingTour } from '@/components/OnboardingTour';
import { DemoUserSwitcher } from '@/components/demo/DemoUserSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';

export default function StreamlinedHomepage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  const { isDemoMode } = useDemoMode();

  useEffect(() => {
    // Check if this is a new user (in real app, this would check localStorage or user preferences)
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (!user && !isDemoMode) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome to TrophyCast</h1>
            <p className="text-muted-foreground">Please sign in to continue</p>
          </div>
          
          {/* Demo Mode Entry Point */}
          <Card className="max-w-md mx-auto border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-6 text-center">
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                Try Demo Mode
              </Badge>
              <h3 className="font-semibold mb-2">Experience TrophyCast</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Test drive the platform with demo accounts from Alabama Bass Nation - Chapter 12
              </p>
              <DemoUserSwitcher />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Demo User Switcher */}
      <DemoUserSwitcher />
      
      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Role-based Dashboard */}
      <RoleBasedDashboard />

      {/* Show Onboarding Again Option */}
      <Card className="border-dashed">
        <CardContent className="p-4 text-center">
          <CardDescription className="mb-2">
            New to TrophyCast or need a refresher?
          </CardDescription>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowOnboarding(true)}
          >
            Take the Tour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}