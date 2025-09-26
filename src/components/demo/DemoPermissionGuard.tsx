import React from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface DemoPermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export function DemoPermissionGuard({ 
  permission, 
  children, 
  fallback,
  showFallback = true 
}: DemoPermissionGuardProps) {
  const { isDemoMode, hasPermission, currentDemoUser } = useDemoMode();

  // If not in demo mode, show content normally
  if (!isDemoMode) {
    return <>{children}</>;
  }

  // If user has permission, show content
  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  // If fallback is provided, show it
  if (fallback) {
    return <>{fallback}</>;
  }

  // If showFallback is false, don't show anything
  if (!showFallback) {
    return null;
  }

  // Default fallback - permission denied message
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <Lock className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <strong>{currentDemoUser?.name}</strong> ({currentDemoUser?.club_role.replace('_', ' ')}) 
        doesn't have access to this feature. Try switching to a user with <strong>{permission.replace('_', ' ')}</strong> permissions.
      </AlertDescription>
    </Alert>
  );
}