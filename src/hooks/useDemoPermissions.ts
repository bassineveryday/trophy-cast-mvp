import { useDemoMode } from '@/contexts/DemoModeContext';
import { useUserRoles, useIsClubOfficer, useHasRole } from '@/hooks/useRoles';

interface PermissionCheckOptions {
  demoPermission?: string;
  realPermission?: string;
  fallbackToReal?: boolean;
}

export function useDemoPermissions() {
  const { isDemoMode, hasPermission: hasDemoPermission, currentDemoUser } = useDemoMode();

  const checkPermission = (options: PermissionCheckOptions): boolean => {
    const { demoPermission, realPermission, fallbackToReal = true } = options;

    // In demo mode, check demo permissions
    if (isDemoMode) {
      if (demoPermission) {
        return hasDemoPermission(demoPermission);
      }
      // If no demo permission specified but real permission is, try to map it
      if (realPermission) {
        return hasDemoPermission(realPermission);
      }
      return false;
    }

    // In real mode, check real permissions
    if (realPermission && fallbackToReal) {
      // This would integrate with your real RBAC system
      // For now, return false as we don't have real auth implemented
      return false;
    }

    return false;
  };

  const hasClubManagement = (): boolean => {
    return checkPermission({
      demoPermission: 'club_management',
      realPermission: 'manage_club'
    });
  };

  const hasMemberManagement = (): boolean => {
    return checkPermission({
      demoPermission: 'member_management',
      realPermission: 'manage_members'
    });
  };

  const hasTournamentManagement = (): boolean => {
    return checkPermission({
      demoPermission: 'tournament_management',
      realPermission: 'manage_tournaments'
    });
  };

  const hasFinancialAccess = (): boolean => {
    return checkPermission({
      demoPermission: 'financial_dashboard',
      realPermission: 'view_finances'
    });
  };

  const hasOfficerAccess = (): boolean => {
    if (isDemoMode && currentDemoUser) {
      return currentDemoUser.club_role !== 'member';
    }
    return false; // Would check real officer status here
  };

  const getCurrentRole = (): string | null => {
    if (isDemoMode && currentDemoUser) {
      return currentDemoUser.club_role;
    }
    return null; // Would return real user role here
  };

  const getCurrentPermissions = (): string[] => {
    if (isDemoMode && currentDemoUser) {
      return currentDemoUser.permissions;
    }
    return []; // Would return real user permissions here
  };

  return {
    checkPermission,
    hasClubManagement,
    hasMemberManagement,
    hasTournamentManagement,
    hasFinancialAccess,
    hasOfficerAccess,
    getCurrentRole,
    getCurrentPermissions,
    isDemoMode,
    currentDemoUser
  };
}