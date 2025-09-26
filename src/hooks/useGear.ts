import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type UserRod = Database['public']['Tables']['user_rods']['Row'];
type UserReel = Database['public']['Tables']['user_reels']['Row'];
type UserCombo = Database['public']['Tables']['user_combos']['Row'];
type UserBoat = Database['public']['Tables']['user_boats']['Row'];
type RodSpec = Database['public']['Tables']['rod_specifications']['Row'];
type ReelSpec = Database['public']['Tables']['reel_specifications']['Row'];

export function useGear() {
  const [rods, setRods] = useState<UserRod[]>([]);
  const [reels, setReels] = useState<UserReel[]>([]);
  const [combos, setCombos] = useState<UserCombo[]>([]);
  const [boats, setBoats] = useState<UserBoat[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user's gear
  const fetchGear = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [rodsResult, reelsResult, combosResult, boatsResult] = await Promise.all([
        supabase.from('user_rods').select('*').eq('user_id', user.id),
        supabase.from('user_reels').select('*').eq('user_id', user.id),
        supabase.from('user_combos').select(`
          *,
          rod:user_rods(*),
          reel:user_reels(*)
        `).eq('user_id', user.id),
        supabase.from('user_boats').select('*').eq('user_id', user.id)
      ]);

      if (rodsResult.data) setRods(rodsResult.data);
      if (reelsResult.data) setReels(reelsResult.data);
      if (combosResult.data) setCombos(combosResult.data);
      if (boatsResult.data) setBoats(boatsResult.data);
    } catch (error) {
      console.error('Error fetching gear:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your gear',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Serial number lookup functions
  const lookupRodBySerial = async (serialNumber: string): Promise<RodSpec | null> => {
    const { data } = await supabase
      .from('rod_specifications')
      .select('*')
      .eq('serial_number', serialNumber.toUpperCase())
      .single();
    return data;
  };

  const lookupReelBySerial = async (serialNumber: string): Promise<ReelSpec | null> => {
    const { data } = await supabase
      .from('reel_specifications')
      .select('*')
      .eq('serial_number', serialNumber.toUpperCase())
      .single();
    return data;
  };

  // Add rod
  const addRod = async (rodData: Omit<Partial<UserRod>, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_rods')
        .insert({ ...rodData, user_id: user.id } as any)
        .select()
        .single();

      if (error) throw error;
      
      setRods(prev => [...prev, data]);
      toast({
        title: 'Rod Added',
        description: `${data.brand} ${data.model} has been added to your collection`
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add rod',
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Add reel
  const addReel = async (reelData: Omit<Partial<UserReel>, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_reels')
        .insert({ ...reelData, user_id: user.id } as any)
        .select()
        .single();

      if (error) throw error;
      
      setReels(prev => [...prev, data]);
      toast({
        title: 'Reel Added',
        description: `${data.brand} ${data.model} has been added to your collection`
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add reel',
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Create combo
  const createCombo = async (comboData: {
    nickname: string;
    rod_id: string;
    reel_id: string;
    primary_techniques?: string[];
    notes?: string;
    is_private?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_combos')
        .insert({ ...comboData, user_id: user.id })
        .select(`
          *,
          rod:user_rods(*),
          reel:user_reels(*)
        `)
        .single();

      if (error) throw error;
      
      setCombos(prev => [...prev, data]);
      toast({
        title: 'Combo Created',
        description: `"${data.nickname}" combo has been created`
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create combo',
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Add boat
  const addBoat = async (boatData: Omit<Partial<UserBoat>, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_boats')
        .insert({ ...boatData, user_id: user.id } as any)
        .select()
        .single();

      if (error) throw error;
      
      setBoats(prev => [...prev, data]);
      toast({
        title: 'Boat Added',
        description: `${data.brand} ${data.model} "${data.nickname || ''}" has been added to your profile`
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add boat',
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchGear();
  }, []);

  return {
    rods,
    reels,
    combos,
    boats,
    loading,
    lookupRodBySerial,
    lookupReelBySerial,
    addRod,
    addReel,
    createCombo,
    addBoat,
    refreshGear: fetchGear
  };
}