import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Crown, Shield, Calendar, FileText, DollarSign, Leaf, User } from 'lucide-react';
import { useDemoMode, DEMO_USERS } from '@/contexts/DemoModeContext';
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

const roleColors = {
  president: 'bg-gradient-to-r from-amber-500 to-amber-600',
  vice_president: 'bg-gradient-to-r from-blue-500 to-blue-600',
  tournament_director: 'bg-gradient-to-r from-green-500 to-green-600',
  secretary: 'bg-gradient-to-r from-purple-500 to-purple-600',
  treasurer: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
  conservation_director: 'bg-gradient-to-r from-teal-500 to-teal-600',
  member: 'bg-gradient-to-r from-slate-500 to-slate-600'
};

export function DemoUserSwitcher() {
  const { isDemoMode, currentDemoUser, switchToDemoUser, exitDemoMode } = useDemoMode();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in non-production environments
  const isDevMode = import.meta.env.DEV || window.location.hostname.includes('lovableproject.com');
  
  if (!isDevMode) return null;

  const handleUserSwitch = (user: typeof DEMO_USERS[0]) => {
    switchToDemoUser(user);
    setIsOpen(false);
  };

  return (
    <>
      {/* Demo Mode Banner */}
      {isDemoMode && currentDemoUser && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                DEMO MODE
              </Badge>
              <span className="text-sm font-medium">
                Viewing as: <strong>{currentDemoUser.name}</strong> - {currentDemoUser.club_role.replace('_', ' ').toTitle()}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={exitDemoMode}
              className="text-white hover:bg-white/20"
            >
              Exit Demo
            </Button>
          </div>
        </div>
      )}

      {/* Floating Demo Switcher Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "fixed bottom-6 right-6 z-40 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
              isDemoMode 
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            )}
            size="lg"
          >
            <Users className="w-5 h-5 mr-2" />
            {isDemoMode ? 'Switch User' : 'Demo Mode'}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Choose Your Demo Experience
            </DialogTitle>
            <p className="text-muted-foreground text-center">
              Experience TrophyCast from different club officer perspectives
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {DEMO_USERS.map((user) => {
              const IconComponent = roleIcons[user.club_role as keyof typeof roleIcons];
              const isCurrentUser = currentDemoUser?.id === user.id;
              
              return (
                <div
                  key={user.id}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg",
                    isCurrentUser 
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {isCurrentUser && (
                    <Badge className="absolute -top-2 -right-2 bg-primary">
                      Current
                    </Badge>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.avatar_url} alt={user.name} />
                      <AvatarFallback className={roleColors[user.club_role as keyof typeof roleColors]}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">
                          {user.name}
                          {user.nickname && (
                            <span className="text-muted-foreground text-sm ml-1">
                              "{user.nickname}"
                            </span>
                          )}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {user.club_role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {user.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {user.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {user.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{user.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => handleUserSwitch(user)}
                        disabled={isCurrentUser}
                        className="w-full"
                        variant={isCurrentUser ? "outline" : "default"}
                      >
                        {isCurrentUser ? 'Current View' : `Switch to ${user.name.split(' ')[0]}`}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isDemoMode && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-500">Demo Mode Active</Badge>
              </div>
              <p className="text-sm text-orange-800 mb-3">
                You're currently experiencing TrophyCast in demo mode. All actions only affect demo data and won't impact real users or clubs.
              </p>
              <Button 
                onClick={exitDemoMode} 
                variant="outline" 
                size="sm"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Exit Demo Mode
              </Button>
            </div>
          )}

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              🛡️ Demo mode is safe - no real data is affected | Available in development environments only
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// String prototype extension for title case (used above)
declare global {
  interface String {
    toTitle(): string;
  }
}

String.prototype.toTitle = function() {
  return this.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};