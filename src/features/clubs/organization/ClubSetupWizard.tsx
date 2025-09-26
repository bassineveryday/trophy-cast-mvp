import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  Crown,
  UserCheck,
  FileText,
  DollarSign,
  Trophy,
  Leaf,
  Calendar,
  MapPin,
  Users
} from "lucide-react";
import { officerRoles } from '@/data/officerRoles';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ClubData {
  name: string;
  description: string;
  location: string;
  meetingSchedule: string;
  selectedRoles: string[];
  officers: { [key: string]: string };
  bylawsTemplate: string;
  tournamentSchedule: string;
}

const roleIcons = {
  crown: Crown,
  'user-check': UserCheck,
  'file-text': FileText,
  'dollar-sign': DollarSign,
  trophy: Trophy,
  leaf: Leaf
};

const ClubSetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [clubData, setClubData] = useState<ClubData>({
    name: '',
    description: '',
    location: '',
    meetingSchedule: '',
    selectedRoles: ['president', 'treasurer', 'secretary'],
    officers: {},
    bylawsTemplate: 'standard',
    tournamentSchedule: 'monthly'
  });

  const steps: WizardStep[] = [
    {
      id: 'basic-info',
      title: 'Basic Club Information',
      description: 'Set up your club\'s core details',
      completed: false
    },
    {
      id: 'roles',
      title: 'Choose Officer Roles',
      description: 'Select which positions your club needs',
      completed: false
    },
    {
      id: 'assign-officers',
      title: 'Assign Officers',
      description: 'Match members to officer positions',
      completed: false
    },
    {
      id: 'bylaws',
      title: 'Club Bylaws & Rules',
      description: 'Establish your club\'s governance',
      completed: false
    },
    {
      id: 'schedule',
      title: 'Tournament Schedule',
      description: 'Plan your fishing events',
      completed: false
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRoleToggle = (roleId: string) => {
    const newRoles = clubData.selectedRoles.includes(roleId)
      ? clubData.selectedRoles.filter(id => id !== roleId)
      : [...clubData.selectedRoles, roleId];
    
    setClubData({ ...clubData, selectedRoles: newRoles });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="club-name">Club Name *</Label>
                <Input
                  id="club-name"
                  value={clubData.name}
                  onChange={(e) => setClubData({ ...clubData, name: e.target.value })}
                  placeholder="e.g., Lake Smith Bass Club"
                />
              </div>
              
              <div>
                <Label htmlFor="club-description">Club Description</Label>
                <Textarea
                  id="club-description"
                  value={clubData.description}
                  onChange={(e) => setClubData({ ...clubData, description: e.target.value })}
                  placeholder="Brief description of your club's mission and focus"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="club-location">Primary Location *</Label>
                <Input
                  id="club-location"
                  value={clubData.location}
                  onChange={(e) => setClubData({ ...clubData, location: e.target.value })}
                  placeholder="e.g., Birmingham, Alabama"
                />
              </div>
              
              <div>
                <Label htmlFor="meeting-schedule">Meeting Schedule</Label>
                <Input
                  id="meeting-schedule"
                  value={clubData.meetingSchedule}
                  onChange={(e) => setClubData({ ...clubData, meetingSchedule: e.target.value })}
                  placeholder="e.g., First Tuesday of each month at 7:00 PM"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select Officer Roles</h3>
              <p className="text-muted-foreground">
                Choose which officer positions your club needs. You can always add more later.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {officerRoles.map((role) => {
                const IconComponent = roleIcons[role.icon as keyof typeof roleIcons];
                const isSelected = clubData.selectedRoles.includes(role.id);
                
                return (
                  <Card 
                    key={role.id} 
                    className={`cursor-pointer border-2 transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleRoleToggle(role.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <CardTitle className="text-base">{role.title}</CardTitle>
                        </div>
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {role.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {role.timeCommitment}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Recommended minimum:</strong> President, Treasurer, and Secretary.
                These three roles cover the essential leadership, financial, and administrative needs.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Assign Officers</h3>
              <p className="text-muted-foreground">
                Match your club members to the selected officer positions
              </p>
            </div>
            
            <div className="space-y-4">
              {clubData.selectedRoles.map((roleId) => {
                const role = officerRoles.find(r => r.id === roleId);
                if (!role) return null;
                
                const IconComponent = roleIcons[role.icon as keyof typeof roleIcons];
                
                return (
                  <Card key={roleId}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-base">{role.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Label htmlFor={`officer-${roleId}`}>Assign Member</Label>
                        <Input
                          id={`officer-${roleId}`}
                          value={clubData.officers[roleId] || ''}
                          onChange={(e) => setClubData({
                            ...clubData,
                            officers: { ...clubData.officers, [roleId]: e.target.value }
                          })}
                          placeholder="Enter member name"
                        />
                        <p className="text-xs text-muted-foreground">
                          {role.skills.join(', ')} • {role.timeCommitment}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Tip:</strong> Don't worry if you don't have all positions filled yet. 
                You can assign officers later as your club grows.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Club Bylaws & Rules</h3>
              <p className="text-muted-foreground">
                Choose a bylaws template that fits your club's needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  id: 'standard',
                  name: 'Standard Fishing Club',
                  description: 'Basic bylaws covering meetings, tournaments, membership, and officer duties',
                  features: ['Meeting procedures', 'Tournament rules', 'Membership requirements', 'Officer responsibilities']
                },
                {
                  id: 'competitive',
                  name: 'Competitive Tournament Club',
                  description: 'Enhanced rules for clubs focused on competitive tournament fishing',
                  features: ['Advanced tournament rules', 'Points systems', 'Championship procedures', 'Boat/equipment standards']
                },
                {
                  id: 'family',
                  name: 'Family-Friendly Club',
                  description: 'Inclusive bylaws for clubs welcoming families and youth',
                  features: ['Youth programs', 'Family events', 'Beginner support', 'Community outreach']
                }
              ].map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer border-2 transition-colors ${
                    clubData.bylawsTemplate === template.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setClubData({ ...clubData, bylawsTemplate: template.id })}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      {clubData.bylawsTemplate === template.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> All templates can be customized after setup. 
                These provide a solid foundation that you can modify to fit your specific needs.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Tournament Schedule</h3>
              <p className="text-muted-foreground">
                Set up your club's tournament calendar
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  id: 'monthly',
                  name: 'Monthly Tournaments',
                  description: '12 regular tournaments per year',
                  schedule: 'One tournament each month',
                  icon: Calendar
                },
                {
                  id: 'biweekly',
                  name: 'Bi-Weekly Tournaments',
                  description: '24 tournaments per year',
                  schedule: 'Every other weekend',
                  icon: Calendar
                },
                {
                  id: 'seasonal',
                  name: 'Seasonal Schedule',
                  description: '6-8 tournaments during prime seasons',
                  schedule: 'Spring and fall focus',
                  icon: Calendar
                },
                {
                  id: 'custom',
                  name: 'Custom Schedule',
                  description: 'Create your own tournament calendar',
                  schedule: 'Flexible timing',
                  icon: Calendar
                }
              ].map((schedule) => {
                const IconComponent = schedule.icon;
                
                return (
                  <Card 
                    key={schedule.id}
                    className={`cursor-pointer border-2 transition-colors ${
                      clubData.tournamentSchedule === schedule.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setClubData({ ...clubData, tournamentSchedule: schedule.id })}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            clubData.tournamentSchedule === schedule.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <CardTitle className="text-base">{schedule.name}</CardTitle>
                        </div>
                        {clubData.tournamentSchedule === schedule.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{schedule.description}</p>
                      <Badge variant="outline" className="text-xs">{schedule.schedule}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="bg-success/10 p-4 rounded-lg border border-success/20">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <h4 className="font-semibold text-success">Setup Complete!</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                You've configured all the essential elements for your club. 
                Click "Complete Setup" to generate your club documentation and get started!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">New Club Setup Wizard</h2>
        <p className="text-muted-foreground">
          Let's get your fishing club organized with a step-by-step setup process
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Steps Navigation */}
      <div className="flex overflow-x-auto pb-2 space-x-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex-shrink-0 p-3 rounded-lg border-2 min-w-[200px] cursor-pointer transition-colors ${
              index === currentStep
                ? 'border-primary bg-primary/5'
                : index < currentStep
                ? 'border-success bg-success/5'
                : 'border-border'
            }`}
            onClick={() => setCurrentStep(index)}
          >
            <div className="flex items-center space-x-2 mb-1">
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  index === currentStep ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                }`}>
                  {index + 1}
                </div>
              )}
              <h3 className="font-semibold text-sm">{step.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button onClick={() => alert('Setup completed! (Integration with club creation would go here)')}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Setup
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClubSetupWizard;