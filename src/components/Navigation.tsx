import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings, Trophy, ChevronDown, Calendar, Bell, Plus, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsClubOfficer } from '@/hooks/useRoles';

export function Navigation() {
  const { user, profile, signOut } = useAuth();
  const isClubOfficer = useIsClubOfficer();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
  };

  const initials = profile?.name 
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="flex items-center justify-between p-4">
      {/* Tournaments Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Tournaments</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-background border shadow-lg z-50" 
          align="start"
        >
          <DropdownMenuItem asChild>
            <Link to="/tournaments" className="flex items-center">
              <Trophy className="mr-2 h-4 w-4" />
              Tournament Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/tournament-alerts" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Tournament Alerts
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/leaderboard" className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              Leaderboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/my-catches" className="flex items-center">
              <Target className="mr-2 h-4 w-4" />
              My Catches
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/calendar" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Tournament Calendar
            </Link>
          </DropdownMenuItem>
          {isClubOfficer && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/tournaments" className="flex items-center text-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tournament
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.name || user.email || ''} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-background border shadow-lg z-50" 
          align="end" 
          forceMount
        >
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">
              {profile?.name || user.email}
            </p>
            {profile?.club && (
              <p className="text-xs leading-none text-muted-foreground">
                {profile.club}
              </p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}