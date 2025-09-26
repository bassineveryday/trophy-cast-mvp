import React, { ReactNode } from 'react';
import { usePermission } from '@/hooks/useRBAC';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  permission: string;
  clubId?: string;
  fallback?: ReactNode;
  showPermissionMessage?: boolean;
  children: ReactNode;
}

export function PermissionGuard({ 
  permission, 
  clubId, 
  fallback, 
  showPermissionMessage = false,
  children 
}: PermissionGuardProps) {
  const { data: hasPermission, isLoading } = usePermission(permission, clubId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showPermissionMessage) {
      return (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            You don't have permission to access this feature. Required permission: {permission}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return <>{children}</>;
}

interface MultiplePermissionGuardProps {
  permissions: string[];
  clubId?: string;
  requireAll?: boolean;
  fallback?: ReactNode;
  showPermissionMessage?: boolean;
  children: ReactNode;
}

export function MultiplePermissionGuard({
  permissions,
  clubId,
  requireAll = false,
  fallback,
  showPermissionMessage = false,
  children
}: MultiplePermissionGuardProps) {
  const permissionChecks = permissions.map(permission => usePermission(permission, clubId));
  
  const isLoading = permissionChecks.some(check => check.isLoading);
  const hasPermissions = requireAll 
    ? permissionChecks.every(check => check.data === true)
    : permissionChecks.some(check => check.data === true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasPermissions) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showPermissionMessage) {
      const permissionText = requireAll 
        ? `all of: ${permissions.join(', ')}`
        : `any of: ${permissions.join(', ')}`;
        
      return (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            You don't have permission to access this feature. Required permissions: {permissionText}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return <>{children}</>;
}

// Role-based guard component
interface RoleGuardProps {
  roles: string[];
  clubId?: string;
  requireAll?: boolean;
  fallback?: ReactNode;
  showRoleMessage?: boolean;
  children: ReactNode;
}

export function RoleGuard({
  roles,
  clubId,
  requireAll = false,
  fallback,
  showRoleMessage = false,
  children
}: RoleGuardProps) {
  // Convert roles to permissions - this is a simplified approach
  // In a real implementation, you might want more sophisticated role checking
  const permissions = roles.map(role => `role.${role}`);
  
  return (
    <MultiplePermissionGuard
      permissions={permissions}
      clubId={clubId}
      requireAll={requireAll}
      fallback={fallback}
      showPermissionMessage={showRoleMessage}
    >
      {children}
    </MultiplePermissionGuard>
  );
}

// Admin-only guard
interface AdminGuardProps {
  level?: 'platform' | 'club';
  clubId?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function AdminGuard({ level = 'club', clubId, fallback, children }: AdminGuardProps) {
  const permission = level === 'platform' ? 'platform.admin.full' : 'club.admin.full';
  
  return (
    <PermissionGuard 
      permission={permission} 
      clubId={clubId}
      fallback={fallback}
      showPermissionMessage={true}
    >
      {children}
    </PermissionGuard>
  );
}