import { supabase } from '@/lib/supabaseClient';

interface CreateCatchDTO {
  tournament_id?: string;
  club_id?: string;
  species: "Largemouth" | "Smallmouth" | "Spotted" | "Other";
  weight_oz: number;
  length_mm?: number;
  photo_key: string;
  video_key?: string;
  ar_model_version?: string;
  lng?: number;
  lat?: number;
  captured_at: string; // ISO timestamp
  notes?: string;
}

export async function createCatch(dto: CreateCatchDTO) {
  // Generate idempotency key
  const idempotency_key = `catch_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }
  
  // Build location point if coordinates provided
  const location = dto.lng && dto.lat 
    ? `SRID=4326;POINT(${dto.lng} ${dto.lat})`
    : null;
  
  // Insert catch record
  const { data, error } = await supabase
    .from('catches')
    .insert({
      user_id: user.id,
      tournament_id: dto.tournament_id || null,
      club_id: dto.club_id || null,
      species: dto.species,
      weight_oz: dto.weight_oz,
      length_mm: dto.length_mm || null,
      photo_key: dto.photo_key,
      video_key: dto.video_key || null,
      ar_model_version: dto.ar_model_version || null,
      location,
      timestamp: dto.captured_at,
      notes: dto.notes || null,
      idempotency_key
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create catch: ${error.message}`);
  }
  
  return data;
}