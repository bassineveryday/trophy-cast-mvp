import { useEffect, useState } from "react";
import { fetchAOYStandingsByClub } from "@/integrations/supabase/queries";

type AOYRow = {
  member_id: string;
  member_name: string;
  season_year: number;
  total_aoy_points: number;
  aoy_rank: number;
  boater_status: string | null;
  club_id: string;
};

export default function AOYStandings({ clubId }: { clubId: string }) {
  const [rows, setRows] = useState<AOYRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) {
      setErr("Missing clubId");
      setLoading(false);
      return;
    }
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAOYStandingsByClub(clubId);
        if (alive) setRows(data as AOYRow[]);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Failed to load AOY standings");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [clubId]);

  if (loading) return <div>Loading AOY…</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="space-y-2">
      {rows.map(r => (
        <div key={`${r.season_year}-${r.member_id}`} className="flex items-center justify-between border rounded px-3 py-2">
          <div className="flex items-center gap-3">
            <span className="w-8 text-right font-mono">{r.aoy_rank}</span>
            <div>
              <div className="font-medium">{r.member_name}</div>
              <div className="text-xs opacity-70">
                Season {r.season_year}{r.boater_status ? ` • ${r.boater_status}` : ""}
              </div>
            </div>
          </div>
          <div className="font-mono">{r.total_aoy_points}</div>
        </div>
      ))}
      {rows.length === 0 && <div className="text-sm opacity-70">No AOY standings yet for this club.</div>}
    </div>
  );
}
