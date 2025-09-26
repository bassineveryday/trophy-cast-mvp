import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Lightbulb, 
  Users, 
  RefreshCw, 
  GraduationCap, 
  AlertTriangle,
  Calendar,
  Download,
  CheckCircle,
  Star,
  Clock,
  Target,
  MessageSquare
} from "lucide-react";
import { bestPractices, seasonalResponsibilities } from '@/data/officerRoles';

const BestPracticesLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('recruitment');

  const practiceCategories = [
    {
      id: 'recruitment',
      title: 'Officer Recruitment',
      icon: Users,
      description: 'How to find and recruit effective officers',
      practices: bestPractices.recruitment
    },
    {
      id: 'transition',
      title: 'Officer Transitions',
      icon: RefreshCw,
      description: 'Smooth handovers between officers',
      practices: bestPractices.transition
    },
    {
      id: 'training',
      title: 'Officer Training',
      icon: GraduationCap,
      description: 'Developing effective leaders',
      practices: bestPractices.training
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      icon: AlertTriangle,
      description: 'Handling common club challenges',
      practices: bestPractices.problemSolving
    }
  ];

  const monthlyResponsibilities = {
    'January': {
      title: 'Planning & Preparation',
      focus: 'Annual planning and goal setting',
      activities: ['Annual meeting planning', 'Budget reviews', 'Officer transitions', 'Tournament schedule finalization']
    },
    'February': {
      title: 'Foundation Setting',
      focus: 'Establishing year fundamentals',
      activities: ['Membership renewals', 'Insurance updates', 'Equipment inventory', 'Meeting schedule confirmation']
    },
    'March': {
      title: 'Season Launch',
      focus: 'Tournament season kickoff',
      activities: ['Pre-season meeting', 'Rules review', 'Equipment prep', 'Lake permissions']
    },
    'April': {
      title: 'Active Season Begin',
      focus: 'First tournaments and events',
      activities: ['Tournament execution', 'New member orientation', 'Conservation projects', 'Sponsor engagement']
    },
    'May': {
      title: 'Peak Activity',
      focus: 'Full tournament schedule',
      activities: ['Multiple tournaments', 'Member recognition', 'Community events', 'Educational programs']
    },
    'June': {
      title: 'Mid-Season Review',
      focus: 'Evaluate progress and adjust',
      activities: ['Mid-year assessment', 'Officer check-ins', 'Budget review', 'Member feedback']
    }
  };

  const commonProblems = [
    {
      problem: 'Low Meeting Attendance',
      solutions: [
        'Survey members about preferred meeting times',
        'Offer virtual attendance options',
        'Provide food or incentives',
        'Keep meetings focused and time-limited',
        'Send reminders with clear agendas'
      ],
      difficulty: 'Medium',
      timeToSolve: '2-3 months'
    },
    {
      problem: 'Officer Burnout',
      solutions: [
        'Distribute responsibilities more evenly',
        'Limit officer terms to prevent fatigue',
        'Provide training and support',
        'Recognize officer contributions publicly',
        'Create backup systems for key roles'
      ],
      difficulty: 'High',
      timeToSolve: '6+ months'
    },
    {
      problem: 'Declining Tournament Participation',
      solutions: [
        'Survey members about tournament preferences',
        'Adjust entry fees or format',
        'Improve lake selection',
        'Add beginner-friendly events',
        'Enhance prize structure'
      ],
      difficulty: 'Medium',
      timeToSolve: '3-6 months'
    },
    {
      problem: 'Financial Management Issues',
      solutions: [
        'Implement monthly financial reporting',
        'Create detailed budgets with categories',
        'Require dual approval for large expenses',
        'Use digital tools for tracking',
        'Conduct annual financial audits'
      ],
      difficulty: 'Low',
      timeToSolve: '1-2 months'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-success text-success-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'High': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Best Practices Library</h2>
        <p className="text-muted-foreground">
          Proven strategies and solutions for effective club management
        </p>
      </div>

      <Tabs defaultValue="practices" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="practices">Best Practices</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Guide</TabsTrigger>
          <TabsTrigger value="problems">Problem Solving</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practiceCategories.map((category) => {
              const IconComponent = category.icon;
              
              return (
                <Card 
                  key={category.id}
                  className={`cursor-pointer border-2 transition-colors ${
                    activeCategory === category.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-base">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {category.practices.length} practices
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                {practiceCategories.find(c => c.id === activeCategory)?.title} Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {practiceCategories.find(c => c.id === activeCategory)?.practices.map((practice, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-accent rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{practice}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seasonal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Seasonal Responsibility Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Month-by-month breakdown of what officers should focus on throughout the year
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(monthlyResponsibilities).map(([month, data]) => (
                  <Card key={month}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{month}</CardTitle>
                        <Badge variant="outline">{data.title}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{data.focus}</p>
                      <div className="space-y-1">
                        {data.activities.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span className="text-xs">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Officer Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(seasonalResponsibilities).map(([season, roles]) => (
                  <AccordionItem key={season} value={season}>
                    <AccordionTrigger className="capitalize">{season} Season</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {Object.entries(roles).map(([role, responsibilities]) => (
                          <div key={role} className="p-3 bg-accent rounded-lg">
                            <h4 className="font-semibold mb-2 capitalize">{role.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <ul className="space-y-1">
                              {(responsibilities as string[]).map((resp, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                                  <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="problems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                Common Club Problems & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Real solutions to challenges that many fishing clubs face
              </p>
              
              <div className="space-y-4">
                {commonProblems.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{item.problem}</CardTitle>
                        <div className="flex space-x-2">
                          <Badge className={getDifficultyColor(item.difficulty)}>
                            {item.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.timeToSolve}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Solutions
                      </h4>
                      <div className="space-y-2">
                        {item.solutions.map((solution, sIndex) => (
                          <div key={sIndex} className="flex items-start space-x-3 p-3 bg-accent rounded-lg">
                            <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{solution}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Meeting Agenda Template',
                description: 'Standard agenda format for club meetings',
                type: 'Document',
                icon: Calendar
              },
              {
                title: 'Officer Recruitment Email',
                description: 'Template for recruiting new officers',
                type: 'Email',
                icon: MessageSquare
              },
              {
                title: 'Transition Checklist',
                description: 'Step-by-step officer handover process',
                type: 'Checklist',
                icon: CheckCircle
              },
              {
                title: 'New Member Welcome Package',
                description: 'Information packet for new members',
                type: 'Package',
                icon: Users
              },
              {
                title: 'Tournament Director Handbook',
                description: 'Complete guide for running tournaments',
                type: 'Handbook',
                icon: GraduationCap
              },
              {
                title: 'Annual Budget Template',
                description: 'Financial planning spreadsheet',
                type: 'Spreadsheet',
                icon: Target
              }
            ].map((template, index) => {
              const IconComponent = template.icon;
              
              return (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{template.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{template.type}</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Template Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <h4 className="font-semibold mb-2">Customization Tips</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Adapt templates to match your club's specific needs and culture</li>
                    <li>• Add your club's logo and branding to official documents</li>
                    <li>• Review and update templates annually</li>
                    <li>• Share successful customizations with other clubs</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-accent rounded-lg">
                  <h4 className="font-semibold mb-2">Implementation Best Practices</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Start with one template at a time to avoid overwhelming officers</li>
                    <li>• Provide training on how to use each template effectively</li>
                    <li>• Create digital versions that can be easily shared and updated</li>
                    <li>• Collect feedback and improve templates based on usage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BestPracticesLibrary;