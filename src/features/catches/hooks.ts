import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCatches(tournamentId?: string) {
  return useQuery({
    queryKey: ["catches", tournamentId ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("catches")
        .select("*")
        .order("created_at", { ascending: false });

      if (tournamentId) q = q.eq("tournament_id", tournamentId);

      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    }
  });
}

export function invalidateCatches(qc: ReturnType<typeof useQueryClient>, tournamentId?: string) {
  qc.invalidateQueries({ queryKey: ["catches", tournamentId ?? "all"] });
}