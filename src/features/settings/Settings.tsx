import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Bell, Lock, User, Palette } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Settings" />
      
      <div className="p-4 space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-updates">Email Updates</Label>
                <p className="text-sm text-muted-foreground">Receive tournament and club updates</p>
              </div>
              <Switch id="email-updates" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="public-profile">Public Profile</Label>
                <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
              </div>
              <Switch id="public-profile" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tournament-alerts">Tournament Alerts</Label>
                <p className="text-sm text-muted-foreground">Upcoming tournaments and results</p>
              </div>
              <Switch id="tournament-alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="club-messages">Club Messages</Label>
                <p className="text-sm text-muted-foreground">Messages from club officers</p>
              </div>
              <Switch id="club-messages" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-insights">AI Coach Insights</Label>
                <p className="text-sm text-muted-foreground">Personalized fishing tips</p>
              </div>
              <Switch id="ai-insights" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-catches">Share Catches</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your catches</p>
              </div>
              <Switch id="share-catches" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-location">Share Locations</Label>
                <p className="text-sm text-muted-foreground">Show fishing spot details</p>
              </div>
              <Switch id="share-location" />
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch id="dark-mode" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
