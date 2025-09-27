import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { usePersonalizedNavigation } from '@/hooks/usePersonalizedNavigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PersonalizedLoadingSpinner } from '@/components/ui/PersonalizedLoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Calendar, FileText, DollarSign, Leaf, User, ArrowRight, SkipForward } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const roleIcons = {
  president: Crown,
  vice_president: Shield,
  tournament_director: Calendar,
  secretary: FileText,
  treasurer: DollarSign,
  conservation_director: Leaf,
  member: User
};

// Normalize and display role names properly
const formatRoleName = (role: string): string => {
  if (!role) return 'Member';
  return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Validate if a route is safe and valid
const isValidRoute = (route: string): boolean => {
  if (!route || typeof route !== 'string') return false;
  return route.startsWith('/') && route !== '/auth' && !route.includes('undefined');
};

// Get specific loading message based on state
const getLoadingMessage = (isDemoMode: boolean, currentDemoUser: any, isLoadingData: boolean): string => {
  if (isDemoMode && currentDemoUser) {
    const role = formatRoleName(currentDemoUser.club_role || 'member');
    if (['President', 'Tournament Director', 'Secretary', 'Treasurer'].includes(role)) {
      return `Checking ${role.toLowerCase()} permissions...`;
    }
    return 'Validating demo user...';
  }
  
  if (isLoadingData) {
    return 'Checking club permissions...';
  }
  
  return 'Personalizing your experience...';
};

interface PersonalizedAuthRedirectProps {
  children: React.ReactNode;
}

export function PersonalizedAuthRedirect({ children }: PersonalizedAuthRedirectProps) {
  const { user, profile, loading } = useAuth();
  const { isDemoMode, currentDemoUser } = useDemoMode();
  const { getPersonalizedRoute, getNavigationReason, isReady, isLoadingData } = usePersonalizedNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [redirecting, setRedirecting] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const [showSkipButton, setShowSkipButton] = useState(false);

  // Safe getters with fallbacks
  const safeGetNavigationReason = useCallback(() => {
    try {
      const reason = getNavigationReason();
      return reason || 'Loading your personalized profile';
    } catch (error) {
      console.warn('Navigation reason fetch failed:', error);
      return 'Loading your personalized profile';
    }
  }, [getNavigationReason]);

  const safeGetPersonalizedRoute = useCallback((intendedRoute?: string) => {
    try {
      const route = getPersonalizedRoute(intendedRoute);
      return isValidRoute(route) ? route : '/profile';
    } catch (error) {
      console.warn('Personalized route fetch failed:', error);
      return '/profile';
    }
  }, [getPersonalizedRoute]);

  // Handle sessionStorage with validation
  const getIntendedRoute = useCallback(() => {
    try {
      const stored = sessionStorage.getItem('trophycast_intended_route');
      const fromState = (location.state as any)?.from;
      
      const intendedRoute = stored || fromState;
      
      // Validate the intended route
      if (intendedRoute && isValidRoute(intendedRoute)) {
        return intendedRoute;
      }
      
      // Clear invalid stored route
      if (stored && !isValidRoute(stored)) {
        sessionStorage.removeItem('trophycast_intended_route');
      }
      
      return null;
    } catch (error) {
      console.warn('Session storage access failed:', error);
      return null;
    }
  }, [location.state]);

  // Show skip button after 1.5 seconds
  useEffect(() => {
    if ((user || isDemoMode) && !isReady && !forceFallback && !redirecting) {
      const skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 1500);

      return () => clearTimeout(skipButtonTimer);
    } else {
      setShowSkipButton(false);
    }
  }, [user, isDemoMode, isReady, forceFallback, redirecting]);

  // Force fallback after timeout
  useEffect(() => {
    if ((user || isDemoMode) && !isReady && !forceFallback) {
      if (!loadingStartTime) {
        setLoadingStartTime(Date.now());
      }
      
      const timeoutId = setTimeout(() => {
        if (!isReady) {
          console.warn('PersonalizedAuthRedirect: Forcing fallback after 2s timeout');
          setForceFallback(true);
          
          toast({
            title: "Loading Timeout",
            description: "Club data missing, loading fallback profile",
            variant: "destructive"
          });
          
          navigate('/profile', { replace: true });
        }
      }, 2000); // 2 second timeout as requested

      return () => clearTimeout(timeoutId);
    }
  }, [user, isDemoMode, isReady, forceFallback, loadingStartTime, navigate, toast]);

  // Handle skip to profile
  const handleSkipToProfile = useCallback(() => {
    console.log('User requested skip to profile');
    setForceFallback(true);
    
    toast({
      title: "Skipped to Profile",
      description: "You can access club features from the navigation menu",
      variant: "default"
    });
    
    navigate('/profile', { replace: true });
  }, [navigate, toast]);

  // Main navigation logic
  useEffect(() => {
    // Skip if we've already forced a fallback
    if (forceFallback) return;
    
    // Don't attempt navigation if still loading auth or critical data
    if (loading || isLoadingData) {
      return;
    }

    if (user || isDemoMode) {
      const intendedRoute = getIntendedRoute();
      const targetRoute = safeGetPersonalizedRoute(intendedRoute);
      
      // Validate target route
      if (!isValidRoute(targetRoute)) {
        console.error('Invalid target route generated:', targetRoute);
        navigate('/profile', { replace: true });
        return;
      }

      // Only redirect if we're not already on the target route and we're ready
      if (location.pathname !== targetRoute && isReady) {
        setRedirecting(true);
        
        // Enhanced logging for successful redirects
        const userInfo = currentDemoUser 
          ? `${formatRoleName(currentDemoUser.club_role)} (${currentDemoUser.name})`
          : profile?.name || user?.email?.split('@')[0] || 'User';
        
        console.log(`🎯 PersonalizedAuthRedirect: Redirecting ${userInfo} to ${targetRoute}`);
        
        // Clear stored route
        try {
          sessionStorage.removeItem('trophycast_intended_route');
        } catch (error) {
          console.warn('Failed to clear session storage:', error);
        }
        
        // Reduced delay for better UX
        setTimeout(() => {
          navigate(targetRoute, { replace: true });
        }, 800);
      }
    }
  }, [
    user, 
    profile, 
    isDemoMode, 
    currentDemoUser, 
    loading, 
    isLoadingData, 
    isReady, 
    location.pathname, 
    navigate, 
    safeGetPersonalizedRoute,
    getIntendedRoute,
    forceFallback
  ]);

  // Determine if we should show loading screen
  const shouldShowLoading = () => {
    if (forceFallback) return false;
    if (redirecting) return true;
    if (isLoadingData) return true;
    if ((user || isDemoMode) && !isReady) return true;
    return false;
  };

  // Calculate progress percentage (0-100) for exactly 2 seconds
  const getProgressPercentage = () => {
    if (!loadingStartTime) return 0;
    const elapsed = Date.now() - loadingStartTime;
    return Math.min(100, (elapsed / 2000) * 100);
  };

  // Show personalized loading screen with animations
  if (shouldShowLoading()) {
    const displayUser = currentDemoUser || profile;
    const userName = displayUser?.name || user?.email?.split('@')[0] || 'User';
    const userRole = currentDemoUser?.club_role || 'member';
    const RoleIcon = roleIcons[userRole as keyof typeof roleIcons] || User;
    
    // Safe demo user display with null checks
    const demoRoleDisplay = currentDemoUser?.club_role ? formatRoleName(currentDemoUser.club_role) : 'Member';
    const demoClubDisplay = currentDemoUser?.club || 'TrophyCast Club';
    const loadingMessage = getLoadingMessage(isDemoMode, currentDemoUser, isLoadingData);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/95 backdrop-blur border-primary/20 animate-fade-in">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4 animate-scale-in">
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
                <p className="text-sm font-medium">{loadingMessage}</p>
                <p className="text-xs text-muted-foreground">
                  {safeGetNavigationReason()}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            
            {isDemoMode && currentDemoUser && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg animate-fade-in">
                <p className="text-xs text-orange-800 text-center">
                  Loading <strong>{demoRoleDisplay}</strong> experience for <strong>{demoClubDisplay}</strong>
                </p>
              </div>
            )}
            
            {/* Progress Bar - reaches exactly 100% at 2 seconds */}
            {loadingStartTime && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Setting up your profile with club context and role permissions...
                </p>
              </div>
            )}
            
            {/* Skip Button after 1.5 seconds */}
            {showSkipButton && !redirecting && (
              <div className="animate-fade-in">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkipToProfile}
                  className="w-full text-xs hover-scale"
                >
                  <SkipForward className="w-3 h-3 mr-2" />
                  Skip to Profile
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  Access club features from the navigation menu
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}