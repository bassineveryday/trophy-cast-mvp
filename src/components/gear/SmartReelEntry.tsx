import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Search, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useGear } from '@/hooks/useGear';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const REEL_TYPES = ['Spinning', 'Baitcasting', 'Fly', 'Spincast'];
const COMMON_GEAR_RATIOS = ['5.1:1', '5.2:1', '5.4:1', '6.2:1', '6.3:1', '6.4:1', '7.1:1', '7.3:1', '8.1:1'];

interface SmartReelEntryProps {
  onClose: () => void;
  userRods?: Array<{ id: string; nickname?: string; brand: string; model: string }>;
}

export function SmartReelEntry({ onClose, userRods = [] }: SmartReelEntryProps) {
  const { lookupReelBySerial, addReel } = useGear();
  
  // Form states
  const [serialNumber, setSerialNumber] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reel data
  const [nickname, setNickname] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [reelType, setReelType] = useState('');
  const [gearRatio, setGearRatio] = useState('');
  const [lineCapacity, setLineCapacity] = useState('');
  const [maxDrag, setMaxDrag] = useState('');
  const [weightOz, setWeightOz] = useState('');
  const [bearings, setBearings] = useState('');
  const [notes, setNotes] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [purchaseDate, setPurchaseDate] = useState('');

  // Serial number lookup
  const handleSerialLookup = async () => {
    if (!serialNumber.trim()) return;
    
    setLookupLoading(true);
    try {
      const spec = await lookupReelBySerial(serialNumber.trim());
      if (spec) {
        setBrand(spec.brand);
        setModel(spec.model);
        setReelType(spec.reel_type);
        setGearRatio(spec.gear_ratio);
        setLineCapacity(spec.line_capacity || '');
        setMaxDrag(spec.max_drag?.toString() || '');
        setWeightOz(spec.weight_oz?.toString() || '');
        setBearings(spec.bearings?.toString() || '');
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
    if (!brand || !model || !reelType || !gearRatio) return;

    setSaving(true);
    try {
      await addReel({
        nickname: nickname || null,
        serial_number: serialNumber || null,
        brand,
        model,
        reel_type: reelType,
        gear_ratio: gearRatio,
        line_capacity: lineCapacity || null,
        max_drag: maxDrag ? parseFloat(maxDrag) : null,
        weight_oz: weightOz ? parseFloat(weightOz) : null,
        bearings: bearings ? parseInt(bearings) : null,
        notes: notes || null,
        purchase_date: purchaseDate || null,
        is_private: isPrivate
      });
      onClose();
    } catch (error) {
      console.error('Error adding reel:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Add New Reel</h2>
        <p className="text-sm text-muted-foreground">
          Enter your reel's serial number for automatic specification lookup, or fill in manually
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
                  placeholder="Enter reel serial number (e.g., SH-CU200K)"
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

        {/* Reel Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Reel Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nickname (Optional)</Label>
              <Input
                placeholder="e.g., Lightning, Old Reliable"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Brand *</Label>
                <Input
                  placeholder="Shimano, Daiwa, Abu Garcia"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Model *</Label>
                <Input
                  placeholder="Curado K, Tatula 100"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Reel Type *</Label>
                <Select value={reelType} onValueChange={setReelType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REEL_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gear Ratio *</Label>
                <Select value={gearRatio} onValueChange={setGearRatio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_GEAR_RATIOS.map(ratio => (
                      <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Max Drag (lbs)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="11.0"
                  value={maxDrag}
                  onChange={(e) => setMaxDrag(e.target.value)}
                />
              </div>
              <div>
                <Label>Weight (oz)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="7.6"
                  value={weightOz}
                  onChange={(e) => setWeightOz(e.target.value)}
                />
              </div>
              <div>
                <Label>Bearings</Label>
                <Input
                  type="number"
                  placeholder="8"
                  value={bearings}
                  onChange={(e) => setBearings(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Line Capacity</Label>
              <Input
                placeholder="e.g., 12/145, 14/125, 17/100"
                value={lineCapacity}
                onChange={(e) => setLineCapacity(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: test/yards (separate multiple with commas)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Personal Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                placeholder="Maintenance notes, performance observations, modifications..."
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
          <Button type="submit" disabled={saving || !brand || !model || !reelType || !gearRatio} className="flex-1">
            {saving ? 'Adding Reel...' : 'Add Reel'}
          </Button>
        </div>
      </form>
    </div>
  );
}