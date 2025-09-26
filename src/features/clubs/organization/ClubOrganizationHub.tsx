import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Crown, 
  BookOpen, 
  Settings, 
  Lightbulb,
  ChevronLeft,
  Download,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import OfficerRoleLibrary from './OfficerRoleLibrary';
import ClubSetupWizard from './ClubSetupWizard';
import ReorganizationTools from './ReorganizationTools';
import BestPracticesLibrary from './BestPracticesLibrary';

const ClubOrganizationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
        <div className="flex items-center mb-4">
          <Link to="/clubs">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10 p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold ml-2">Club Organization Hub</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/10 rounded-full">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Leadership Resources & Tools</h2>
            <p className="text-sm opacity-90">Everything you need to organize and manage your fishing club</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Officer Roles</TabsTrigger>
            <TabsTrigger value="setup">Setup Wizard</TabsTrigger>
            <TabsTrigger value="tools">Reorganize</TabsTrigger>
            <TabsTrigger value="practices">Best Practices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('roles')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">Officer Role Library</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Detailed job descriptions for all 6 officer positions
                  </p>
                  <Badge variant="secondary">6 Roles Available</Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('setup')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">New Club Setup</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Step-by-step wizard for organizing your club
                  </p>
                  <Badge variant="secondary">5-Step Process</Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('tools')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">Reorganization Tools</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Health checks and role management for existing clubs
                  </p>
                  <Badge variant="secondary">Club Assessment</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Featured Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                  Featured Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <h3 className="font-semibold mb-2">Officer Recruitment Guide</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn how to identify and recruit the right people for leadership roles
                    </p>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-accent rounded-lg">
                    <h3 className="font-semibold mb-2">Seasonal Responsibility Calendar</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Month-by-month breakdown of what each officer should focus on
                    </p>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      View Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Organization Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">Start with Clear Roles</p>
                      <p className="text-sm text-muted-foreground">Define exactly what each officer position will do before recruiting</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">Plan Transitions</p>
                      <p className="text-sm text-muted-foreground">Always have incoming officers shadow outgoing ones</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">Document Everything</p>
                      <p className="text-sm text-muted-foreground">Keep detailed records of procedures and decisions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Forum Teaser */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Ask the Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other club officers to share experiences and get advice
                </p>
                <Button variant="outline" size="sm">
                  Join Officer Forum
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles">
            <OfficerRoleLibrary />
          </TabsContent>
          
          <TabsContent value="setup">
            <ClubSetupWizard />
          </TabsContent>
          
          <TabsContent value="tools">
            <ReorganizationTools />
          </TabsContent>
          
          <TabsContent value="practices">
            <BestPracticesLibrary />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClubOrganizationHub;