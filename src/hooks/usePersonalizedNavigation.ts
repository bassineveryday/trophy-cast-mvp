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

  // Get user's primary club (first club they're in)
  const primaryClub = userClubs[0]?.club;
  
  // Get user's roles in their primary club
  const { data: userRoles = [] } = useUserEffectiveRoles(primaryClub?.id);

  useEffect(() => {
    if (!user && !isDemoMode) {
      setPersonalizedDestination(null);
      return;
    }

    // Handle demo mode navigation
    if (isDemoMode && currentDemoUser) {
      const isOfficer = ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director'].includes(currentDemoUser.club_role);
      
      if (isOfficer) {
        setPersonalizedDestination({
          route: `/clubs/${getDemoClub().id}/manage`,
          reason: `Demo ${currentDemoUser.club_role.replace('_', ' ')} dashboard`
        });
      } else {
        setPersonalizedDestination({
          route: '/profile',
          reason: 'Demo member profile'
        });
      }
      return;
    }

    // Handle real user navigation
    if (user && profile) {
      // Check if user is an officer in any club
      const isOfficer = userRoles.some(role => 
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
  }, [user, profile, isDemoMode, currentDemoUser, primaryClub, userRoles]);

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

    return personalizedDestination?.reason || 'Loading your personalized dashboard';
  };

  return {
    personalizedDestination,
    getPersonalizedRoute,
    getNavigationReason,
    isReady: !!personalizedDestination || isDemoMode
  };
}
