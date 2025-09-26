import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type PlatformRole = 'super_admin' | 'platform_admin';
export type ClubRole = 'club_admin' | 'president' | 'vice_president' | 'tournament_director' | 'secretary' | 'treasurer' | 'conservation_director' | 'member' | 'guest';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface UserRole {
  role_type: string;
  role_name: string;
  club_id: string | null;
  expires_at: string | null;
}

export interface RoleAssignment {
  id: string;
  user_id: string;
  club_role?: ClubRole;
  platform_role?: PlatformRole;
  assigned_by: string;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
}

// Check if user has specific permission
export function usePermission(permission: string, clubId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['permission', user?.id, permission, clubId],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase.rpc('user_has_permission', {
        _user_id: user.id,
        _permission_name: permission,
        _club_id: clubId || null
      });

      if (error) throw error;
      return data as boolean;
    },
    enabled: !!user
  });
}

// Get user's effective roles
export function useUserEffectiveRoles(clubId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userEffectiveRoles', user?.id, clubId],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase.rpc('get_user_effective_roles', {
        _user_id: user.id,
        _club_id: clubId || null
      });

      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!user
  });
}

// Get all permissions
export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Permission[];
    }
  });
}

// Get role permissions
export function useRolePermissions(roleType: 'platform', roleName: PlatformRole): any;
export function useRolePermissions(roleType: 'club', roleName: ClubRole): any;
export function useRolePermissions(roleType: 'platform' | 'club', roleName: PlatformRole | ClubRole) {
  return useQuery({
    queryKey: ['rolePermissions', roleType, roleName],
    queryFn: async () => {
      let query = supabase
        .from('role_permissions')
        .select(`
          permission_id,
          permissions:permission_id (
            id,
            name,
            description,
            category
          )
        `);

      if (roleType === 'platform') {
        query = query.eq('platform_role', roleName as PlatformRole);
      } else {
        query = query.eq('club_role', roleName as ClubRole);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(item => item.permissions).filter(Boolean) as Permission[];
    }
  });
}

// Get club members with roles
export function useClubMembersWithRoles(clubId: string) {
  return useQuery({
    queryKey: ['clubMembersWithRoles', clubId],
    queryFn: async () => {
      // First get user roles for the club
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('club_id', clubId)
        .eq('is_active', true);

      if (rolesError) throw rolesError;
      if (!userRoles || userRoles.length === 0) return [];

      // Then get profile data for those users
      const userIds = userRoles.map(role => role.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name, avatar_url')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      return userRoles.map(role => ({
        ...role,
        profile: profiles?.find(p => p.user_id === role.user_id) || null
      }));
    },
    enabled: !!clubId
  });
}

// Assign club role
export function useAssignClubRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      clubId, 
      role, 
      expiresAt,
      reason 
    }: { 
      userId: string; 
      clubId: string; 
      role: ClubRole; 
      expiresAt?: string;
      reason?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // First, deactivate any existing roles for this user in this club
      await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('club_id', clubId);

      // Then assign the new role
      const { error: assignError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          club_id: clubId,
          club_role: role,
          assigned_by: user.id,
          expires_at: expiresAt || null,
          is_active: true
        });

      if (assignError) throw assignError;

      // Log the assignment
      const { error: logError } = await supabase
        .from('role_audit_log')
        .insert({
          user_id: user.id,
          target_user_id: userId,
          action: 'assigned',
          role_type: 'club',
          new_role: role,
          club_id: clubId,
          reason: reason || 'Role assignment via management interface'
        });

      if (logError) console.error('Failed to log role assignment:', logError);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubMembersWithRoles', variables.clubId] });
      queryClient.invalidateQueries({ queryKey: ['userEffectiveRoles'] });
      toast({
        title: 'Role assigned',
        description: 'User role has been successfully assigned.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error assigning role',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
}

// Remove club role
export function useRemoveClubRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      clubId, 
      reason 
    }: { 
      userId: string; 
      clubId: string; 
      reason?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Get current role for logging
      const { data: currentRole } = await supabase
        .from('user_roles')
        .select('club_role')
        .eq('user_id', userId)
        .eq('club_id', clubId)
        .eq('is_active', true)
        .single();

      // Deactivate the role
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('club_id', clubId);

      if (error) throw error;

      // Log the removal
      const { error: logError } = await supabase
        .from('role_audit_log')
        .insert({
          user_id: user.id,
          target_user_id: userId,
          action: 'removed',
          role_type: 'club',
          old_role: currentRole?.club_role || '',
          club_id: clubId,
          reason: reason || 'Role removal via management interface'
        });

      if (logError) console.error('Failed to log role removal:', logError);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubMembersWithRoles', variables.clubId] });
      queryClient.invalidateQueries({ queryKey: ['userEffectiveRoles'] });
      toast({
        title: 'Role removed',
        description: 'User role has been successfully removed.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error removing role',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
}

// Get audit log
export function useRoleAuditLog(clubId?: string) {
  return useQuery({
    queryKey: ['roleAuditLog', clubId],
    queryFn: async () => {
      let query = supabase
        .from('role_audit_log')
        .select(`
          *,
          user:profiles!role_audit_log_user_id_fkey (name),
          target_user:profiles!role_audit_log_target_user_id_fkey (name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (clubId) {
        query = query.eq('club_id', clubId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}

// Request temporary role elevation
export function useRequestRoleElevation() {
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      clubId,
      elevatedTo,
      reason,
      duration
    }: {
      clubId: string;
      elevatedTo: ClubRole;
      reason: string;
      duration: number; // hours
    }) => {
      if (!user) throw new Error('Not authenticated');

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + duration);

      const { error } = await supabase
        .from('temporary_role_elevations')
        .insert({
          user_id: user.id,
          club_id: clubId,
          elevated_to: elevatedTo,
          requested_by: user.id,
          reason,
          expires_at: expiresAt.toISOString(),
          is_active: false // Requires approval
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Elevation requested',
        description: 'Your role elevation request has been submitted for approval.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error requesting elevation',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
}

// Utility function to check if user has any of the specified permissions
export function useHasAnyPermission(permissions: string[], clubId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['hasAnyPermission', user?.id, permissions, clubId],
    queryFn: async () => {
      if (!user || permissions.length === 0) return false;

      for (const permission of permissions) {
        const { data } = await supabase.rpc('user_has_permission', {
          _user_id: user.id,
          _permission_name: permission,
          _club_id: clubId || null
        });
        if (data) return true;
      }
      return false;
    },
    enabled: !!user && permissions.length > 0
  });
}

// Utility function to get user's highest role in a club
export function useUserHighestClubRole(clubId: string) {
  const { data: roles = [] } = useUserEffectiveRoles(clubId);
  
  const roleHierarchy: Record<ClubRole, number> = {
    'club_admin': 9,
    'president': 8,
    'vice_president': 7,
    'tournament_director': 6,
    'secretary': 5,
    'treasurer': 4,
    'conservation_director': 3,
    'member': 2,
    'guest': 1
  };

  const clubRoles = roles.filter(role => 
    role.role_type === 'club' && 
    (role.club_id === clubId || role.club_id === null)
  );

  if (clubRoles.length === 0) return null;

  return clubRoles.reduce((highest, current) => {
    const currentLevel = roleHierarchy[current.role_name as ClubRole] || 0;
    const highestLevel = roleHierarchy[highest.role_name as ClubRole] || 0;
    return currentLevel > highestLevel ? current : highest;
  });
}