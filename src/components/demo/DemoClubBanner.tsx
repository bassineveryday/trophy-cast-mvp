import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Users, Settings, Crown, Shield, Calendar, FileText, DollarSign, Leaf, User } from 'lucide-react';
import { useDemoMode, DEMO_CLUB } from '@/contexts/DemoModeContext';
import { cn } from '@/lib/utils';

const roleIcons = {
  president: Crown,
  vice_president: Shield,
  tournament_director: Calendar,
  secretary: FileText,
  treasurer: DollarSign,
  conservation_director: Leaf,
  member: User
};

interface DemoClubBannerProps {
  showOfficerTools?: boolean;
  className?: string;
}

export function DemoClubBanner({ showOfficerTools = true, className }: DemoClubBannerProps) {
  const { isDemoMode, currentDemoUser, getDemoClub } = useDemoMode();

  if (!isDemoMode || !currentDemoUser) {
    return null;
  }

  const demoClub = getDemoClub();
  const isOfficer = ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director'].includes(currentDemoUser.club_role);
  const RoleIcon = roleIcons[currentDemoUser.club_role as keyof typeof roleIcons] || User;

  return (
    <Card className={cn("border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 mb-6", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <RoleIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                {demoClub.name}
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                  Demo Club
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">
                Viewing as: <strong>{currentDemoUser.name}</strong> - {currentDemoUser.club_role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>
          
          {isOfficer && showOfficerTools && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Officer Access
              </Badge>
            </div>
          )}
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {isOfficer ? (
              <>You have <strong>{currentDemoUser.club_role.replace('_', ' ')}</strong> access to club management tools. All changes are for demo purposes only.</>
            ) : (
              <>You're viewing as a regular club member. You can log catches, join tournaments, and view club information.</>
            )}
          </AlertDescription>
        </Alert>

        {isOfficer && showOfficerTools && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {currentDemoUser.permissions.slice(0, 4).map((permission, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground bg-white/50 rounded p-2">
                <Users className="w-3 h-3" />
                <span>{permission.replace('_', ' ')}</span>
              </div>
            ))}
            {currentDemoUser.permissions.length > 4 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/50 rounded p-2">
                <Settings className="w-3 h-3" />
                <span>+{currentDemoUser.permissions.length - 4} more</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}