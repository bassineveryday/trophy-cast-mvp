import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface DemoUser {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  club_role: string;
  club: string;
  club_abbreviation: string;
  avatar_url: string;
  permissions: string[];
  description: string;
}

// Demo Club Constants
export const DEMO_CLUB = {
  id: 'demo-alabama-bass-chapter-12',
  name: 'Alabama Bass Nation - Chapter 12',
  abbreviation: 'ABN-12',
  location: 'Alabama',
  description: 'Official Alabama Bass Nation chapter focused on tournament fishing and conservation'
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-jake-patterson',
    name: 'Jake Patterson',
    role: 'member',
    club_role: 'member',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/jake-patterson.jpg',
    permissions: [
      'personal_profile',
      'catch_logging',
      'tournament_participation',
      'view_leaderboards',
      'club_communication'
    ],
    description: 'Experience TrophyCast as a regular tournament angler - view tournaments, log catches, and connect with fellow club members'
  },
  {
    id: 'demo-mike-rodriguez',
    name: 'Mike Rodriguez',
    nickname: 'Big Mike',
    role: 'president',
    club_role: 'president',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/mike-rodriguez.jpg',
    permissions: [
      'club_management',
      'member_management', 
      'officer_assignments',
      'financial_overview',
      'tournament_management',
      'all_admin_functions'
    ],
    description: 'See the full club management experience - create tournaments, manage members, access officer tools, and oversee club operations'
  },
  {
    id: 'demo-sarah-johnson',
    name: 'Sarah Johnson',
    nickname: 'Fish Whisperer',
    role: 'vice_president',
    club_role: 'vice_president',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/sarah-johnson.jpg',
    permissions: [
      'member_management',
      'event_planning',
      'coordination_tools',
      'backup_admin_access'
    ],
    description: 'Deputy access to most president functions and event coordination'
  },
  {
    id: 'demo-lisa-thompson',
    name: 'Lisa Thompson',
    nickname: 'Detail Queen',
    role: 'secretary',
    club_role: 'secretary',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/sarah-johnson.jpg',
    permissions: [
      'communication_center',
      'newsletter_tools',
      'meeting_minutes',
      'member_directory',
      'club_correspondence'
    ],
    description: 'Communication tools, meeting minutes, and member documentation'
  },
  {
    id: 'demo-david-wilson',
    name: 'David Wilson',
    nickname: 'Numbers',
    role: 'treasurer',
    club_role: 'treasurer',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/chris-wilson.jpg',
    permissions: [
      'financial_dashboard',
      'dues_collection',
      'payment_processing',
      'budget_planning',
      'expense_tracking'
    ],
    description: 'Financial oversight, dues collection, and budget management'
  },
  {
    id: 'demo-tommy-lee',
    name: 'Tommy Lee',
    nickname: 'Green Thumb',
    role: 'conservation_director',
    club_role: 'conservation_director',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/tommy-lee.jpg',
    permissions: [
      'conservation_projects',
      'educational_content',
      'environmental_reporting',
      'habitat_tracking'
    ],
    description: 'Conservation projects and environmental education management'
  },
  {
    id: 'demo-maria-santos',
    name: 'Maria Santos',
    role: 'member',
    club_role: 'member',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/maria-santos.jpg',
    permissions: [
      'personal_profile',
      'catch_logging',
      'tournament_participation'
    ],
    description: 'Standard member view with personal features and tournament participation'
  }
];

interface DemoModeContextType {
  isDemoMode: boolean;
  currentDemoUser: DemoUser | null;
  switchToDemoUser: (user: DemoUser, navigate?: boolean) => void;
  exitDemoMode: () => void;
  hasPermission: (permission: string) => boolean;
  getDemoUserRole: () => string | null;
  getDemoClub: () => typeof DEMO_CLUB;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentDemoUser, setCurrentDemoUser] = useState<DemoUser | null>(null);

  // Load demo state from localStorage on mount
  useEffect(() => {
    const savedDemoState = localStorage.getItem('trophycast_demo_state');
    if (savedDemoState) {
      const { isDemoMode: savedIsDemoMode, currentDemoUser: savedUser } = JSON.parse(savedDemoState);
      setIsDemoMode(savedIsDemoMode);
      if (savedUser) {
        const user = DEMO_USERS.find(u => u.id === savedUser.id);
        if (user) {
          setCurrentDemoUser(user);
        }
      }
    }
  }, []);

  // Save demo state to localStorage when it changes
  useEffect(() => {
    const demoState = {
      isDemoMode,
      currentDemoUser: currentDemoUser ? { id: currentDemoUser.id } : null
    };
    localStorage.setItem('trophycast_demo_state', JSON.stringify(demoState));
  }, [isDemoMode, currentDemoUser]);

  const switchToDemoUser = (user: DemoUser, navigate = true) => {
    setCurrentDemoUser(user);
    setIsDemoMode(true);
    
    // Navigate to homepage to show role-based dashboard
    if (navigate) {
      // Use setTimeout to ensure state update completes before navigation
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    setCurrentDemoUser(null);
    localStorage.removeItem('trophycast_demo_state');
  };

  const hasPermission = (permission: string): boolean => {
    if (!isDemoMode || !currentDemoUser) return false;
    return currentDemoUser.permissions.includes(permission);
  };

  const getDemoUserRole = (): string | null => {
    if (!isDemoMode || !currentDemoUser) return null;
    return currentDemoUser.club_role;
  };

  const getDemoClub = () => DEMO_CLUB;

  return (
    <DemoModeContext.Provider value={{
      isDemoMode,
      currentDemoUser,
      switchToDemoUser,
      exitDemoMode,
      hasPermission,
      getDemoUserRole,
      getDemoClub
    }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}