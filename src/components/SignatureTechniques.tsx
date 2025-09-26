import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, GripVertical, Target } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const POWER_PRESENTATIONS = [
  'Flipping & Pitching',
  'Texas Rig Power',
  'Football Jig Dragging',
  'Deep Crankbait',
  'Heavy Swim Jig',
  'Punching',
  'Big Swimbaits'
];

const FINESSE_PRESENTATIONS = [
  'Drop Shot',
  'Ned Rig',
  'Shaky Head',
  'Wacky Rig',
  'Mid-Strolling/Hover-Strolling',
  'Light Texas Rig (finesse)',
  'Weightless Soft Plastics'
];

interface SortableItemProps {
  id: string;
  technique: string;
  index: number;
  onRemove: (technique: string) => void;
}

function SortableItem({ id, technique, index, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-3 p-3 bg-accent rounded-lg border"
    >
      <div {...listeners} className="cursor-grab">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          #{index + 1}
        </Badge>
        <span className="text-sm font-medium">{technique}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(technique)}
        className="h-6 w-6 p-0 hover:bg-destructive/10"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}

interface SignatureTechniquesProps {
  value?: string[];
  onChange: (techniques: string[]) => void;
  disabled?: boolean;
  showTitle?: boolean;
}

export function SignatureTechniques({ 
  value = [], 
  onChange, 
  disabled = false, 
  showTitle = true 
}: SignatureTechniquesProps) {
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>(value);
  const [selectedCategory, setSelectedCategory] = useState<'power' | 'finesse'>('power');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setSelectedTechniques(value);
  }, [value]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = selectedTechniques.findIndex(t => t === active.id);
      const newIndex = selectedTechniques.findIndex(t => t === over.id);
      
      const newOrder = arrayMove(selectedTechniques, oldIndex, newIndex);
      setSelectedTechniques(newOrder);
      onChange(newOrder);
    }
  };

  const addTechnique = () => {
    if (!selectedTechnique || selectedTechniques.includes(selectedTechnique) || selectedTechniques.length >= 3) {
      return;
    }

    const newTechniques = [...selectedTechniques, selectedTechnique];
    setSelectedTechniques(newTechniques);
    onChange(newTechniques);
    setSelectedTechnique('');
  };

  const removeTechnique = (technique: string) => {
    const newTechniques = selectedTechniques.filter(t => t !== technique);
    setSelectedTechniques(newTechniques);
    onChange(newTechniques);
  };

  const availableTechniques = selectedCategory === 'power' ? POWER_PRESENTATIONS : FINESSE_PRESENTATIONS;
  const remainingTechniques = availableTechniques.filter(t => !selectedTechniques.includes(t));

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Signature Techniques & Strengths
          </CardTitle>
          <CardDescription>
            Select up to 3 fishing techniques that represent your strengths. Drag to reorder by preference.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Add Technique Section */}
        {selectedTechniques.length < 3 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value: 'power' | 'finesse') => {
                    setSelectedCategory(value);
                    setSelectedTechnique('');
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="power">Power Presentations</SelectItem>
                    <SelectItem value="finesse">Finesse Presentations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Technique</label>
                <Select 
                  value={selectedTechnique} 
                  onValueChange={setSelectedTechnique}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose technique" />
                  </SelectTrigger>
                  <SelectContent>
                    {remainingTechniques.map((technique) => (
                      <SelectItem key={technique} value={technique}>
                        {technique}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="button"
              onClick={addTechnique}
              disabled={!selectedTechnique || selectedTechniques.length >= 3 || disabled}
              className="w-full"
            >
              Add Technique ({selectedTechniques.length}/3)
            </Button>
          </div>
        )}

        {/* Selected Techniques */}
        {selectedTechniques.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Your Signature Techniques</h4>
              <Badge variant="outline" className="text-xs">
                {selectedTechniques.length}/3 selected
              </Badge>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedTechniques}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {selectedTechniques.map((technique, index) => (
                    <SortableItem
                      key={technique}
                      id={technique}
                      technique={technique}
                      index={index}
                      onRemove={removeTechnique}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            
            <p className="text-xs text-muted-foreground">
              Drag techniques to reorder by preference. #1 is your strongest technique.
            </p>
          </div>
        )}

        {selectedTechniques.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No techniques selected yet</p>
            <p className="text-xs">Choose your signature fishing techniques above</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}