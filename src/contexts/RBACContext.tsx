import React, { createContext, useContext, ReactNode } from 'react';
import { usePermission, useUserEffectiveRoles, type UserRole } from '@/hooks/useRBAC';

interface RBACContextType {
  hasPermission: (permission: string, clubId?: string) => boolean;
  isLoading: boolean;
  userRoles: UserRole[];
  checkMultiplePermissions: (permissions: string[], clubId?: string, requireAll?: boolean) => boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

interface RBACProviderProps {
  children: ReactNode;
  clubId?: string;
}

export function RBACProvider({ children, clubId }: RBACProviderProps) {
  const { data: userRoles = [], isLoading: rolesLoading } = useUserEffectiveRoles(clubId);

  // Create a permission checker that batches requests
  const hasPermission = (permission: string, targetClubId?: string) => {
    const { data: hasPermissionData, isLoading } = usePermission(permission, targetClubId || clubId);
    return hasPermissionData || false;
  };

  const checkMultiplePermissions = (permissions: string[], targetClubId?: string, requireAll = false) => {
    const results = permissions.map(permission => hasPermission(permission, targetClubId));
    return requireAll ? results.every(Boolean) : results.some(Boolean);
  };

  const value: RBACContextType = {
    hasPermission,
    isLoading: rolesLoading,
    userRoles,
    checkMultiplePermissions,
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }
  return context;
}

// Higher-order component for permission-based rendering
interface WithPermissionProps {
  permission: string;
  clubId?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function WithPermission({ permission, clubId, fallback = null, children }: WithPermissionProps) {
  const { data: hasPermission } = usePermission(permission, clubId);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

// Component for checking multiple permissions
interface WithAnyPermissionProps {
  permissions: string[];
  clubId?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function WithAnyPermission({ permissions, clubId, fallback = null, children }: WithAnyPermissionProps) {
  const permissionChecks = permissions.map(permission => usePermission(permission, clubId));
  const hasAnyPermission = permissionChecks.some(check => check.data === true);
  
  return hasAnyPermission ? <>{children}</> : <>{fallback}</>;
}

// Component for checking all permissions
interface WithAllPermissionsProps {
  permissions: string[];
  clubId?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function WithAllPermissions({ permissions, clubId, fallback = null, children }: WithAllPermissionsProps) {
  const permissionChecks = permissions.map(permission => usePermission(permission, clubId));
  const hasAllPermissions = permissionChecks.every(check => check.data === true);
  
  return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
}