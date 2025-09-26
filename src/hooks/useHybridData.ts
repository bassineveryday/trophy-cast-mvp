import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Enhanced demo data for Alabama Bass Nation - Chapter 12
export const DEMO_PROFILES = [
  // PRESIDENT - Mike "Big Mike" Rodriguez
  {
    id: 'demo-mike-rodriguez',
    name: 'Mike Rodriguez',
    nickname: 'Big Mike',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/mike-rodriguez.jpg',
    home_state: 'Alabama',
    city: 'Madison',
    age: 52,
    tournaments_fished: 63,
    aoy_titles: 2,
    biggest_catch_weight: 9.2,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Lake Guntersville, AL',
    favorite_water: 'Lake Guntersville',
    signature_techniques: ['Football Jig Dragging', 'Deep Crankbait', 'Texas Rig Power'],
    role: 'president',
    club_role: 'president',
    years_in_club: 7,
    tournament_wins: 8,
    boat: {
      year: 2019,
      brand: 'Ranger',
      model: 'Z520L',
      nickname: 'The Office'
    },
    bio: 'Retired military, runs local tackle shop, known for deep water expertise',
    is_demo: true
  },
  // VICE PRESIDENT - Sarah "Fish Whisperer" Johnson
  {
    id: 'demo-sarah-johnson',
    name: 'Sarah Johnson',
    nickname: 'Fish Whisperer',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/sarah-johnson.jpg',
    home_state: 'Alabama',
    city: 'Huntsville',
    age: 38,
    tournaments_fished: 48,
    aoy_titles: 1,
    biggest_catch_weight: 6.9,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Wheeler Lake, AL',
    favorite_water: 'Wheeler Lake',
    signature_techniques: ['Drop Shot', 'Ned Rig', 'Shaky Head'],
    role: 'vice_president',
    club_role: 'vice_president',
    years_in_club: 5,
    tournament_wins: 6,
    boat: {
      year: 2020,
      brand: 'Phoenix',
      model: '919 Pro XP',
      nickname: 'Finesse Queen'
    },
    bio: 'Bank marketing exec, specializes in finesse techniques and tough conditions',
    is_demo: true
  },
  // TOURNAMENT DIRECTOR - Jake Patterson
  {
    id: 'demo-jake-patterson',
    name: 'Jake Patterson',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/jake-patterson.jpg',
    home_state: 'Alabama',
    city: 'Decatur',
    age: 45,
    tournaments_fished: 71,
    aoy_titles: 2,
    biggest_catch_weight: 8.2,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Pickwick Lake, TN',
    favorite_water: 'Pickwick Lake',
    signature_techniques: ['Flipping & Pitching', 'Texas Rig Power', 'Heavy Swim Jig'],
    role: 'tournament_director',
    club_role: 'tournament_director',
    years_in_club: 8,
    tournament_wins: 12,
    boat: {
      year: 2021,
      brand: 'Bass Cat',
      model: 'Puma FTD',
      nickname: 'Bass Hunter'
    },
    bio: 'Construction foreman, tournament veteran, expert at organizing events',
    is_demo: true
  },
  // SECRETARY - Lisa "Detail Queen" Thompson
  {
    id: 'demo-lisa-thompson',
    name: 'Lisa Thompson',
    nickname: 'Detail Queen',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/sarah-johnson.jpg', // Reusing available avatar
    home_state: 'Alabama',
    city: 'Athens',
    age: 42,
    tournaments_fished: 29,
    aoy_titles: 0,
    biggest_catch_weight: 5.8,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Lake Guntersville, AL',
    favorite_water: 'Lake Guntersville',
    signature_techniques: ['Wacky Rig', 'Drop Shot', 'Light Texas Rig'],
    role: 'secretary',
    club_role: 'secretary',
    years_in_club: 3,
    tournament_wins: 2,
    boat: {
      year: 2018,
      brand: 'Skeeter',
      model: 'ZX200',
      nickname: 'Southern Belle'
    },
    bio: 'School administrator, meticulous record keeper, club newsletter editor',
    is_demo: true
  },
  // TREASURER - David "Numbers" Wilson
  {
    id: 'demo-david-wilson',
    name: 'David Wilson',
    nickname: 'Numbers',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/chris-wilson.jpg',
    home_state: 'Alabama',
    city: 'Hartselle',
    age: 55,
    tournaments_fished: 54,
    aoy_titles: 0,
    biggest_catch_weight: 7.1,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Wheeler Lake, AL',
    favorite_water: 'Wheeler Lake',
    signature_techniques: ['Football Jig Dragging', 'Deep Crankbait', 'Punching'],
    role: 'treasurer',
    club_role: 'treasurer',
    years_in_club: 6,
    tournament_wins: 4,
    boat: {
      year: 2017,
      brand: 'Nitro',
      model: 'Z19',
      nickname: 'Tax Deduction'
    },
    bio: 'CPA, handles all club finances, known for ledge fishing expertise',
    is_demo: true
  },
  // CONSERVATION DIRECTOR - Tommy "Green Thumb" Lee
  {
    id: 'demo-tommy-lee',
    name: 'Tommy Lee',
    nickname: 'Green Thumb',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/tommy-lee.jpg',
    home_state: 'Alabama',
    city: 'Cullman',
    age: 39,
    tournaments_fished: 41,
    aoy_titles: 0,
    biggest_catch_weight: 6.5,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Pickwick Lake, TN',
    favorite_water: 'Tennessee River System',
    signature_techniques: ['Spinnerbait', 'Chatterbait', 'Texas Rig Power'],
    role: 'conservation_director',
    club_role: 'conservation_director',
    years_in_club: 5,
    tournament_wins: 3,
    boat: {
      year: 2019,
      brand: 'Tracker',
      model: 'Pro Team 175 TXW',
      nickname: 'Earth First'
    },
    bio: 'Environmental engineer, leads habitat restoration projects, catch-and-release advocate',
    is_demo: true
  },
  // REGULAR MEMBERS
  // Maria Santos - Regular Member
  {
    id: 'demo-maria-santos',
    name: 'Maria Santos',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/maria-santos.jpg',
    home_state: 'Alabama',
    city: 'Florence',
    age: 34,
    tournaments_fished: 25,
    aoy_titles: 0,
    biggest_catch_weight: 5.2,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Wheeler Lake, AL',
    favorite_water: 'Wheeler Lake',
    signature_techniques: ['Ned Rig', 'Shaky Head', 'Wacky Rig'],
    role: 'member',
    club_role: 'member',
    years_in_club: 2,
    tournament_wins: 1,
    boat: {
      year: 2020,
      brand: 'Xpress',
      model: 'X19 Pro',
      nickname: 'Persistence'
    },
    bio: 'Nurse practitioner, enjoys weekend tournaments and family fishing',
    is_demo: true
  },
  // Chris Martinez - Regular Member
  {
    id: 'demo-chris-martinez',
    name: 'Chris Martinez',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/chris-wilson.jpg', // Reusing available avatar
    home_state: 'Alabama',
    city: 'Muscle Shoals',
    age: 29,
    tournaments_fished: 18,
    aoy_titles: 0,
    biggest_catch_weight: 4.8,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Pickwick Lake, TN',
    favorite_water: 'Pickwick Lake',
    signature_techniques: ['Deep Crankbait', 'Football Jig', 'Spinnerbait'],
    role: 'member',
    club_role: 'member',
    years_in_club: 1,
    tournament_wins: 0,
    boat: {
      year: 2018,
      brand: 'Alumacraft',
      model: 'Pro 185',
      nickname: 'River Runner'
    },
    bio: 'Mechanical engineer, new to competitive fishing but learning fast',
    is_demo: true
  },
  // Jennifer Hayes - Regular Member
  {
    id: 'demo-jennifer-hayes',
    name: 'Jennifer Hayes',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/maria-santos.jpg', // Reusing available avatar
    home_state: 'Alabama',
    city: 'Guntersville',
    age: 36,
    tournaments_fished: 32,
    aoy_titles: 0,
    biggest_catch_weight: 6.1,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Lake Guntersville, AL',
    favorite_water: 'Lake Guntersville',
    signature_techniques: ['Drop Shot', 'Light Texas Rig', 'Weightless Soft Plastics'],
    role: 'member',
    club_role: 'member',
    years_in_club: 3,
    tournament_wins: 2,
    boat: {
      year: 2021,
      brand: 'Ranger',
      model: 'RT188P',
      nickname: 'Lady Luck'
    },
    bio: 'Real estate agent, local lake expert, loves sharing fishing knowledge',
    is_demo: true
  },
  // Robert "Tank" Foster - Regular Member
  {
    id: 'demo-robert-foster',
    name: 'Robert Foster',
    nickname: 'Tank',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/mike-johnson.jpg',
    home_state: 'Alabama',
    city: 'Arab',
    age: 44,
    tournaments_fished: 56,
    aoy_titles: 1,
    biggest_catch_weight: 8.8,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Lake Guntersville, AL',
    favorite_water: 'Lake Guntersville',
    signature_techniques: ['Punching', 'Heavy Swim Jig', 'Big Swimbaits'],
    role: 'member',
    club_role: 'member',
    years_in_club: 4,
    tournament_wins: 5,
    boat: {
      year: 2019,
      brand: 'Triton',
      model: '20TRX',
      nickname: 'Big Stick'
    },
    bio: 'Firefighter, power fishing specialist, former AOY winner',
    is_demo: true
  }
];

export const DEMO_TOURNAMENT_RESULTS = [
  {
    tournament: 'ABN-12 Lake Guntersville Championship',
    date: '2024-09-14',
    location: 'Lake Guntersville, AL',
    results: [
      { angler: 'Jake Patterson', weight: 19.8, technique: 'Heavy Swim Jig in Grass' },
      { angler: 'Mike Rodriguez', weight: 18.3, technique: 'Football Jig on Ledges' },
      { angler: 'Robert Foster', weight: 17.7, technique: 'Punching Heavy Cover' },
      { angler: 'Sarah Johnson', weight: 16.2, technique: 'Drop Shot on Points' },
      { angler: 'David Wilson', weight: 15.9, technique: 'Deep Crankbait' }
    ]
  },
  {
    tournament: 'ABN-12 Wheeler Lake Classic',
    date: '2024-08-17',
    location: 'Wheeler Lake, AL',
    results: [
      { angler: 'Sarah Johnson', weight: 20.1, technique: 'Ned Rig in Current' },
      { angler: 'David Wilson', weight: 18.9, technique: 'Football Jig Dragging' },
      { angler: 'Tommy Lee', weight: 17.8, technique: 'Chatterbait on Grass Edges' },
      { angler: 'Jennifer Hayes', weight: 16.5, technique: 'Light Texas Rig' },
      { angler: 'Maria Santos', weight: 15.3, technique: 'Shaky Head Finesse' }
    ]
  },
  {
    tournament: 'ABN-12 Pickwick Lake Open',
    date: '2024-07-20',
    location: 'Pickwick Lake, TN',
    results: [
      { angler: 'Robert Foster', weight: 21.2, technique: 'Big Swimbait on Ledges' },
      { angler: 'Jake Patterson', weight: 19.7, technique: 'Texas Rig Power Fishing' },
      { angler: 'Mike Rodriguez', weight: 18.4, technique: 'Deep Crankbait Trolling' },
      { angler: 'Chris Martinez', weight: 16.8, technique: 'Spinnerbait in Current' }
    ]
  },
  {
    tournament: 'ABN-12 Wilson Lake Derby',
    date: '2024-06-15',
    location: 'Wilson Lake, AL',
    results: [
      { angler: 'Mike Rodriguez', weight: 22.1, technique: 'Football Jig Deep Structure' },
      { angler: 'Tommy Lee', weight: 19.6, technique: 'Spinnerbait Shallow Cover' },
      { angler: 'Lisa Thompson', weight: 17.9, technique: 'Wacky Rig Drop Offs' },
      { angler: 'Jennifer Hayes', weight: 16.7, technique: 'Drop Shot Deep Water' }
    ]
  }
];

export const DEMO_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'demo-activity-1',
    type: 'catch' as const,
    user: 'Robert Foster',
    avatar: '/src/assets/profiles/mike-johnson.jpg',
    action: 'caught a personal best',
    details: '8.8 lb bass using big swimbait at Guntersville',
    timestamp: '2 hours ago',
    is_demo: true
  },
  {
    id: 'demo-activity-2',
    type: 'tournament' as const,
    user: 'Sarah Johnson',
    avatar: '/src/assets/profiles/sarah-johnson.jpg',
    action: 'won the Wheeler Lake Classic',
    details: '20.1 lbs with 5-fish limit using Ned Rig',
    timestamp: '1 day ago',
    is_demo: true
  },
  {
    id: 'demo-activity-3',
    type: 'technique' as const,
    user: 'Jake Patterson',
    avatar: '/src/assets/profiles/jake-patterson.jpg',
    action: 'shared a technique tip',
    details: '"Heavy swim jig presentation in grass beds"',
    timestamp: '2 days ago',
    is_demo: true
  },
  {
    id: 'demo-activity-4',
    type: 'club' as const,
    user: 'Tommy Lee',
    avatar: '/src/assets/profiles/tommy-lee.jpg',
    action: 'organized habitat restoration',
    details: 'Led ABN-12 conservation project at Wilson Lake',
    timestamp: '3 days ago',
    is_demo: true
  },
  {
    id: 'demo-activity-5',
    type: 'catch' as const,
    user: 'Mike Rodriguez',
    avatar: '/src/assets/profiles/mike-rodriguez.jpg',
    action: 'landed big bass',
    details: '7.2 lb bass on football jig at deep ledge',
    timestamp: '4 days ago',
    is_demo: true
  },
  {
    id: 'demo-activity-6',
    type: 'tournament' as const,
    user: 'Jennifer Hayes',
    avatar: '/src/assets/profiles/maria-santos.jpg',
    action: 'placed 2nd in club tournament',
    details: '16.7 lbs using drop shot at Wilson Lake',
    timestamp: '5 days ago',
    is_demo: true
  },
  {
    id: 'demo-activity-7',
    type: 'technique' as const,
    user: 'David Wilson',
    avatar: '/src/assets/profiles/chris-wilson.jpg',
    action: 'updated club finances',
    details: 'Posted Q3 financial report and tournament payouts',
    timestamp: '1 week ago',
    is_demo: true
  },
  {
    id: 'demo-activity-8',
    type: 'club' as const,
    user: 'Lisa Thompson',
    avatar: '/src/assets/profiles/sarah-johnson.jpg',
    action: 'published club newsletter',
    details: 'September ABN-12 newsletter with tournament recaps',
    timestamp: '1 week ago',
    is_demo: true
  }
];

interface ActivityItem {
  id: string;
  type: 'catch' | 'tournament' | 'technique' | 'club';
  user: string;
  avatar?: string;
  action: string;
  details: string;
  timestamp: string;
  is_demo?: boolean;
}

interface HybridDataOptions {
  includeDemo?: boolean;
  maxDemoItems?: number;
  demoFillThreshold?: number; // Minimum real items before adding demo
}

export function useHybridData() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    showDemoContent: true,
    demoContentLevel: 'enhanced' // 'none', 'minimal', 'enhanced', 'full'
  });

  // Get user's demo content preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        const saved = localStorage.getItem(`demo_preferences_${user.id}`);
        if (saved) {
          setPreferences(JSON.parse(saved));
        }
      }
    };
    loadPreferences();
  }, [user]);

  // Save preferences
  const updatePreferences = (newPrefs: typeof preferences) => {
    setPreferences(newPrefs);
    if (user) {
      localStorage.setItem(`demo_preferences_${user.id}`, JSON.stringify(newPrefs));
    }
  };

  // Combine real data with demo data based on preferences
  const combineWithDemo = <T extends any>(
    realData: T[],
    demoData: T[],
    options: HybridDataOptions = {}
  ): T[] => {
    const {
      includeDemo = preferences.showDemoContent,
      maxDemoItems = 10,
      demoFillThreshold = 3
    } = options;

    if (!includeDemo || preferences.demoContentLevel === 'none') {
      return realData;
    }

    // If we have enough real data, maybe just add a few demo items
    if (realData.length >= demoFillThreshold) {
      if (preferences.demoContentLevel === 'minimal') {
        return [...realData, ...demoData.slice(0, 2)];
      } else if (preferences.demoContentLevel === 'enhanced') {
        return [...realData, ...demoData.slice(0, Math.min(maxDemoItems, 5))];
      }
    }

    // If we have little real data, add more demo content to fill the experience
    const demoToAdd = Math.min(
      maxDemoItems,
      preferences.demoContentLevel === 'full' ? demoData.length : maxDemoItems - realData.length
    );

    return [...realData, ...demoData.slice(0, demoToAdd)];
  };

  // Get enhanced tournament leaderboard with demo data
  const getEnhancedTournamentResults = async (tournamentId?: string) => {
    try {
      let query = supabase
        .from('catches')
        .select(`
          id, weight, user_id, species, notes, timestamp, created_at, updated_at, length, photo_url, tournament_id
        `)
        .order('weight', { ascending: false });

      if (tournamentId) {
        query = query.eq('tournament_id', tournamentId);
      }

      const { data: realResults } = await query.limit(20);

      // Get profiles separately to avoid relation issues
      const userIds = realResults?.map(r => r.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name, avatar_url, home_state, club, is_demo')
        .in('user_id', userIds);

      // Combine results with profile data
      const enhancedRealResults = (realResults || []).map(result => ({
        ...result,
        profiles: profiles?.find(p => p.user_id === result.user_id) || {
          name: 'Unknown Angler',
          avatar_url: null,
          home_state: null,
          club: null,
          is_demo: false
        }
      }));
      
      // Convert demo tournament results to match the real data format
      const demoResults = DEMO_TOURNAMENT_RESULTS.flatMap(tournament => 
        tournament.results.map(result => {
          const demoProfile = DEMO_PROFILES.find(p => p.name === result.angler);
          return {
            id: `demo-result-${result.angler.toLowerCase().replace(' ', '-')}`,
            weight: result.weight,
            user_id: `demo-${result.angler.toLowerCase().replace(' ', '-')}`,
            species: 'Largemouth Bass',
            notes: result.technique,
            timestamp: tournament.date,
            created_at: tournament.date,
            updated_at: tournament.date,
            length: 20,
            photo_url: null,
            tournament_id: tournamentId || null,
            profiles: demoProfile ? {
              name: demoProfile.name,
              avatar_url: demoProfile.avatar_url,
              home_state: demoProfile.home_state,
              club: demoProfile.club,
              is_demo: true
            } : {
              name: result.angler,
              avatar_url: null,
              home_state: null,
              club: null,
              is_demo: true
            }
          };
        })
      );

      return combineWithDemo(enhancedRealResults, demoResults as any, {
        maxDemoItems: 8,
        demoFillThreshold: 3
      });
    } catch (error) {
      console.error('Error fetching tournament results:', error);
      return [];
    }
  };

  // Get enhanced club activity feed
  const getEnhancedClubActivity = async () => {
    try {
      // Fetch real recent catches and activities
      const { data: realCatches } = await supabase
        .from('catches')
        .select(`
          *,
          profiles:user_id(name, avatar_url, club, is_demo)
        `)
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })
        .limit(10);

      // Transform real catches to activity format
      const realActivity: ActivityItem[] = (realCatches || []).map(catch_data => ({
        id: catch_data.id,
        type: 'catch' as const,
        user: (catch_data.profiles as any)?.name || 'Unknown Angler',
        avatar: (catch_data.profiles as any)?.avatar_url,
        action: `caught ${catch_data.weight} lbs`,
        details: `${catch_data.species} using ${catch_data.notes || 'various techniques'}`,
        timestamp: new Date(catch_data.timestamp).toLocaleString(),
        is_demo: (catch_data.profiles as any)?.is_demo || false
      }));

      return combineWithDemo(realActivity, DEMO_RECENT_ACTIVITY, {
        maxDemoItems: 6,
        demoFillThreshold: 2
      });
    } catch (error) {
      console.error('Error fetching club activity:', error);
      return DEMO_RECENT_ACTIVITY;
    }
  };

  // Get enhanced club member list
  const getEnhancedClubMembers = async (clubId?: string) => {
    try {
      const { data: realMembers } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_demo', false)
        .order('name');

      // Transform DEMO_PROFILES to match the database profile structure
      const transformedDemoProfiles = DEMO_PROFILES.map(demo => ({
        ...demo,
        user_id: demo.id,
        club_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      return combineWithDemo(realMembers || [], transformedDemoProfiles, {
        maxDemoItems: 6,
        demoFillThreshold: 2
      });
    } catch (error) {
      console.error('Error fetching club members:', error);
      return DEMO_PROFILES;
    }
  };

  return {
    preferences,
    updatePreferences,
    combineWithDemo,
    getEnhancedTournamentResults,
    getEnhancedClubActivity,
    getEnhancedClubMembers,
    demoProfiles: DEMO_PROFILES,
    demoTournamentResults: DEMO_TOURNAMENT_RESULTS,
    demoActivity: DEMO_RECENT_ACTIVITY
  };
}