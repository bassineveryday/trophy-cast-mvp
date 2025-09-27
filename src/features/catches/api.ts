import { supabase } from "@/integrations/supabase/client";

export type CreateCatchDTO = {
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
  captured_at: string; // ISO
  notes?: string;
};

export async function createCatch(dto: CreateCatchDTO) {
  // Ensure user
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user?.id) throw new Error("Not signed in.");

  // Idempotency key prevents dupes if users retry while offline/bad signal
  const idempotency_key = `catch_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const row: any = {
    ...dto,
    user_id: user.id,
    idempotency_key,
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
  return data;
}