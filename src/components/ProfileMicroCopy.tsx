import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Trophy, Calendar, Fish, Target, Edit3, MapPin, Building } from 'lucide-react';
import { TechniqueIcon } from './TechniqueIcon';

interface ProfileData {
  id: string;
  name: string;
  club: string | null;
  city: string | null;
  home_state: string | null;
  signature_techniques: string[];
  tournaments_fished: number;
  aoy_titles: number;
  biggest_catch_weight: number | null;
  biggest_catch_species: string | null;
  favorite_water: string | null;
  club_data?: {
    name: string;
    location: string | null;
  };
}

interface ProfileMicroCopyProps {
  profile: ProfileData;
  isOwner: boolean;
  onEditTechniques?: () => void;
  children: React.ReactNode;
}

export function ProfileMicroCopy({ profile, isOwner, onEditTechniques, children }: ProfileMicroCopyProps) {
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  const quickActions = (
    <div className="space-y-3">
      {/* Profile Info */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Profile Info</h4>
        <div className="space-y-1 text-sm">
          {profile.club_data && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span>{profile.club_data.name}</span>
            </div>
          )}
          {(profile.city || profile.home_state) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>
                {[profile.city, profile.home_state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Signature Techniques */}
      {profile.signature_techniques.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Signature Techniques
            </h4>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditTechniques}
                className="h-auto p-1"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {profile.signature_techniques.slice(0, 3).map((technique, index) => (
              <div key={technique} className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="w-6 h-5 text-xs flex items-center justify-center p-0">
                  {index + 1}
                </Badge>
                <TechniqueIcon technique={technique} className="w-3 h-3" />
                <span className="text-xs">{technique}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs">{profile.tournaments_fished} Tournaments</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-trophy-gold" />
            <span className="text-xs">{profile.aoy_titles} AOY Titles</span>
          </div>
          {profile.biggest_catch_weight && (
            <div className="flex items-center gap-2 col-span-2">
              <Fish className="w-4 h-4 text-water-blue" />
              <span className="text-xs">
                {profile.biggest_catch_weight} lbs {profile.biggest_catch_species}
              </span>
            </div>
          )}
          {profile.favorite_water && (
            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs">Favorite: {profile.favorite_water}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Quick Actions</h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="w-3 h-3 mr-1" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Trophy className="w-3 h-3 mr-1" />
            Compare
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: Tooltip with micro-copy */}
      <div className="hidden md:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              {children}
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-4 max-w-xs" side="right">
            {quickActions}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Mobile: Long press for sheet */}
      <div className="md:hidden">
        <div
          className="cursor-pointer"
          onTouchStart={(e) => {
            const timeoutId = setTimeout(() => {
              setShowMobileSheet(true);
            }, 500);
            
            const cleanup = () => {
              clearTimeout(timeoutId);
              document.removeEventListener('touchend', cleanup);
              document.removeEventListener('touchmove', cleanup);
            };
            
            document.addEventListener('touchend', cleanup);
            document.addEventListener('touchmove', cleanup);
          }}
        >
          {children}
        </div>

        <Sheet open={showMobileSheet} onOpenChange={setShowMobileSheet}>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
            <SheetHeader className="text-left mb-4">
              <SheetTitle>{profile.name}</SheetTitle>
              <SheetDescription>Profile quick actions and info</SheetDescription>
            </SheetHeader>
            {quickActions}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}