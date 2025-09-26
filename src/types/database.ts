export interface Club {
  id: string;
  name: string;
  location?: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  club_id?: string;
  entry_fee?: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  created_by?: string;
  club?: Partial<Club>; // Optional partial relation
}

export interface Catch {
  id: string;
  user_id: string;
  tournament_id?: string;
  species: string;
  weight?: number;
  length?: number;
  photo_url?: string;
  notes?: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
  tournament?: Partial<Tournament>; // Optional partial relation
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  club: string | null;
  avatar_url: string | null;
  club_id: string | null;
  created_at: string;
  updated_at: string;
  club_data?: Partial<Club>; // Optional partial relation
}

export interface CreateClubData {
  name: string;
  location?: string;
  description?: string;
}

export interface UpdateClubData {
  name?: string;
  location?: string;
  description?: string;
}

export interface CreateTournamentData {
  name: string;
  date: string;
  location: string;
  club_id?: string;
  entry_fee?: number;
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface UpdateTournamentData {
  name?: string;
  date?: string;
  location?: string;
  club_id?: string;
  entry_fee?: number;
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface CreateCatchData {
  tournament_id?: string;
  species: string;
  weight?: number;
  length?: number;
  photo_url?: string;
  notes?: string;
  timestamp?: string;
}

export interface UpdateCatchData {
  tournament_id?: string;
  species?: string;
  weight?: number;
  length?: number;
  photo_url?: string;
  notes?: string;
  timestamp?: string;
}