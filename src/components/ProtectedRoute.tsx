import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles, type UserRole } from '@/hooks/useRoles';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: userRoles = [], isLoading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = authLoading || (user && roles && rolesLoading);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      // Redirect unauthenticated users with original path
      const redirectUrl = `/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      navigate(redirectUrl, { replace: true });
      return;
    }

    if (roles && !rolesLoading) {
      // Check if user has any of the required roles
      const hasRequiredRole = roles.some(requiredRole => 
        userRoles.some(userRole => userRole.role === requiredRole)
      );

      if (!hasRequiredRole) {
        // Redirect unauthorized users with forbidden reason
        const redirectUrl = `/auth?reason=forbidden&redirect=${encodeURIComponent(location.pathname + location.search)}`;
        navigate(redirectUrl, { replace: true });
        return;
      }
    }
  }, [user, authLoading, roles, userRoles, rolesLoading, navigate, location]);

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (roles && userRoles.length > 0) {
    const hasRequiredRole = roles.some(requiredRole => 
      userRoles.some(userRole => userRole.role === requiredRole)
    );
    
    if (!hasRequiredRole) {
      return null; // Will redirect in useEffect
    }
  }

  return <>{children}</>;
}