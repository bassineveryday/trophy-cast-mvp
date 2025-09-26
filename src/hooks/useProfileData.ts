import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExtendedProfile {
  id: string;
  user_id: string;
  name: string;
  club: string | null;
  city: string | null;
  avatar_url: string | null;
  signature_techniques: string[];
  tournaments_fished: number;
  aoy_titles: number;
  biggest_catch_weight: number | null;
  biggest_catch_species: string | null;
  biggest_catch_location: string | null;
  favorite_water: string | null;
  home_state: string | null;
  club_data?: {
    id: string;
    name: string;
    location: string | null;
  };
}

export function useProfileData(userId?: string) {
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user if no userId provided
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!targetUserId) {
        throw new Error('No user ID provided');
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select(`
          *,
          clubs:club_id (
            id,
            name,
            location
          )
        `)
        .eq('user_id', targetUserId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const profileData: ExtendedProfile = {
        ...data,
        signature_techniques: data.signature_techniques || [],
        tournaments_fished: data.tournaments_fished || 0,
        aoy_titles: data.aoy_titles || 0,
        club_data: data.clubs ? {
          id: data.clubs.id,
          name: data.clubs.name,
          location: data.clubs.location
        } : undefined
      };

      setProfile(profileData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch profile';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const updateProfile = useCallback(async (updates: Partial<ExtendedProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh the profile data
      await fetchProfile();
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (err: any) {
      toast({
        title: 'Error', 
        description: err.message || 'Failed to update profile',
        variant: 'destructive'
      });
    }
  }, [fetchProfile, toast]);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: urlData.publicUrl });
      
      return { success: true, url: urlData.publicUrl };
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to upload avatar',
        variant: 'destructive'
      });
      return { success: false, error: err.message };
    }
  }, [updateProfile, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refreshProfile: fetchProfile
  };
}