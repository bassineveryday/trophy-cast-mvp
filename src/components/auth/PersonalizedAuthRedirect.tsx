import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { usePersonalizedNavigation } from '@/hooks/usePersonalizedNavigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PersonalizedLoadingSpinner } from '@/components/ui/PersonalizedLoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Calendar, FileText, DollarSign, Leaf, User, ArrowRight } from 'lucide-react';

const roleIcons = {
  president: Crown,
  vice_president: Shield,
  tournament_director: Calendar,
  secretary: FileText,
  treasurer: DollarSign,
  conservation_director: Leaf,
  member: User
};

interface PersonalizedAuthRedirectProps {
  children: React.ReactNode;
}

export function PersonalizedAuthRedirect({ children }: PersonalizedAuthRedirectProps) {
  const { user, profile, loading } = useAuth();
  const { isDemoMode, currentDemoUser } = useDemoMode();
  const { getPersonalizedRoute, getNavigationReason, isReady } = usePersonalizedNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && (user || isDemoMode)) {
      // Get stored intended route or current location
      const intendedRoute = sessionStorage.getItem('trophycast_intended_route') || 
                           (location.state as any)?.from;
      
      const targetRoute = getPersonalizedRoute(intendedRoute);
      
      // Only redirect if we're not already on the target route and we have a valid target
      if (location.pathname !== targetRoute && targetRoute && isReady) {
        setRedirecting(true);
        
        // Clear stored route
        sessionStorage.removeItem('trophycast_intended_route');
        
        // Small delay to show personalization message
        setTimeout(() => {
          navigate(targetRoute, { replace: true });
        }, 1500);
      }
    }
  }, [user, profile, isDemoMode, currentDemoUser, loading, isReady, location, navigate, getPersonalizedRoute]);

  // Show personalized loading screen during redirect
  if (redirecting || (user && !isReady)) {
    const displayUser = currentDemoUser || profile;
    const userName = displayUser?.name || user?.email?.split('@')[0] || 'User';
    const userRole = currentDemoUser?.club_role || 'member';
    const RoleIcon = roleIcons[userRole as keyof typeof roleIcons] || User;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/95 backdrop-blur border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <RoleIcon className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">Welcome back, {userName}!</CardTitle>
            <CardDescription>
              {isDemoMode && (
                <Badge variant="secondary" className="mb-2 bg-orange-100 text-orange-800 border-orange-200">
                  Demo Mode
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <PersonalizedLoadingSpinner size="sm" message="" />
              <div className="flex-1">
                <p className="text-sm font-medium">Personalizing your experience...</p>
                <p className="text-xs text-muted-foreground">
                  {getNavigationReason()}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            
            {isDemoMode && currentDemoUser && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800 text-center">
                  Loading <strong>{currentDemoUser.club_role.replace('_', ' ')}</strong> experience for <strong>{currentDemoUser.club}</strong>
                </p>
              </div>
            )}
            
            <p className="text-xs text-center text-muted-foreground">
              Setting up your dashboard with club context and role permissions...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}