// Type definitions for Trophy Cast app

export interface Tournament {
  id: string;
  name: string;
  club: string;
  clubFull?: string;
  date: string;
  time: string;
  launch?: string;
  weighin?: string;
  registered: boolean;
  fee: string;
  weather: string | WeatherInfo;
  weatherIcon: React.ComponentType<any>;
  link: string;
  hasPlan?: boolean;
}

export interface WeatherInfo {
  high: number;
  low: number;
  wind: string;
  icon: React.ComponentType<any>;
}

export interface CatchData {
  id: number;
  weight: number;
  lure: string;
  time: string;
  lake: string;
  badge: {
    name: string;
    icon: React.ComponentType<any>;
    color: string;
  };
  tournamentId: string;
  catchId: string;
}

export interface UserProfile {
  name: string;
  title: string;
  location: string;
  badges: number;
  personalBest: {
    weight: number;
    location: string;
    date: string;
    lure?: string;
    technique?: string;
  };
}

export interface CareerStats {
  tournaments: number;
  wins: number;
  aoyTitles: number;
  personalBest: number;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  top10: number;
  top20: number;
}

export interface SeasonSnapshot {
  tournamentsFished: number;
  aoyPoints: number;
  avgFinish: string;
  trend: string;
  top10Finishes: number;
  top20Finishes: number;
  finishesInMoney: number;
}

export interface ClubSeasonSnapshot {
  clubName: string;
  clubAcronym: string;
  clubLogo: string;
  tournamentsFished: number;
  top10Finishes: number;
  aoyPosition: string;
  aoyDelta: string;
  points: number;
}

export interface PublicProfile {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  titleLine?: string;
  homeClub: string;
  location: string;
  stats: {
    wins: number;
    aoyTitles: number;
    top10: number;
    pbWeight: string;
  };
  achievements: Array<{
    id: string;
    name: string;
    icon: React.ComponentType<any>;
  }>;
  seasonSnapshot: SeasonSnapshot;
  clubSeasonSnapshots?: Record<string, ClubSeasonSnapshot>;
  highlights?: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    image: string;
    date: string;
    stats: string;
  }>;
  clubDetails?: Record<string, {
    name: string;
    logo: string;
    acronym: string;
  }>;
  clubInboxMessages?: Array<{
    id: string;
    from: string;
    fromLogo: string;
    subject: string;
    preview: string;
    date: string;
    isRead: boolean;
    isClubMessage: boolean;
  }>;
  recentCatches: Array<{
    lake: string;
    weight: string;
    length: string;
    date: string;
  }>;
  clubs: string[];
}