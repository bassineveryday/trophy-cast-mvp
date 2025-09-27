import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useUserEffectiveRoles } from '@/hooks/useRBAC';
import { useUserClubs } from '@/hooks/useClubMembership';

export interface PersonalizedDestination {
  route: string;
  reason: string;
}

export function usePersonalizedNavigation() {
  const { user, profile } = useAuth();
  const { isDemoMode, currentDemoUser, getDemoClub } = useDemoMode();
  const { data: userClubs = [] } = useUserClubs();
  const [personalizedDestination, setPersonalizedDestination] = useState<PersonalizedDestination | null>(null);

  // Get user's primary club (first club they're in) - memoize to prevent infinite loops
  const primaryClub = userClubs[0]?.club;
  const primaryClubId = primaryClub?.id;
  
  // Get user's roles in their primary club
  const { data: userRoles = [] } = useUserEffectiveRoles(primaryClubId);

  useEffect(() => {
    if (!user && !isDemoMode) {
      setPersonalizedDestination(null);
      return;
    }

    // Handle demo mode navigation
    if (isDemoMode && currentDemoUser) {
      const isOfficer = ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director'].includes(currentDemoUser.club_role);
      
      try {
        const demoClub = getDemoClub();
        
        if (isOfficer) {
          setPersonalizedDestination({
            route: `/clubs/${demoClub.id}/manage`,
            reason: `Loading ${currentDemoUser.club_role.replace('_', ' ')} experience for ${currentDemoUser.club}`
          });
        } else {
          setPersonalizedDestination({
            route: '/profile',
            reason: 'Demo member profile'
          });
        }
      } catch (error) {
        console.error('Demo club data missing:', error);
        setPersonalizedDestination({
          route: '/profile',
          reason: 'Club data missing for demo user - loading fallback profile'
        });
      }
      return;
    }

    // Handle real user navigation
    if (user && profile) {
      // Check if user is an officer in any club - use length check to prevent array reference issues
      const hasRoles = userRoles.length > 0;
      const isOfficer = hasRoles && userRoles.some(role => 
        ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director', 'club_admin'].includes(role.role_name)
      );

      if (isOfficer && primaryClub) {
        setPersonalizedDestination({
          route: `/clubs/${primaryClub.id}/manage`,
          reason: `Officer dashboard for ${primaryClub.name}`
        });
      } else if (primaryClub) {
        setPersonalizedDestination({
          route: '/profile',
          reason: `Member profile with ${primaryClub.name} context`
        });
      } else {
        setPersonalizedDestination({
          route: '/profile',
          reason: 'Personal angler profile'
        });
      }
    }
  }, [user, profile, isDemoMode, currentDemoUser, primaryClubId, userRoles.length, getDemoClub]);

  const getPersonalizedRoute = (intendedRoute?: string): string => {
    // If user was trying to access a specific route, honor that
    if (intendedRoute && intendedRoute !== '/auth' && intendedRoute !== '/') {
      return intendedRoute;
    }

    // Otherwise, return personalized destination
    return personalizedDestination?.route || '/profile';
  };

  const getNavigationReason = (intendedRoute?: string): string => {
    if (intendedRoute && intendedRoute !== '/auth' && intendedRoute !== '/') {
      return `Returning to requested page: ${intendedRoute}`;
    }

    return personalizedDestination?.reason || 'Loading your personalized profile';
  };

  return {
    personalizedDestination,
    getPersonalizedRoute,
    getNavigationReason,
    isReady: !!personalizedDestination || isDemoMode
  };
}
