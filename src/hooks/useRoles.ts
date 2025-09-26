import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'club_officer' | 'member';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  club_id: string | null;
  created_at: string;
}

// Get current user's roles
export function useUserRoles() {
  return useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) throw error;
      return data as UserRoleData[] || [];
    }
  });
}

// Check if user is club officer or admin
export function useIsClubOfficer(clubId?: string) {
  const { data: roles = [] } = useUserRoles();
  
  return roles.some(role => 
    (role.role === 'admin' || role.role === 'club_officer') &&
    (!clubId || role.club_id === clubId)
  );
}

// Check if user has specific role
export function useHasRole(role: UserRole, clubId?: string) {
  const { data: roles = [] } = useUserRoles();
  
  return roles.some(userRole => 
    userRole.role === role &&
    (!clubId || userRole.club_id === clubId)
  );
}