import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface PersonalizedAuthRedirectProps {
  children?: React.ReactNode;
}

/**
 * PersonalizedAuthRedirect - Temporary placeholder component
 * This component was being referenced but didn't exist after rollback
 * Creating minimal version to prevent Router context errors
 */
export const PersonalizedAuthRedirect = ({ children }: PersonalizedAuthRedirectProps) => {
  useEffect(() => {
    console.log('PersonalizedAuthRedirect: Component rendered (should not be used after rollback)');
  }, []);

  // Simply render children or redirect to homepage
  if (children) {
    return <>{children}</>;
  }

  return <LoadingSpinner message="Redirecting..." />;
};

export default PersonalizedAuthRedirect;