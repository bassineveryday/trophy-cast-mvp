import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformRole {
  id: string;
  user_id: string;
  platform_role: 'super_admin' | 'platform_admin' | 'support_admin';
  is_active: boolean;
  expires_at?: string;
}

// Get current user's platform roles
export function usePlatformRoles() {
  return useQuery({
    queryKey: ['platformRoles'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('user_platform_roles')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching platform roles:', error);
        return [];
      }
      return data as PlatformRole[] || [];
    }
  });
}

// Check if user is platform admin
export function useIsPlatformAdmin() {
  const { data: roles = [] } = usePlatformRoles();
  
  return roles.some(role => 
    (role.platform_role === 'super_admin' || role.platform_role === 'platform_admin') &&
    role.is_active &&
    (!role.expires_at || new Date(role.expires_at) > new Date())
  );
}

// Check if user is super admin (highest level)
export function useIsSuperAdmin() {
  const { data: roles = [] } = usePlatformRoles();
  
  return roles.some(role => 
    role.platform_role === 'super_admin' &&
    role.is_active &&
    (!role.expires_at || new Date(role.expires_at) > new Date())
  );
}

// Platform admin service
export const platformAdminService = {
  // Get platform metrics
  async getPlatformMetrics() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // Mock data for now - in real app would query actual tables
    return {
      totalUsers: 1247,
      activeClubs: 23,
      tournamentsThisMonth: 8,
      totalRevenue: 15420.50,
      newUsersThisWeek: 12,
      activeUsersToday: 89,
      topClubs: [
        { name: 'Alabama Bass Nation - Chapter 12', members: 47, activity: 95 },
        { name: 'River Valley Independent', members: 32, activity: 87 },
        { name: 'Trophy Cast Elite', members: 28, activity: 82 }
      ]
    };
  },

  // Get all users for admin management
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles (
          role,
          club_id,
          club_role
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Impersonate user (for testing/support)
  async impersonateUser(userId: string) {
    // This would typically be implemented server-side for security
    // For demo purposes, we'll simulate switching to demo user
    console.log(`Admin impersonating user: ${userId}`);
    return { success: true };
  }
};