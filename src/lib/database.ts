import { supabase } from '@/integrations/supabase/client';
import type { 
  Club, 
  Tournament, 
  Catch, 
  Profile,
  CreateClubData, 
  UpdateClubData,
  CreateTournamentData,
  UpdateTournamentData,
  CreateCatchData,
  UpdateCatchData
} from '@/types/database';

// Clubs CRUD operations
export const clubService = {
  // Get all clubs
  async getAll(): Promise<{ data: Club[] | null; error: any }> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('name');
    
    return { data: data as Club[] | null, error };
  },

  // Get club by ID
  async getById(id: string): Promise<{ data: Club | null; error: any }> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    return { data: data as Club | null, error };
  },

  // Create new club
  async create(clubData: CreateClubData): Promise<{ data: Club | null; error: any }> {
    const { data, error } = await supabase
      .from('clubs')
      .insert({
        ...clubData,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
    
    return { data: data as Club | null, error };
  },

  // Update club
  async update(id: string, clubData: UpdateClubData): Promise<{ data: Club | null; error: any }> {
    const { data, error } = await supabase
      .from('clubs')
      .update(clubData)
      .eq('id', id)
      .select()
      .single();
    
    return { data: data as Club | null, error };
  },

  // Delete club
  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('clubs')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};

// Tournaments CRUD operations
export const tournamentService = {
  // Get all tournaments
  async getAll(): Promise<{ data: Tournament[] | null; error: any }> {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        club:club_id (
          id,
          name,
          location
        )
      `)
      .order('date', { ascending: false });
    
    return { data: data as any, error };
  },

  // Get tournaments by club
  async getByClub(clubId: string): Promise<{ data: Tournament[] | null; error: any }> {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        club:club_id (
          id,
          name,
          location
        )
      `)
      .eq('club_id', clubId)
      .order('date', { ascending: false });
    
    return { data: data as any, error };
  },

  // Get tournament by ID
  async getById(id: string): Promise<{ data: Tournament | null; error: any }> {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        club:club_id (
          id,
          name,
          location
        )
      `)
      .eq('id', id)
      .maybeSingle();
    
    return { data: data as any, error };
  },

  // Create new tournament
  async create(tournamentData: CreateTournamentData): Promise<{ data: Tournament | null; error: any }> {
    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        ...tournamentData,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select(`
        *,
        club:club_id (
          id,
          name,
          location
        )
      `)
      .single();
    
    return { data: data as any, error };
  },

  // Update tournament
  async update(id: string, tournamentData: UpdateTournamentData): Promise<{ data: Tournament | null; error: any }> {
    const { data, error } = await supabase
      .from('tournaments')
      .update(tournamentData)
      .eq('id', id)
      .select(`
        *,
        club:club_id (
          id,
          name,
          location
        )
      `)
      .single();
    
    return { data: data as any, error };
  },

  // Delete tournament
  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};

// Catches CRUD operations
export const catchService = {
  // Get all catches for current user
  async getAll(): Promise<{ data: Catch[] | null; error: any }> {
    const { data, error } = await supabase
      .from('catches')
      .select(`
        *,
        tournament:tournament_id (
          id,
          name,
          date,
          location
        )
      `)
      .order('timestamp', { ascending: false });
    
    return { data: data as Catch[] | null, error };
  },

  // Get catches by tournament
  async getByTournament(tournamentId: string): Promise<{ data: Catch[] | null; error: any }> {
    const { data, error } = await supabase
      .from('catches')
      .select(`
        *,
        tournament:tournament_id (
          id,
          name,
          date,
          location
        )
      `)
      .eq('tournament_id', tournamentId)
      .order('timestamp', { ascending: false });
    
    return { data: data as Catch[] | null, error };
  },

  // Get catch by ID
  async getById(id: string): Promise<{ data: Catch | null; error: any }> {
    const { data, error } = await supabase
      .from('catches')
      .select(`
        *,
        tournament:tournament_id (
          id,
          name,
          date,
          location
        )
      `)
      .eq('id', id)
      .maybeSingle();
    
    return { data: data as Catch | null, error };
  },

  // Create new catch
  async create(catchData: CreateCatchData): Promise<{ data: Catch | null; error: any }> {
    const { data, error } = await supabase
      .from('catches')
      .insert({
        ...catchData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select(`
        *,
        tournament:tournament_id (
          id,
          name,
          date,
          location
        )
      `)
      .single();
    
    return { data: data as Catch | null, error };
  },

  // Update catch
  async update(id: string, catchData: UpdateCatchData): Promise<{ data: Catch | null; error: any }> {
    const { data, error } = await supabase
      .from('catches')
      .update(catchData)
      .eq('id', id)
      .select(`
        *,
        tournament:tournament_id (
          id,
          name,
          date,
          location
        )
      `)
      .single();
    
    return { data: data as Catch | null, error };
  },

  // Delete catch
  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('catches')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};

// Profile service with club relationship
export const profileService = {
  // Get current user's profile with club data
  async getCurrent(): Promise<{ data: Profile | null; error: any }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        club_data:club_id (
          id,
          name,
          location
        )
      `)
      .eq('user_id', user.user.id)
      .maybeSingle();
    
    return { data: data as Profile | null, error };
  },

  // Update profile including club association
  async update(profileData: Partial<Profile>): Promise<{ data: Profile | null; error: any }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', user.user.id)
      .select(`
        *,
        club_data:club_id (
          id,
          name,
          location
        )
      `)
      .single();
    
    return { data: data as Profile | null, error };
  }
};