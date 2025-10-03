import { supabase } from "@/integrations/supabase/client";

export type CreateCatchDTO = {
  tournament_id?: string;
  species: "Largemouth" | "Smallmouth" | "Spotted" | "Other";
  // Optional fields - match actual DB columns
  weight_oz?: number;
  length_mm?: number;
  photo_key?: string;
  video_key?: string;
  ar_model_version?: string;
  lng?: number;
  lat?: number;
  captured_at?: string; // ISO - defaults to now() in DB
  notes?: string;
};

export async function createCatch(dto: CreateCatchDTO) {
  // Ensure user
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user?.id) throw new Error("Not signed in.");

  // Fetch profile to get is_demo for success message
  const { data: profileData } = await supabase
    .from("profiles")
    .select("is_demo")
    .eq("user_id", user.id)
    .maybeSingle();

  // Idempotency key prevents dupes if users retry while offline/bad signal
  const idempotency_key = `catch_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  // Build insert row with only existing DB columns
  const row: any = {
    user_id: user.id,
    species: dto.species,
    idempotency_key,
    // Optional fields
    tournament_id: dto.tournament_id || null,
    notes: dto.notes || null,
    weight_oz: dto.weight_oz || null,
    length_mm: dto.length_mm || null,
    photo_key: dto.photo_key || null,
    video_key: dto.video_key || null,
    ar_model_version: dto.ar_model_version || null,
    captured_at: dto.captured_at || new Date().toISOString(),
    location: (dto.lng != null && dto.lat != null)
      ? `SRID=4326;POINT(${dto.lng} ${dto.lat})`
      : null,
  };

  const { data, error } = await supabase
    .from("catches")
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  
  // Return both data and lane indicator for success message
  return {
    ...data,
    _lane: (profileData?.is_demo ?? false) ? 'DEMO' : 'PRODUCTION'
  };
}