import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useUserEffectiveRoles } from '@/hooks/useRBAC';
import { useUserClubs } from '@/hooks/useClubMembership';
import { useToast } from '@/hooks/use-toast';

export interface PersonalizedDestination {
  route: string;
  reason: string;
}

// Officer roles for consistent checking (normalized to lowercase)
const OFFICER_ROLES = ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director', 'club_admin'];

// Normalize role name to lowercase and replace spaces with underscores
const normalizeRole = (role: string): string => {
  return role.toLowerCase().trim().replace(/\s+/g, '_');
};

// Check if a role is an officer role
const isOfficerRole = (role: string): boolean => {
  return OFFICER_ROLES.includes(normalizeRole(role));
};

export function usePersonalizedNavigation() {
  const { user, profile, loading: authLoading } = useAuth();
  const { isDemoMode, currentDemoUser, getDemoClub } = useDemoMode();
  const { data: userClubs = [], isLoading: clubsLoading } = useUserClubs();
  const { toast } = useToast();
  const [personalizedDestination, setPersonalizedDestination] = useState<PersonalizedDestination | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Memoize primary club to prevent reference changes
  const primaryClub = useMemo(() => userClubs[0]?.club, [userClubs]);
  const primaryClubId = primaryClub?.id;
  
  // Get user's roles in their primary club
  const { data: userRoles = [], isLoading: rolesLoading } = useUserEffectiveRoles(primaryClubId);

  // Check if we're still loading any critical data
  const isLoadingData = authLoading || clubsLoading || rolesLoading;

  // Memoized demo club validation
  const validatedDemoClub = useMemo(() => {
    if (!isDemoMode || !currentDemoUser) return null;
    
    try {
      const demoClub = getDemoClub();
      if (!demoClub || !demoClub.id || !demoClub.name) {
        console.error('Demo club data invalid:', demoClub);
        return null;
      }
      return demoClub;
    } catch (error) {
      console.error('Demo club fetch failed:', error);
      return null;
    }
  }, [isDemoMode, currentDemoUser, getDemoClub]);

  // Safe navigation resolver
  const resolveDestination = useCallback(() => {
    try {
      // Demo mode navigation with robust error handling
      if (isDemoMode && currentDemoUser) {
        const userRole = currentDemoUser.club_role || 'member';
        const normalizedRole = normalizeRole(userRole);
        const isOfficer = isOfficerRole(normalizedRole);
        
        // Validate demo club data
        if (!validatedDemoClub) {
          console.error(`Demo club missing for user ${currentDemoUser.name} (${currentDemoUser.id}), falling back to angler profile.`);
          toast({
            title: "Demo Setup Issue",
            description: "Loading fallback profile, club data not found",
            variant: "destructive"
          });
          
          return {
            route: '/profile',
            reason: 'Club data missing for demo user - loading fallback profile'
          };
        }

        if (isOfficer) {
          const roleDisplay = userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          return {
            route: `/clubs/${validatedDemoClub.id}/manage`,
            reason: `Loading ${roleDisplay} experience for ${currentDemoUser.club || validatedDemoClub.name}`
          };
        } else {
          return {
            route: '/profile',
            reason: `Demo member profile for ${validatedDemoClub.name}`
          };
        }
      }

      // Real user navigation with defensive checks
      if (user && profile && !isLoadingData) {
        // Safely check user roles with normalization
        const hasValidRoles = Array.isArray(userRoles) && userRoles.length > 0;
        const isOfficer = hasValidRoles && userRoles.some(role => {
          const roleName = role?.role_name;
          return roleName && isOfficerRole(roleName);
        });

        // Validate primary club data before using
        if (isOfficer && primaryClub && primaryClub.id && primaryClub.name) {
          return {
            route: `/clubs/${primaryClub.id}/manage`,
            reason: `Officer dashboard for ${primaryClub.name}`
          };
        } else if (primaryClub && primaryClub.name) {
          return {
            route: '/profile',
            reason: `Member profile with ${primaryClub.name} context`
          };
        } else {
          return {
            route: '/profile',
            reason: 'Personal angler profile'
          };
        }
      }

      // Fallback for authenticated users without complete data
      if (user && !isLoadingData) {
        console.warn('User authenticated but missing profile data, using fallback profile');
        return {
          route: '/profile',
          reason: 'Loading personal profile'
        };
      }

      return null;
    } catch (error) {
      console.error('Navigation resolution failed:', error);
      toast({
        title: "Navigation Error",
        description: "Loading fallback profile due to navigation error",
        variant: "destructive"
      });
      
      return {
        route: '/profile',
        reason: 'Navigation error - loading fallback profile'
      };
    }
  }, [
    isDemoMode, 
    currentDemoUser, 
    validatedDemoClub,
    user, 
    profile, 
    userRoles, 
    primaryClub, 
    isLoadingData,
    toast
  ]);

  // Main navigation effect with comprehensive error handling
  useEffect(() => {
    // Don't process if we're still loading critical data
    if (isLoadingData) {
      return;
    }

    // Clear destination for unauthenticated users
    if (!user && !isDemoMode) {
      setPersonalizedDestination(null);
      setHasInitialized(true);
      return;
    }

    // Resolve destination safely
    const destination = resolveDestination();
    
    if (destination) {
      setPersonalizedDestination(destination);
      setHasInitialized(true);
    } else if (hasInitialized) {
      // If we've already initialized but can't resolve, use safe fallback
      console.warn('Unable to resolve navigation destination, using profile fallback');
      setPersonalizedDestination({
        route: '/profile',
        reason: 'Loading profile - navigation data unavailable'
      });
    }
  }, [resolveDestination, isLoadingData, user, isDemoMode, hasInitialized]);

  // Force initialization after a timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!hasInitialized && (user || isDemoMode)) {
        console.warn('Navigation initialization timeout, forcing profile fallback');
        setPersonalizedDestination({
          route: '/profile',
          reason: 'Loading profile - initialization timeout'
        });
        setHasInitialized(true);
        
        toast({
          title: "Loading Timeout",
          description: "Navigation took longer than expected, loaded profile page",
          variant: "default"
        });
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
  }, [hasInitialized, user, isDemoMode, toast]);

  const getPersonalizedRoute = useCallback((intendedRoute?: string): string => {
    // If user was trying to access a specific route, honor that
    if (intendedRoute && intendedRoute !== '/auth' && intendedRoute !== '/') {
      return intendedRoute;
    }

    // Otherwise, return personalized destination or safe fallback
    return personalizedDestination?.route || '/profile';
  }, [personalizedDestination]);

  const getNavigationReason = useCallback((intendedRoute?: string): string => {
    if (intendedRoute && intendedRoute !== '/auth' && intendedRoute !== '/') {
      return `Returning to requested page: ${intendedRoute}`;
    }

    return personalizedDestination?.reason || 'Loading your personalized profile';
  }, [personalizedDestination]);

  // Enhanced ready state check
  const isReady = useMemo(() => {
    // If we're loading critical data, we're not ready
    if (isLoadingData) return false;
    
    // If user is not authenticated and not in demo mode, we're ready (will show auth)
    if (!user && !isDemoMode) return true;
    
    // If we have a destination or have initialized with fallback, we're ready
    return !!personalizedDestination || hasInitialized;
  }, [isLoadingData, user, isDemoMode, personalizedDestination, hasInitialized]);

  return {
    personalizedDestination,
    getPersonalizedRoute,
    getNavigationReason,
    isReady,
    isLoadingData // Expose loading state for debugging
  };
}
