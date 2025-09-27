import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Crown, Shield, Calendar, FileText, DollarSign, Leaf, User, Users, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useUserClubs } from '@/hooks/useClubMembership';
import { useUserEffectiveRoles } from '@/hooks/useRBAC';

const roleIcons = {
  president: Crown,
  vice_president: Shield,
  tournament_director: Calendar,
  secretary: FileText,
  treasurer: DollarSign,
  conservation_director: Leaf,
  member: User
};

const welcomeMessages = {
  president: "Ready to lead your club to success!",
  vice_president: "Supporting your club's growth and engagement.",
  tournament_director: "Time to create amazing tournament experiences!",
  secretary: "Keeping your club organized and informed.",
  treasurer: "Managing your club's financial health.",
  conservation_director: "Protecting our waters for future generations.",
  member: "Ready for your next fishing adventure!"
};

export function PersonalizedWelcome() {
  const { profile } = useAuth();
  const { isDemoMode, currentDemoUser, getDemoClub } = useDemoMode();
  const { data: userClubs = [] } = useUserClubs();
  const primaryClub = userClubs[0]?.club;
  
  // Get user's roles
  const { data: userRoles = [] } = useUserEffectiveRoles(primaryClub?.id);
  const highestRole = userRoles[0]?.role_name || 'member';

  // Determine display data based on mode
  const displayUser = isDemoMode ? currentDemoUser : profile;
  const displayClub = isDemoMode ? getDemoClub() : primaryClub;
  const userRole = isDemoMode ? currentDemoUser?.club_role || 'member' : highestRole;
  const RoleIcon = roleIcons[userRole as keyof typeof roleIcons] || User;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={displayUser?.avatar_url} alt={displayUser?.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {displayUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{displayUser?.name || 'Welcome!'}</h2>
                {isDemoMode && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                    Demo Mode
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <RoleIcon className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="text-xs">
                  {userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                {displayClub && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{displayClub.name}</span>
                  </>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {welcomeMessages[userRole as keyof typeof welcomeMessages]}
              </p>
            </div>
          </div>

          {/* Notification indicator */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Bell className="w-6 h-6 text-muted-foreground" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs text-destructive-foreground font-bold">2</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Updates</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}