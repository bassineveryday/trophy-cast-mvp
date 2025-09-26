import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Activity, Target, X } from 'lucide-react';
import { useGear } from '@/hooks/useGear';

interface ComboCreatorProps {
  onClose: () => void;
  rods: Array<{ id: string; nickname?: string; brand: string; model: string; primary_technique?: string }>;
  reels: Array<{ id: string; nickname?: string; brand: string; model: string; reel_type: string }>;
  signatureTechniques?: string[];
}

export function ComboCreator({ onClose, rods, reels, signatureTechniques = [] }: ComboCreatorProps) {
  const { createCombo } = useGear();
  
  const [saving, setSaving] = useState(false);
  const [nickname, setNickname] = useState('');
  const [selectedRodId, setSelectedRodId] = useState('');
  const [selectedReelId, setSelectedReelId] = useState('');
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const selectedRod = rods.find(rod => rod.id === selectedRodId);
  const selectedReel = reels.find(reel => reel.id === selectedReelId);

  const handleTechniqueChange = (technique: string, checked: boolean) => {
    if (checked) {
      setSelectedTechniques(prev => [...prev, technique]);
    } else {
      setSelectedTechniques(prev => prev.filter(t => t !== technique));
    }
  };

  const removeTechnique = (technique: string) => {
    setSelectedTechniques(prev => prev.filter(t => t !== technique));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !selectedRodId || !selectedReelId) return;

    setSaving(true);
    try {
      await createCombo({
        nickname,
        rod_id: selectedRodId,
        reel_id: selectedReelId,
        primary_techniques: selectedTechniques.length > 0 ? selectedTechniques : undefined,
        notes: notes || undefined,
        is_private: isPrivate
      });
      onClose();
    } catch (error) {
      console.error('Error creating combo:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Create Rod & Reel Combo</h2>
        <p className="text-sm text-muted-foreground">
          Pair your rod and reel for optimal technique performance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Combo Basics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Combo Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Combo Nickname *</Label>
              <Input
                placeholder="e.g., Tournament Rig, Deep Water Setup, Finesse Combo"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Select Rod *</Label>
                <Select value={selectedRodId} onValueChange={setSelectedRodId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a rod" />
                  </SelectTrigger>
                  <SelectContent>
                    {rods.map((rod) => (
                      <SelectItem key={rod.id} value={rod.id}>
                        {rod.nickname || `${rod.brand} ${rod.model}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select Reel *</Label>
                <Select value={selectedReelId} onValueChange={setSelectedReelId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a reel" />
                  </SelectTrigger>
                  <SelectContent>
                    {reels.map((reel) => (
                      <SelectItem key={reel.id} value={reel.id}>
                        {reel.nickname || `${reel.brand} ${reel.model}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview selected gear */}
            {selectedRod && selectedReel && (
              <div className="mt-4 p-3 bg-accent rounded-lg">
                <h4 className="font-medium text-sm mb-2">Combo Preview:</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Rod:</span> {selectedRod.nickname || `${selectedRod.brand} ${selectedRod.model}`}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reel:</span> {selectedReel.nickname || `${selectedReel.brand} ${selectedReel.model}`}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technique Association */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Primary Techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the techniques this combo excels at (optional)
            </p>

            {signatureTechniques.length > 0 ? (
              <div className="space-y-3">
                {signatureTechniques.map((technique) => (
                  <div key={technique} className="flex items-center space-x-2">
                    <Checkbox
                      id={technique}
                      checked={selectedTechniques.includes(technique)}
                      onCheckedChange={(checked) => handleTechniqueChange(technique, !!checked)}
                    />
                    <Label htmlFor={technique} className="text-sm font-normal">
                      {technique}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add signature techniques to your profile to link them to combos
              </p>
            )}

            {selectedTechniques.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Selected techniques:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTechniques.map((technique) => (
                    <Badge key={technique} variant="secondary" className="text-xs">
                      {technique}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 w-4 h-4"
                        onClick={() => removeTechnique(technique)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Additional Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Performance notes, line setup, preferred conditions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Keep Private</Label>
                <p className="text-xs text-muted-foreground">Private combos are only visible for AI coaching</p>
              </div>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving || !nickname || !selectedRodId || !selectedReelId} 
            className="flex-1"
          >
            {saving ? 'Creating Combo...' : 'Create Combo'}
          </Button>
        </div>
      </form>
    </div>
  );
}