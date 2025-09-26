import React from 'react';
import { Fish, Zap, Target, Waves, Anchor, Compass, PlusCircle } from 'lucide-react';

const techniqueIcons: Record<string, React.ComponentType<any>> = {
  // Power Presentations
  'Flipping & Pitching': Target,
  'Texas Rig Power': Anchor,
  'Football Jig Dragging': Compass,
  'Deep Crankbait': Waves,
  'Heavy Swim Jig': Zap,
  'Punching': Target,
  'Big Swimbaits': Fish,
  
  // Finesse Presentations
  'Drop Shot': Target,
  'Ned Rig': Fish,
  'Shaky Head': Waves,
  'Wacky Rig': Compass,
  'Mid-Strolling/Hover-Strolling': Waves,
  'Light Texas Rig (finesse)': Anchor,
  'Weightless Soft Plastics': Fish,
};

interface TechniqueIconProps {
  technique: string;
  className?: string;
}

export function TechniqueIcon({ technique, className = "w-4 h-4" }: TechniqueIconProps) {
  const IconComponent = techniqueIcons[technique] || PlusCircle;
  
  return <IconComponent className={className} />;
}