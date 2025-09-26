import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Crown,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  UserX,
  UserPlus,
  Settings
} from "lucide-react";

interface HealthCheckItem {
  category: string;
  item: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
  recommendation?: string;
}

const ReorganizationTools = () => {
  const [selectedTool, setSelectedTool] = useState<string>('health-check');
  const [healthCheckComplete, setHealthCheckComplete] = useState(false);

  // Mock health check data
  const healthCheckResults: HealthCheckItem[] = [
    {
      category: 'Leadership',
      item: 'President Position',
      status: 'good',
      description: 'Active president in place with clear responsibilities'
    },
    {
      category: 'Leadership',
      item: 'Vice President Position',
      status: 'warning',
      description: 'Position vacant for 3 months',
      recommendation: 'Recruit VP to ensure leadership continuity'
    },
    {
      category: 'Financial',
      item: 'Treasurer Role',
      status: 'good',
      description: 'Treasurer actively managing finances with monthly reports'
    },
    {
      category: 'Administration',
      item: 'Secretary Position',
      status: 'critical',
      description: 'No secretary assigned, meeting minutes not being recorded',
      recommendation: 'Immediately assign secretary or distribute duties'
    },
    {
      category: 'Operations',
      item: 'Tournament Director',
      status: 'good',
      description: 'Tournament schedule on track with good participation'
    },
    {
      category: 'Operations',
      item: 'Meeting Schedule',
      status: 'warning',
      description: 'Inconsistent meeting attendance (below 50%)',
      recommendation: 'Review meeting format and timing'
    },
    {
      category: 'Governance',
      item: 'Club Bylaws',
      status: 'warning',
      description: 'Bylaws not updated in 2+ years',
      recommendation: 'Schedule bylaws review committee'
    }
  ];

  const runHealthCheck = () => {
    setHealthCheckComplete(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'critical': return <AlertCircle className="w-5 h-5 text-destructive" />;
      default: return null;
    }
  };

  const renderHealthCheck = () => {
    if (!healthCheckComplete) {
      return (
        <div className="text-center space-y-6">
          <div className="p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Club Health Check</h3>
            <p className="text-muted-foreground mb-6">
              Analyze your club's organizational structure and identify areas for improvement
            </p>
            <Button onClick={runHealthCheck} size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Health Check
            </Button>
          </div>
        </div>
      );
    }

    const goodCount = healthCheckResults.filter(item => item.status === 'good').length;
    const warningCount = healthCheckResults.filter(item => item.status === 'warning').length;
    const criticalCount = healthCheckResults.filter(item => item.status === 'critical').length;
    const totalItems = healthCheckResults.length;
    const healthScore = Math.round((goodCount / totalItems) * 100);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Club Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthScore}%</span>
                <div className="text-right text-sm text-muted-foreground">
                  {goodCount} good • {warningCount} warnings • {criticalCount} critical
                </div>
              </div>
              <Progress value={healthScore} className="w-full" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{goodCount}</div>
                  <div className="text-sm text-muted-foreground">Good</div>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{warningCount}</div>
                  <div className="text-sm text-muted-foreground">Needs Attention</div>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {criticalCount > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your club has {criticalCount} critical issue{criticalCount > 1 ? 's' : ''} that need immediate attention.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {['critical', 'warning', 'good'].map(statusFilter => {
            const filteredItems = healthCheckResults.filter(item => item.status === statusFilter);
            if (filteredItems.length === 0) return null;

            return (
              <Card key={statusFilter}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-base ${getStatusColor(statusFilter)}`}>
                    {statusFilter === 'good' && 'Strengths'}
                    {statusFilter === 'warning' && 'Areas for Improvement'}
                    {statusFilter === 'critical' && 'Critical Issues'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredItems.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-accent rounded-lg">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{item.item}</h4>
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          {item.recommendation && (
                            <p className="text-sm font-medium text-primary">
                              → {item.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Club Reorganization Tools</h2>
        <p className="text-muted-foreground">
          Assess your club's health and manage organizational changes
        </p>
      </div>

      <Tabs value={selectedTool} onValueChange={setSelectedTool} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health-check">Health Check</TabsTrigger>
          <TabsTrigger value="role-management">Role Management</TabsTrigger>
          <TabsTrigger value="elections">Elections</TabsTrigger>
          <TabsTrigger value="transitions">Transitions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="health-check">
          {renderHealthCheck()}
        </TabsContent>
        
        <TabsContent value="role-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Current Officer Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { role: 'President', member: 'Jake Patterson', status: 'active', term: 'Jan 2024 - Dec 2024' },
                  { role: 'Vice President', member: null, status: 'vacant', term: 'Position Vacant' },
                  { role: 'Secretary', member: null, status: 'vacant', term: 'Position Vacant' },
                  { role: 'Treasurer', member: 'Maria Santos', status: 'active', term: 'Jan 2024 - Dec 2024' },
                  { role: 'Tournament Director', member: 'Tommy Lee', status: 'active', term: 'Jan 2024 - Dec 2024' }
                ].map((officer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">{officer.role}</h4>
                        <p className="text-sm text-muted-foreground">
                          {officer.member || 'Position Vacant'} • {officer.term}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={officer.status === 'active' ? 'default' : 'destructive'}>
                        {officer.status}
                      </Badge>
                      <div className="flex space-x-1">
                        {officer.member ? (
                          <Button size="sm" variant="outline">
                            <UserX className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="elections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Election Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    Annual officer elections are scheduled for December 15, 2024. 
                    Start preparation 60 days in advance.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Election Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Nominations Open</span>
                          <Badge variant="outline">Oct 15</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Nominations Close</span>
                          <Badge variant="outline">Nov 30</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Candidate Forum</span>
                          <Badge variant="outline">Dec 8</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Election Day</span>
                          <Badge>Dec 15</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Election Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Nomination Forms
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Ballot Creation
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Election Schedule
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Officer Transition Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Transition Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'Schedule handover meetings',
                          'Transfer account access',
                          'Share ongoing projects',
                          'Introduce key contacts',
                          'Review role documentation'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Orientation Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Officer Handbook
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Mentor Assignment
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Training Schedule
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Start transition planning 30 days before new officers take office. 
                    A smooth transition sets new leaders up for success.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReorganizationTools;