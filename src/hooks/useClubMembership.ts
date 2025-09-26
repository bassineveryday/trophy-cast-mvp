import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRoleData } from '@/hooks/useRoles';

// Get clubs that user is a member of
export function useUserClubs() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userClubs', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          club:club_id (
            id,
            name,
            location,
            description,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
}

// Get members of a specific club
export function useClubMembers(clubId: string) {
  return useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: async () => {
      // First get user roles for the club
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('club_id', clubId);

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

// Check if user is member of specific club
export function useIsClubMember(clubId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['isClubMember', user?.id, clubId],
    queryFn: async () => {
      if (!user || !clubId) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .eq('club_id', clubId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!clubId
  });
}

// Join club mutation
export function useJoinClub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (clubId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          club_id: clubId,
          role: 'member'
        });

      if (error) throw error;
    },
    onSuccess: (_, clubId) => {
      queryClient.invalidateQueries({ queryKey: ['userClubs'] });
      queryClient.invalidateQueries({ queryKey: ['isClubMember', user?.id, clubId] });
      queryClient.invalidateQueries({ queryKey: ['clubMembers', clubId] });
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({
        title: 'Success',
        description: 'Successfully joined the club!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to join club'
      });
    }
  });
}

// Leave club mutation
export function useLeaveClub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (clubId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id)
        .eq('club_id', clubId)
        .eq('role', 'member');

      if (error) throw error;
    },
    onSuccess: (_, clubId) => {
      queryClient.invalidateQueries({ queryKey: ['userClubs'] });
      queryClient.invalidateQueries({ queryKey: ['isClubMember', user?.id, clubId] });
      queryClient.invalidateQueries({ queryKey: ['clubMembers', clubId] });
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({
        title: 'Success',
        description: 'Successfully left the club'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to leave club'
      });
    }
  });
}

// Get club with member count
export function useClubWithStats(clubId: string) {
  return useQuery({
    queryKey: ['clubWithStats', clubId],
    queryFn: async () => {
      // Get club details
      const { data: club, error: clubError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (clubError) throw clubError;

      // Get member count
      const { count: memberCount, error: countError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('club_id', clubId);

      if (countError) throw countError;

      return {
        ...club,
        memberCount: memberCount || 0
      };
    },
    enabled: !!clubId
  });
}