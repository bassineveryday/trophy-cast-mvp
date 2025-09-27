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
    description: 'Full admin access to club management and oversight tools'
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
    id: 'demo-jake-patterson',
    name: 'Jake Patterson',
    role: 'tournament_director',
    club_role: 'tournament_director',
    club: 'Alabama Bass Nation - Chapter 12',
    club_abbreviation: 'ABN-12',
    avatar_url: '/src/assets/profiles/jake-patterson.jpg',
    permissions: [
      'tournament_creation',
      'tournament_management',
      'live_scoring',
      'registration_tools',
      'equipment_management'
    ],
    description: 'Tournament creation, live scoring, and event logistics management'
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
    
    // Navigate to appropriate club page based on role
    if (navigate) {
      const isOfficer = ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director'].includes(user.club_role);
      
      // Use setTimeout to ensure state update completes before navigation
      setTimeout(() => {
        if (isOfficer) {
          window.location.href = `/clubs/${DEMO_CLUB.id}/manage`;
        } else {
          window.location.href = '/club-dashboard';
        }
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