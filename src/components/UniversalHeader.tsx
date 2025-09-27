import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsClubOfficer } from '@/hooks/useRoles';

interface UniversalHeaderProps {
  title?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
  customActions?: React.ReactNode;
}

export function UniversalHeader({ 
  title, 
  showBreadcrumb = false, 
  breadcrumbItems = [],
  customActions 
}: UniversalHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const isClubOfficer = useIsClubOfficer();

  // Determine home route based on user role
  const getHomeRoute = () => {
    if (isClubOfficer) {
      // For now, default to demo club for officers
      // In the future, this could use profile.club_id when available
      return '/clubs/demo-alabama-bass-chapter-12/manage';
    }
    return '/profile';
  };

  // Get page title from route if not provided
  const getPageTitle = () => {
    if (title) return title;
    
    const path = location.pathname;
    if (path.includes('/clubs/') && path.includes('/manage')) return 'Club Management';
    if (path.includes('/tournaments')) return 'Tournaments';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/catches')) return 'My Catches';
    if (path.includes('/leaderboard')) return 'Leaderboard';
    if (path.includes('/messages')) return 'Messages';
    if (path.includes('/gear')) return 'Gear';
    if (path.includes('/plans')) return 'Plans';
    if (path.includes('/ai-coach')) return 'AI Coach';
    if (path === '/') return 'Dashboard';
    
    return 'TrophyCast';
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate(getHomeRoute());
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Navigation buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-11 w-11 p-0 hover:bg-accent"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHome}
            className="h-11 w-11 p-0 hover:bg-accent"
            aria-label="Go to home"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>

        {/* Center - Title and breadcrumb */}
        <div className="flex-1 min-w-0 mx-4">
          {showBreadcrumb && breadcrumbItems.length > 0 ? (
            <nav className="flex items-center text-sm text-muted-foreground">
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {item.href ? (
                    <button
                      onClick={() => navigate(item.href!)}
                      className="hover:text-foreground transition-colors truncate"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="font-medium text-foreground truncate">
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          ) : (
            <h1 className="text-lg font-semibold text-foreground truncate text-center">
              {getPageTitle()}
            </h1>
          )}
        </div>

        {/* Right side - Custom actions */}
        <div className="flex items-center space-x-2">
          {customActions}
        </div>
      </div>
    </header>
  );
}