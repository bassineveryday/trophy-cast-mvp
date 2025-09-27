import { Home, Trophy, Users, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useIsClubOfficer } from '@/hooks/useRoles';

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/',
    description: 'Dashboard'
  },
  {
    id: 'tournaments',
    label: 'Tournaments',
    icon: Trophy,
    path: '/tournaments',
    description: 'Events & Results'
  },
  {
    id: 'club',
    label: 'Club',
    icon: Users,
    path: '/clubs',
    description: 'Community & Management'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile',
    description: 'Stats & Settings'
  }
];

export function BottomNavigation() {
  const location = useLocation();
  const { user } = useAuth();
  const isClubOfficer = useIsClubOfficer();

  if (!user) return null;

  // Don't show bottom navigation on certain pages
  const hideOnPaths = ['/auth', '/ai-coach'];
  const shouldHide = hideOnPaths.some(path => location.pathname.startsWith(path));
  
  if (shouldHide) return null;

  const getNavPath = (item: typeof navigationItems[0]) => {
    // Smart routing based on user role
    if (item.id === 'club' && isClubOfficer) {
      return '/clubs/demo-alabama-bass-chapter-12/manage';
    }
    return item.path;
  };

  const isActive = (item: typeof navigationItems[0]) => {
    if (item.id === 'home') {
      return location.pathname === '/';
    }
    if (item.id === 'tournaments') {
      return location.pathname.startsWith('/tournament') || location.pathname === '/tournaments';
    }
    if (item.id === 'club') {
      return location.pathname.startsWith('/club') || location.pathname.includes('/clubs');
    }
    if (item.id === 'profile') {
      return location.pathname.startsWith('/profile') || location.pathname.startsWith('/angler');
    }
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const path = getNavPath(item);
          
          return (
            <Link
              key={item.id}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                "hover:bg-accent/50 active:bg-accent",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-all",
                  active && "scale-110"
                )} 
              />
              <span 
                className={cn(
                  "text-xs font-medium transition-all",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}