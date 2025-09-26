import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Enhanced demo data that doesn't require database insertion
export const DEMO_PROFILES = [
  {
    id: 'demo-jake-patterson',
    name: 'Jake Patterson',
    club: 'Alabama Bass Nation - Chapter 12',
    avatar_url: '/src/assets/profiles/jake-patterson.jpg',
    home_state: 'Alabama',
    city: 'Huntsville',
    tournaments_fished: 47,
    aoy_titles: 2,
    biggest_catch_weight: 8.3,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Lake Guntersville, AL',
    favorite_water: 'Lake Guntersville',
    signature_techniques: ['Chatterbait', 'Spinnerbait', 'Topwater'],
    role: 'vice_president',
    is_demo: true
  },
  {
    id: 'demo-maria-santos',
    name: 'Maria Santos',
    club: 'Alabama Bass Nation - Chapter 12',
    avatar_url: '/src/assets/profiles/maria-santos.jpg',
    home_state: 'Alabama',
    city: 'Madison',
    tournaments_fished: 52,
    aoy_titles: 3,
    biggest_catch_weight: 7.9,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Wheeler Lake, AL',
    favorite_water: 'Wheeler Lake',
    signature_techniques: ['Drop Shot', 'Carolina Rig', 'Jig'],
    role: 'president',
    is_demo: true
  },
  {
    id: 'demo-tommy-lee',
    name: 'Tommy Lee',
    club: 'Alabama Bass Nation - Chapter 12',
    avatar_url: '/src/assets/profiles/tommy-lee.jpg',
    home_state: 'Alabama',
    city: 'Decatur',
    tournaments_fished: 31,
    aoy_titles: 1,
    biggest_catch_weight: 6.8,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Pickwick Lake, TN',
    favorite_water: 'Tennessee River System',
    signature_techniques: ['Crankbait', 'Jerkbait', 'Alabama Rig'],
    role: 'secretary',
    is_demo: true
  },
  {
    id: 'demo-chris-wilson',
    name: 'Chris Wilson',
    club: 'Alabama Bass Nation - Chapter 12',
    avatar_url: '/src/assets/profiles/chris-wilson.jpg',
    home_state: 'Alabama',
    city: 'Florence',
    tournaments_fished: 38,
    aoy_titles: 1,
    biggest_catch_weight: 7.2,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Wilson Lake, AL',
    favorite_water: 'Wilson Lake',
    signature_techniques: ['Texas Rig', 'Flipping', 'Punch Rig'],
    role: 'treasurer',
    is_demo: true
  },
  {
    id: 'demo-mike-rodriguez',
    name: 'Mike Rodriguez',
    club: 'Texas Bass Chasers',
    avatar_url: '/src/assets/profiles/mike-rodriguez.jpg',
    home_state: 'Texas',
    city: 'Austin',
    tournaments_fished: 68,
    aoy_titles: 4,
    biggest_catch_weight: 9.1,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Lake Fork, TX',
    favorite_water: 'East Texas Lakes',
    signature_techniques: ['Deep Cranking', 'Football Jig', 'Carolina Rig'],
    role: 'president',
    is_demo: true
  },
  {
    id: 'demo-sarah-johnson',
    name: 'Sarah Johnson',
    club: 'Hill Country Anglers',
    avatar_url: '/src/assets/profiles/sarah-johnson.jpg',
    home_state: 'Texas',
    city: 'San Antonio',
    tournaments_fished: 41,
    aoy_titles: 2,
    biggest_catch_weight: 8.7,
    biggest_catch_species: 'Largemouth Bass',
    biggest_catch_location: 'Falcon Lake, TX',
    favorite_water: 'Rio Grande Lakes',
    signature_techniques: ['Topwater', 'Swimbait', 'Chatterbait'],
    role: 'tournament_director',
    is_demo: true
  }
];

export const DEMO_TOURNAMENT_RESULTS = [
  {
    tournament: 'Smith Lake Championship',
    date: '2024-09-14',
    results: [
      { angler: 'Jake Patterson', weight: 17.8, technique: 'Chatterbait & Jig' },
      { angler: 'Maria Santos', weight: 16.3, technique: 'Drop Shot & Carolina Rig' },
      { angler: 'Chris Wilson', weight: 15.7, technique: 'Flipping Jig' },
      { angler: 'Tommy Lee', weight: 14.2, technique: 'Crankbait' }
    ]
  },
  {
    tournament: 'Wheeler Lake Open',
    date: '2024-08-17',
    results: [
      { angler: 'Maria Santos', weight: 18.9, technique: 'Jig in Grass' },
      { angler: 'Tommy Lee', weight: 17.1, technique: 'Alabama Rig' },
      { angler: 'Jake Patterson', weight: 16.8, technique: 'Spinnerbait' }
    ]
  },
  {
    tournament: 'Lake Fork Big Bass',
    date: '2024-09-28',
    results: [
      { angler: 'Mike Rodriguez', weight: 21.3, technique: 'Deep Crankbait' },
      { angler: 'Sarah Johnson', weight: 19.7, technique: 'Swimbait' }
    ]
  }
];

export const DEMO_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'demo-activity-1',
    type: 'catch' as const,
    user: 'Chris Wilson',
    avatar: '/src/assets/profiles/chris-wilson.jpg',
    action: 'caught a personal best',
    details: '8.2 lb bass on punch rig at Guntersville',
    timestamp: '2 hours ago',
    is_demo: true
  },
  {
    id: 'demo-activity-2',
    type: 'tournament' as const,
    user: 'Maria Santos',
    avatar: '/src/assets/profiles/maria-santos.jpg',
    action: 'won the Wheeler Lake Open',
    details: '18.9 lbs with 5-fish limit',
    timestamp: '1 day ago',
    is_demo: true
  },
  {
    id: 'demo-activity-3',
    type: 'technique' as const,
    user: 'Jake Patterson',
    avatar: '/src/assets/profiles/jake-patterson.jpg',
    action: 'shared a technique tip',
    details: '"Chatterbait presentation in shallow grass"',
    timestamp: '2 days ago',
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