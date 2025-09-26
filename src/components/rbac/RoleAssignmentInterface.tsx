import React, { useState } from 'react';
import { Crown, Shield, Calendar, FileEdit, DollarSign, Leaf, Users, UserMinus, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useClubMembersWithRoles, useAssignClubRole, useRemoveClubRole, type ClubRole } from '@/hooks/useRBAC';
import { PermissionGuard } from './PermissionGuard';

const roleIcons = {
  'club_admin': Crown,
  'president': Crown,
  'vice_president': Shield,
  'tournament_director': Calendar,
  'secretary': FileEdit,
  'treasurer': DollarSign,
  'conservation_director': Leaf,
  'member': Users,
  'guest': Users,
} as const;

const roleColors = {
  'club_admin': 'destructive',
  'president': 'destructive',
  'vice_president': 'default',
  'tournament_director': 'secondary',
  'secretary': 'secondary',
  'treasurer': 'secondary',
  'conservation_director': 'secondary',
  'member': 'outline',
  'guest': 'outline',
} as const;

const roleDescriptions = {
  'club_admin': 'Full administrative control over all club functions',
  'president': 'Lead club meetings, represent club, oversee all officers',
  'vice_president': 'Assist president, backup leadership role',
  'tournament_director': 'Organize and manage all club tournaments',
  'secretary': 'Keep records, manage communications, meeting minutes',
  'treasurer': 'Manage finances, dues, and budgets',
  'conservation_director': 'Lead environmental and conservation efforts',
  'member': 'Standard club member with basic privileges',
  'guest': 'Visitor with limited access to club information',
};

interface RoleAssignmentInterfaceProps {
  clubId: string;
}

export default function RoleAssignmentInterface({ clubId }: RoleAssignmentInterfaceProps) {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<ClubRole>('member');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { data: members = [], isLoading } = useClubMembersWithRoles(clubId);
  const assignRoleMutation = useAssignClubRole();
  const removeRoleMutation = useRemoveClubRole();

  const handleAssignRole = async () => {
    if (!selectedMember || !selectedRole) return;

    try {
      await assignRoleMutation.mutateAsync({
        userId: selectedMember,
        clubId,
        role: selectedRole,
        expiresAt: expiresAt || undefined,
        reason
      });

      setIsAssignDialogOpen(false);
      setSelectedMember('');
      setSelectedRole('member');
      setExpiresAt('');
      setReason('');
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const handleRemoveRole = async (userId: string) => {
    try {
      await removeRoleMutation.mutateAsync({
        userId,
        clubId,
        reason: 'Role removed via management interface'
      });
    } catch (error) {
      console.error('Failed to remove role:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PermissionGuard permission="club.assign.roles" clubId={clubId}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Management
              </CardTitle>
              <CardDescription>
                Assign and manage officer roles for club members
              </CardDescription>
            </div>
            
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button>Assign Role</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Club Role</DialogTitle>
                  <DialogDescription>
                    Select a member and assign them a specific role in the club.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="member">Select Member</Label>
                    <Select value={selectedMember} onValueChange={setSelectedMember}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.user_id} value={member.user_id}>
                            {member.profile?.name || 'Unknown User'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="role">Select Role</Label>
                    <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as ClubRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleDescriptions).map(([role, description]) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              {React.createElement(roleIcons[role as ClubRole] || Users, { className: "h-4 w-4" })}
                              <div>
                                <div className="font-medium capitalize">{role.replace('_', ' ')}</div>
                                <div className="text-xs text-muted-foreground">{description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expires">Expires At (Optional)</Label>
                    <Input
                      id="expires"
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason (Optional)</Label>
                    <Textarea
                      id="reason"
                      placeholder="Reason for role assignment..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAssignDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAssignRole}
                      disabled={!selectedMember || !selectedRole}
                    >
                      Assign Role
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {members.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No members found in this club. Members need to join the club before roles can be assigned.
                </AlertDescription>
              </Alert>
            ) : (
              members.map((member) => {
                const Icon = roleIcons[member.club_role as ClubRole] || Users;
                const isExpiring = member.expires_at && new Date(member.expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.profile?.name || 'Unknown User'}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={roleColors[member.club_role as ClubRole] || 'outline'}>
                            {member.club_role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          {member.expires_at && (
                            <Badge variant={isExpiring ? 'destructive' : 'secondary'} className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Expires {new Date(member.expires_at).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {member.club_role !== 'member' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveRole(member.user_id)}
                          disabled={removeRoleMutation.isPending}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </PermissionGuard>
  );
}