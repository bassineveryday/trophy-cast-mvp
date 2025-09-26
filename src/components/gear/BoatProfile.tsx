import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Anchor, Camera, Trophy, X } from 'lucide-react';
import { useGear } from '@/hooks/useGear';
import type { Database } from '@/integrations/supabase/types';

const MOTOR_TYPES = ['Outboard', 'Inboard', 'Inboard/Outboard', 'Electric'];
const SPECIAL_FEATURES = [
  'Dual Livewells',
  'Rod Storage System', 
  'Tournament Console',
  'Custom Lighting',
  'Upgraded Electronics',
  'Hydraulic Jack Plate',
  'Custom Paint Job',
  'Trailer Included',
  'Carpet Kit',
  'Cooler Storage'
];

type UserBoat = Database['public']['Tables']['user_boats']['Row'];

interface BoatProfileProps {
  onClose: () => void;
  existingBoat?: UserBoat | null;
}

export function BoatProfile({ onClose, existingBoat }: BoatProfileProps) {
  const { addBoat } = useGear();
  
  const [saving, setSaving] = useState(false);
  
  // Boat data
  const [nickname, setNickname] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [lengthFeet, setLengthFeet] = useState('');
  const [beamFeet, setBeamFeet] = useState('');
  
  // Motor info
  const [motorBrand, setMotorBrand] = useState('');
  const [motorHorsepower, setMotorHorsepower] = useState('');
  const [motorType, setMotorType] = useState('');
  
  // Electronics
  const [fishFinder, setFishFinder] = useState('');
  const [gpsUnit, setGpsUnit] = useState('');
  const [trollingMotor, setTrollingMotor] = useState('');
  
  // Features
  const [livewellCount, setLivewellCount] = useState('');
  const [rodStorageCapacity, setRodStorageCapacity] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Tournament stats
  const [tournamentWins, setTournamentWins] = useState('');
  const [tournamentTop3, setTournamentTop3] = useState('');
  const [tournamentTop10, setTournamentTop10] = useState('');
  
  // Settings
  const [notes, setNotes] = useState('');
  const [isPrivate, setIsPrivate] = useState(false); // Boats public by default

  useEffect(() => {
    if (existingBoat) {
      setNickname(existingBoat.nickname || '');
      setPhotoUrl(existingBoat.photo_url || '');
      setBrand(existingBoat.brand);
      setModel(existingBoat.model);
      setYear(existingBoat.year?.toString() || '');
      setLengthFeet(existingBoat.length_feet?.toString() || '');
      setBeamFeet(existingBoat.beam_feet?.toString() || '');
      setMotorBrand(existingBoat.motor_brand || '');
      setMotorHorsepower(existingBoat.motor_horsepower?.toString() || '');
      setMotorType(existingBoat.motor_type || '');
      setFishFinder(existingBoat.fish_finder || '');
      setGpsUnit(existingBoat.gps_unit || '');
      setTrollingMotor(existingBoat.trolling_motor || '');
      setLivewellCount(existingBoat.livewell_count?.toString() || '');
      setRodStorageCapacity(existingBoat.rod_storage_capacity?.toString() || '');
      setSelectedFeatures(existingBoat.special_features || []);
      setTournamentWins(existingBoat.tournament_wins?.toString() || '');
      setTournamentTop3(existingBoat.tournament_top3?.toString() || '');
      setTournamentTop10(existingBoat.tournament_top10?.toString() || '');
      setNotes(existingBoat.notes || '');
      setIsPrivate(existingBoat.is_private || false);
    }
  }, [existingBoat]);

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures(prev => [...prev, feature]);
    } else {
      setSelectedFeatures(prev => prev.filter(f => f !== feature));
    }
  };

  const removeFeature = (feature: string) => {
    setSelectedFeatures(prev => prev.filter(f => f !== feature));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model) return;

    setSaving(true);
    try {
      await addBoat({
        nickname: nickname || null,
        photo_url: photoUrl || null,
        brand,
        model,
        year: year ? parseInt(year) : null,
        length_feet: lengthFeet ? parseFloat(lengthFeet) : null,
        beam_feet: beamFeet ? parseFloat(beamFeet) : null,
        motor_brand: motorBrand || null,
        motor_horsepower: motorHorsepower ? parseFloat(motorHorsepower) : null,
        motor_type: motorType || null,
        fish_finder: fishFinder || null,
        gps_unit: gpsUnit || null,
        trolling_motor: trollingMotor || null,
        livewell_count: livewellCount ? parseInt(livewellCount) : 0,
        rod_storage_capacity: rodStorageCapacity ? parseInt(rodStorageCapacity) : null,
        special_features: selectedFeatures.length > 0 ? selectedFeatures : null,
        tournament_wins: tournamentWins ? parseInt(tournamentWins) : 0,
        tournament_top3: tournamentTop3 ? parseInt(tournamentTop3) : 0,
        tournament_top10: tournamentTop10 ? parseInt(tournamentTop10) : 0,
        notes: notes || null,
        is_private: isPrivate
      });
      onClose();
    } catch (error) {
      console.error('Error adding boat:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">
          {existingBoat ? 'Edit Boat Profile' : 'Add Boat Profile'}
        </h2>
        <p className="text-sm text-muted-foreground">
          Showcase your fishing boat on your public profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Boat Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Anchor className="w-4 h-4" />
              Boat Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Boat Nickname</Label>
              <Input
                placeholder="e.g., Bass Hunter, The Office, Lucky Strike"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div>
              <Label>Photo URL</Label>
              <Input
                placeholder="https://example.com/boat-photo.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Brand *</Label>
                <Input
                  placeholder="Ranger, Bass Cat, etc."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Model *</Label>
                <Input
                  placeholder="Z518, Puma FTD, etc."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  placeholder="2020"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Length (feet)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="18.5"
                  value={lengthFeet}
                  onChange={(e) => setLengthFeet(e.target.value)}
                />
              </div>
              <div>
                <Label>Beam (feet)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="7.5"
                  value={beamFeet}
                  onChange={(e) => setBeamFeet(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Motor & Power</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Motor Brand</Label>
                <Input
                  placeholder="Mercury, Yamaha, etc."
                  value={motorBrand}
                  onChange={(e) => setMotorBrand(e.target.value)}
                />
              </div>
              <div>
                <Label>Horsepower</Label>
                <Input
                  type="number"
                  placeholder="150"
                  value={motorHorsepower}
                  onChange={(e) => setMotorHorsepower(e.target.value)}
                />
              </div>
              <div>
                <Label>Motor Type</Label>
                <Select value={motorType} onValueChange={setMotorType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTOR_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Electronics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Electronics Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Fish Finder</Label>
              <Input
                placeholder="Humminbird Helix 12, Lowrance HDS Live, etc."
                value={fishFinder}
                onChange={(e) => setFishFinder(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>GPS Unit</Label>
                <Input
                  placeholder="Garmin, Lowrance, etc."
                  value={gpsUnit}
                  onChange={(e) => setGpsUnit(e.target.value)}
                />
              </div>
              <div>
                <Label>Trolling Motor</Label>
                <Input
                  placeholder="Minn Kota Ultrex, MotorGuide Xi5"
                  value={trollingMotor}
                  onChange={(e) => setTrollingMotor(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features & Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Features & Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Livewell Count</Label>
                <Input
                  type="number"
                  placeholder="2"
                  value={livewellCount}
                  onChange={(e) => setLivewellCount(e.target.value)}
                />
              </div>
              <div>
                <Label>Rod Storage Capacity</Label>
                <Input
                  type="number"
                  placeholder="12"
                  value={rodStorageCapacity}
                  onChange={(e) => setRodStorageCapacity(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Special Features</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {SPECIAL_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                    />
                    <Label htmlFor={feature} className="text-sm font-normal">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedFeatures.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Selected features:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 w-4 h-4"
                          onClick={() => removeFeature(feature)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tournament Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Tournament Stats from this Boat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Tournament Wins</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tournamentWins}
                  onChange={(e) => setTournamentWins(e.target.value)}
                />
              </div>
              <div>
                <Label>Top 3 Finishes</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tournamentTop3}
                  onChange={(e) => setTournamentTop3(e.target.value)}
                />
              </div>
              <div>
                <Label>Top 10 Finishes</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tournamentTop10}
                  onChange={(e) => setTournamentTop10(e.target.value)}
                />
              </div>
            </div>
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
                placeholder="Boat modifications, maintenance notes, performance details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Keep Private</Label>
                <p className="text-xs text-muted-foreground">Boats are public by default to showcase on your profile</p>
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
          <Button type="submit" disabled={saving || !brand || !model} className="flex-1">
            {saving ? 'Saving Boat...' : (existingBoat ? 'Update Boat' : 'Add Boat')}
          </Button>
        </div>
      </form>
    </div>
  );
}