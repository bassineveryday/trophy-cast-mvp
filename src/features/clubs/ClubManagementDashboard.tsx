import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Crown, Shield, FileEdit, DollarSign, Calendar, Leaf, UserPlus, UserMinus, Mail, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClubMembers } from '@/hooks/useClubMembership';
// Update existing user_roles table to use new club_role enum
import { useUserEffectiveRoles } from '@/hooks/useRBAC';
import ClubManagementDashboard from "@/features/clubs/ClubManagementDashboard";
import { useAuth } from '@/contexts/AuthContext';
import { officerRoles } from '@/data/officerRoles';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const roleIcons = {
  'admin': Crown,
  'club_officer': Shield,
  'member': Users,
} as const;

const officerTypeIcons = {
  'president': Crown,
  'vice_president': Shield,
  'secretary': FileEdit,
  'treasurer': DollarSign,
  'tournament_director': Calendar,
  'conservation_director': Leaf,
  'member': Users,
} as const;

interface ClubManagementDashboardProps {
  clubId?: string;
}

export default function ClubManagementDashboard({ clubId }: ClubManagementDashboardProps) {
  const { id } = useParams();
  const actualClubId = clubId || id;
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [activeTab, setActiveTab] = useState('members');

  const { data: clubMembers = [], isLoading, refetch } = useClubMembersWithRoles(actualClubId || '');
  const { data: hasManagePermission } = usePermission('club.assign.roles', actualClubId);
  const { data: hasAdminPermission } = usePermission('platform.admin.full');
  const canManageRoles = hasManagePermission || hasAdminPermission;

  const handleRoleChange = async (memberId: string, newRole: ClubRole) => {
    if (!canManageRoles || !actualClubId) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to change member roles.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, remove any existing officer role for this member in this club
      await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', memberId)
        .eq('club_id', actualClubId);

      // Then add the new role if it's not just a member
      if (newRole !== 'member') {
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: memberId,
            club_id: actualClubId,
            club_role: newRole,
            assigned_by: user?.id,
            is_active: true
          });

        if (error) throw error;
      } else {
        // For member role, create a new active record
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: memberId,
            club_id: actualClubId,
            club_role: 'member',
            assigned_by: user?.id,
            is_active: true
          });

        if (error) throw error;
      }

      toast({
        title: "Role updated",
        description: "Member role has been successfully updated.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeMember = async (memberId: string) => {
    if (!canManageRoles || !actualClubId) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to remove members.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', memberId)
        .eq('club_id', actualClubId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: "Member has been removed from the club.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'club_officer': return 'default';
      default: return 'secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'club_admin': return 'Club Admin';
      case 'president': return 'President';
      case 'vice_president': return 'Vice President';
      case 'tournament_director': return 'Tournament Director';
      case 'secretary': return 'Secretary';
      case 'treasurer': return 'Treasurer';
      case 'conservation_director': return 'Conservation Director';
      case 'member': return 'Member';
      case 'guest': return 'Guest';
      default: return 'Member';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!actualClubId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No club selected. Please navigate to a specific club to manage members.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Club Management</h1>
          <p className="text-muted-foreground">Manage club members, roles, and responsibilities</p>
        </div>
        {canManageRoles && (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Members
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members & Roles</TabsTrigger>
          <TabsTrigger value="roles">Role Descriptions</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Club Members ({clubMembers.length})
              </CardTitle>
              <CardDescription>
                Manage member roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clubMembers.map((member) => {
                  const Icon = roleIcons[member.role as keyof typeof roleIcons] || Users;
                  
                  return (
                    <div key={member.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{member.profile?.name || 'Unknown User'}</p>
                          <p className="text-sm text-muted-foreground">Club Member</p>
                        </div>
                        <Badge variant={getRoleBadgeVariant(member.club_role || 'member')}>
                          {getRoleDisplayName(member.club_role || 'member')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {canManageRoles && member.user_id !== user?.id && (
                          <>
                            <Select
                              value={member.club_role || 'member'}
                              onValueChange={(value) => handleRoleChange(member.user_id, value as ClubRole)}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="secretary">Secretary</SelectItem>
                                <SelectItem value="treasurer">Treasurer</SelectItem>
                                <SelectItem value="tournament_director">Tournament Director</SelectItem>
                                <SelectItem value="conservation_director">Conservation Director</SelectItem>
                                <SelectItem value="vice_president">Vice President</SelectItem>
                                <SelectItem value="president">President</SelectItem>
                                {hasAdminPermission && <SelectItem value="club_admin">Club Admin</SelectItem>}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeMember(member.user_id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid gap-4">
            {officerRoles.map((role) => {
              const Icon = officerTypeIcons[role.id as keyof typeof officerTypeIcons] || Users;
              
              return (
                <Card key={role.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {role.title}
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {role.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <strong>Time Commitment:</strong> {role.timeCommitment}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>New Club Setup</CardTitle>
                <CardDescription>Essential steps for starting your club</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">1</div>
                    <div>
                      <p className="font-medium">Assign Core Officers</p>
                      <p className="text-sm text-muted-foreground">Start with President, Secretary, and Treasurer at minimum</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">2</div>
                    <div>
                      <p className="font-medium">Review Job Descriptions</p>
                      <p className="text-sm text-muted-foreground">Ensure each officer understands their responsibilities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">3</div>
                    <div>
                      <p className="font-medium">Set Meeting Schedule</p>
                      <p className="text-sm text-muted-foreground">Establish regular meeting times and locations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">4</div>
                    <div>
                      <p className="font-medium">Plan First Tournament</p>
                      <p className="text-sm text-muted-foreground">Get members engaged with your first event</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Assignment Tips</CardTitle>
                <CardDescription>Best practices for officer selection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Alert>
                    <Crown className="h-4 w-4" />
                    <AlertDescription>
                      <strong>President:</strong> Choose someone with leadership experience who can commit significant time
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Treasurer:</strong> Requires attention to detail and basic accounting knowledge
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Tournament Director:</strong> Must be knowledgeable about fishing rules and organized
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <FileEdit className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Secretary:</strong> Good writing skills and ability to take detailed notes required
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}