import { useDemoMode } from '@/contexts/DemoModeContext';
import { useIsClubOfficer } from '@/hooks/useRoles';

export function useDemoAwareRoles() {
  const { isDemoMode, currentDemoUser, getDemoUserRole, hasPermission } = useDemoMode();
  const isClubOfficerReal = useIsClubOfficer();

  // In demo mode, use demo user's role; otherwise use real auth
  const isClubOfficer = isDemoMode 
    ? ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director'].includes(getDemoUserRole() || '')
    : isClubOfficerReal;

  const isPresident = isDemoMode 
    ? getDemoUserRole() === 'president'
    : false; // Add real president check here if needed

  const isMember = isDemoMode
    ? getDemoUserRole() === 'member'
    : !isClubOfficerReal;

  const getUserProfile = () => {
    if (isDemoMode && currentDemoUser) {
      return {
        name: currentDemoUser.name,
        role: currentDemoUser.club_role,
        club: currentDemoUser.club,
        avatar_url: currentDemoUser.avatar_url,
        nickname: currentDemoUser.nickname
      };
    }
    return null; // Return real user profile here when not in demo mode
  };

  return {
    isClubOfficer,
    isPresident,
    isMember,
    isDemoMode,
    currentDemoUser,
    hasPermission,
    getUserProfile
  };
}