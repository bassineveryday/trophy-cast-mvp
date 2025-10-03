import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Camera, 
  Clock,
  Fish,
  Ruler,
  Scale,
  CheckCircle,
  Upload,
  Trash2,
  Mic
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { createCatch, CreateCatchDTO } from "./api";

const CatchLogging = () => {
  const [species, setSpecies] = useState<"Largemouth" | "Smallmouth" | "Spotted" | "Other">("Largemouth");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const newPhoto = `https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop`;
    setPhotos([...photos, newPhoto]);
    toast({
      title: "Photo Added",
      description: "Your catch photo has been uploaded successfully.",
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const parseVoice = (input: string) => {
    // Extract weight in pounds (e.g., "3.5 lb", "2.25 pounds")
    const weightMatch = input.match(/(\d+\.?\d*)\s*(?:lb|lbs|pound|pounds)/i);
    const weight = weightMatch ? weightMatch[1] : "";
    
    // Extract length in inches (e.g., "17 inches", "14 in")
    const lengthMatch = input.match(/(\d+\.?\d*)\s*(?:in|inch|inches)/i);
    const length = lengthMatch ? lengthMatch[1] : "";
    
    return { weight, length };
  };

  const handleVoiceCapture = () => {
    if (isListening) return;
    
    setIsListening(true);
    setVoiceInput("");
    
    toast({
      title: "Listening...",
      description: "Speak your catch details now",
    });

    // Simulate voice recognition with setTimeout
    setTimeout(() => {
      const mockVoiceInput = "3.5 lb largemouth, 17 inches";
      setVoiceInput(mockVoiceInput);
      setIsListening(false);
      
      // Parse and populate form fields using helper
      const { weight: parsedWeight, length: parsedLength } = parseVoice(mockVoiceInput);
      setWeight(parsedWeight);
      setLength(parsedLength);
      setNotes("Largemouth bass caught using voice logging");
      
      toast({
        title: "Voice Captured!",
        description: "Your catch details have been captured and filled in.",
      });
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!weight || !length) {
      toast({
        title: "Missing Information",
        description: "Please enter both weight and length.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Convert pounds to ounces, inches to millimeters
      const weightInOz = parseFloat(weight) * 16;
      const lengthInMm = parseFloat(length) * 25.4;

      const catchDTO: CreateCatchDTO = {
        species,
        weight_oz: weightInOz,
        length_mm: lengthInMm,
        notes: notes || undefined,
        // TODO: Add photo_key when photo upload is implemented
        // TODO: Add tournament_id if catch is during tournament
      };

      const result = await createCatch(catchDTO);

      toast({
        title: `Catch Logged Successfully! (${(result as any)._lane})`,
        description: `Your ${weight} lb, ${length}" ${species} bass has been recorded.`,
      });

      // Reset form
      setSpecies("Largemouth");
      setWeight("");
      setLength("");
      setLocation("");
      setNotes("");
      setPhotos([]);
      setVoiceInput("");
      setIsListening(false);
    } catch (error) {
      console.error("Failed to log catch:", error);
      toast({
        title: "Failed to log catch",
        description: error instanceof Error ? error.message : "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Log Catch" />

      <div className="p-4 space-y-6">
        {/* Voice Capture Interface */}
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={handleVoiceCapture}
            disabled={isListening}
            aria-pressed={isListening}
            aria-label={isListening ? "Listening for catch details" : "Start voice logging"}
            className={`w-20 h-20 rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 ${
              isListening ? 'animate-pulse scale-110' : 'hover:scale-105'
            }`}
          >
            <Mic className="w-8 h-8 text-white" />
          </Button>
          
          <div className="text-center">
            {isListening ? (
              <p className="text-sm font-medium text-primary animate-pulse">
                Listening... Speak your catch details
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tap to log catch by voice
              </p>
            )}
          </div>
          
          {!isListening && !voiceInput && (
            <div className="text-center max-w-md">
              <p className="text-xs text-muted-foreground mb-2">Try saying:</p>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground italic">"3.5 pounds largemouth, 17 inches"</p>
                <p className="text-xs text-muted-foreground italic">"2.2 smallmouth, 16 inches"</p>
              </div>
            </div>
          )}
          
          {voiceInput && (
            <Card className="w-full max-w-md">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">Voice Input:</span>
                </div>
                <p className="mt-1 text-sm bg-muted p-2 rounded">
                  "{voiceInput}"
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Current Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Time: 2:34:15 remaining</span>
              </div>
              <div className="flex items-center space-x-2">
                <Fish className="w-4 h-4 text-success" />
                <span className="font-semibold">3 fish logged</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2 text-water-blue" />
              Catch Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={photo} 
                      alt={`Catch ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 p-0"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full h-20 border-dashed"
              onClick={handlePhotoUpload}
            >
              <div className="flex flex-col items-center">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-sm">Add Photo</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Catch Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="w-5 h-5 mr-2 text-trophy-gold" />
              Catch Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select value={species} onValueChange={(value: any) => setSpecies(value)}>
                <SelectTrigger id="species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Largemouth">Largemouth Bass</SelectItem>
                  <SelectItem value="Smallmouth">Smallmouth Bass</SelectItem>
                  <SelectItem value="Spotted">Spotted Bass</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <div className="relative">
                <Input
                  id="weight"
                  placeholder="0.0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  type="number"
                  step="0.1"
                  className="text-lg"
                />
                <Scale className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Length (inches)</Label>
              <div className="relative">
                <Input
                  id="length"
                  placeholder="0.0"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  type="number"
                  step="1"
                  className="text-lg"
                />
                <Ruler className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <div className="relative">
                <Textarea
                  id="notes"
                  placeholder="Lure used, weather conditions, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 w-8 h-8 p-0 text-muted-foreground hover:text-primary"
                  onClick={() => toast({
                    title: "Voice Recording",
                    description: "Voice-to-text feature activated!",
                  })}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Tournament Standing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Tournament Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Position</span>
              <Badge className="bg-primary text-primary-foreground">3rd Place</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Total Weight</span>
              <span className="font-semibold">17.33 lbs</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Big Fish</span>
              <span className="font-semibold">4.1 lbs</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">Fish Count</span>
              <span className="font-semibold">3 / 5</span>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="space-y-3">
          <Button 
            className="w-full h-12 bg-success hover:bg-success/90 text-lg font-semibold"
            onClick={handleSubmit}
            disabled={submitting}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {submitting ? "Logging..." : "Log This Catch"}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Make sure all details are accurate. Logged catches cannot be edited during the tournament.
          </p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default CatchLogging;