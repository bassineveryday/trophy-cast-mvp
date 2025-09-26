import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Users, Eye, EyeOff, Info, Sparkles } from 'lucide-react';
import { useHybridData } from '@/hooks/useHybridData';

export function DemoContentControls() {
  const { preferences, updatePreferences } = useHybridData();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDemo = (enabled: boolean) => {
    updatePreferences({
      ...preferences,
      showDemoContent: enabled
    });
  };

  const handleLevelChange = (level: string) => {
    updatePreferences({
      ...preferences,
      demoContentLevel: level as any
    });
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'none':
        return 'Hide all demo content - show only your real data';
      case 'minimal':
        return 'Show minimal demo content to fill gaps';
      case 'enhanced':
        return 'Balanced mix of real and demo content for optimal experience';
      case 'full':
        return 'Show full demo content alongside your data';
      default:
        return '';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'none':
        return 'bg-gray-500';
      case 'minimal':
        return 'bg-blue-500';
      case 'enhanced':
        return 'bg-green-500';
      case 'full':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Demo Settings
          <Badge 
            variant="secondary" 
            className={`${getLevelColor(preferences.demoContentLevel)} text-white text-xs`}
          >
            {preferences.demoContentLevel}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Demo Content Settings
          </DialogTitle>
          <DialogDescription>
            Control how demo profiles and activities enhance your TrophyCast experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enable/Disable Demo Content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Show Demo Content
                <Switch
                  checked={preferences.showDemoContent}
                  onCheckedChange={handleToggleDemo}
                />
              </CardTitle>
            </CardHeader>
            {preferences.showDemoContent && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Demo Content Level</label>
                    <Select
                      value={preferences.demoContentLevel}
                      onValueChange={handleLevelChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="enhanced">Enhanced</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      {getLevelDescription(preferences.demoContentLevel)}
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Information Card */}
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    What is demo content?
                  </p>
                  <p className="text-blue-800 dark:text-blue-300 text-xs leading-relaxed">
                    Demo profiles like Jake Patterson and Maria Santos help populate tournaments, 
                    leaderboards, and activity feeds to showcase TrophyCast features. They're 
                    clearly marked and enhance your experience without affecting your real data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Profile Preview */}
          {preferences.showDemoContent && preferences.demoContentLevel !== 'none' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Demo Profiles Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/src/assets/profiles/jake-patterson.jpg" 
                      alt="Jake Patterson" 
                      className="w-6 h-6 rounded-full"
                    />
                    <span>Jake Patterson</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img 
                      src="/src/assets/profiles/maria-santos.jpg" 
                      alt="Maria Santos" 
                      className="w-6 h-6 rounded-full"
                    />
                    <span>Maria Santos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img 
                      src="/src/assets/profiles/tommy-lee.jpg" 
                      alt="Tommy Lee" 
                      className="w-6 h-6 rounded-full"
                    />
                    <span>Tommy Lee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img 
                      src="/src/assets/profiles/chris-wilson.jpg" 
                      alt="Chris Wilson" 
                      className="w-6 h-6 rounded-full"
                    />
                    <span>Chris Wilson</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Demo Content
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Clearly marked throughout the app
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}