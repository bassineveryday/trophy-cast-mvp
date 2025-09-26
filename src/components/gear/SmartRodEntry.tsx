import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Search, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { useGear } from '@/hooks/useGear';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const ROD_POWERS = ['Ultra Light', 'Light', 'Medium Light', 'Medium', 'Medium Heavy', 'Heavy', 'Extra Heavy'];
const ROD_ACTIONS = ['Extra Fast', 'Fast', 'Moderate Fast', 'Moderate', 'Slow'];
const ROD_TYPES = ['Spinning', 'Casting', 'Fly', 'Ice'];

interface SmartRodEntryProps {
  onClose: () => void;
  signatureTechniques?: string[];
}

export function SmartRodEntry({ onClose, signatureTechniques = [] }: SmartRodEntryProps) {
  const { lookupRodBySerial, addRod } = useGear();
  
  // Form states
  const [serialNumber, setSerialNumber] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const [saving, setSaving] = useState(false);

  // Rod data
  const [nickname, setNickname] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [lengthFeet, setLengthFeet] = useState('');
  const [lengthInches, setLengthInches] = useState('');
  const [power, setPower] = useState('');
  const [action, setAction] = useState('');
  const [rodType, setRodType] = useState('');
  const [primaryTechnique, setPrimaryTechnique] = useState('');
  const [notes, setNotes] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [purchaseDate, setPurchaseDate] = useState('');

  // Serial number lookup
  const handleSerialLookup = async () => {
    if (!serialNumber.trim()) return;
    
    setLookupLoading(true);
    try {
      const spec = await lookupRodBySerial(serialNumber.trim());
      if (spec) {
        setBrand(spec.brand);
        setModel(spec.model);
        setLengthFeet(spec.length_feet.toString());
        setLengthInches(spec.length_inches?.toString() || '0');
        setPower(spec.power);
        setAction(spec.action);
        setRodType(spec.rod_type);
        setAutoDetected(true);
      } else {
        setAutoDetected(false);
      }
    } catch (error) {
      console.error('Serial lookup error:', error);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !lengthFeet || !power || !action || !rodType) return;

    setSaving(true);
    try {
      await addRod({
        nickname: nickname || null,
        serial_number: serialNumber || null,
        brand,
        model,
        length_feet: parseFloat(lengthFeet),
        length_inches: parseFloat(lengthInches || '0'),
        power,
        action,
        rod_type: rodType,
        primary_technique: primaryTechnique || null,
        notes: notes || null,
        purchase_date: purchaseDate || null,
        is_private: isPrivate
      });
      onClose();
    } catch (error) {
      console.error('Error adding rod:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Add New Rod</h2>
        <p className="text-sm text-muted-foreground">
          Enter your rod's serial number for automatic specification lookup, or fill in manually
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Serial Number Lookup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="w-4 h-4" />
              Smart Serial Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter rod serial number (e.g., SC-LGS70MHF)"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
              <Button
                type="button"
                onClick={handleSerialLookup}
                disabled={!serialNumber.trim() || lookupLoading}
                className="px-6"
              >
                {lookupLoading ? <LoadingSpinner /> : 'Lookup'}
              </Button>
            </div>

            {autoDetected && (
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle className="w-4 h-4" />
                <span>Specifications auto-detected! Review details below.</span>
              </div>
            )}

            {serialNumber && !autoDetected && !lookupLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>Serial not found. Please enter specifications manually.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rod Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rod Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nickname (Optional)</Label>
              <Input
                placeholder="e.g., Big Bass Slayer, Finesse King"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Brand *</Label>
                <Input
                  placeholder="St. Croix, Shimano, etc."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Model *</Label>
                <Input
                  placeholder="Legend Glass, Curado X"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Length (Feet) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={lengthFeet}
                  onChange={(e) => setLengthFeet(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Length (Inches)</Label>
                <Input
                  type="number"
                  max="11"
                  value={lengthInches}
                  onChange={(e) => setLengthInches(e.target.value)}
                />
              </div>
              <div>
                <Label>Rod Type *</Label>
                <Select value={rodType} onValueChange={setRodType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROD_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Power *</Label>
                <Select value={power} onValueChange={setPower} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select power" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROD_POWERS.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Action *</Label>
                <Select value={action} onValueChange={setAction} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROD_ACTIONS.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4" />
              Personal Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Primary Technique</Label>
              <Select value={primaryTechnique} onValueChange={setPrimaryTechnique}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to your signature technique" />
                </SelectTrigger>
                <SelectContent>
                  {signatureTechniques.map(technique => (
                    <SelectItem key={technique} value={technique}>{technique}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Purchase Date</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Personal observations, modifications, performance notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Keep Private</Label>
                <p className="text-xs text-muted-foreground">Private gear is only visible for AI coaching</p>
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
          <Button type="submit" disabled={saving || !brand || !model || !lengthFeet || !power || !action || !rodType} className="flex-1">
            {saving ? 'Adding Rod...' : 'Add Rod'}
          </Button>
        </div>
      </form>
    </div>
  );
}