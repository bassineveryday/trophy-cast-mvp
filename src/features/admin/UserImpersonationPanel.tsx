import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, 
  Users, 
  Search, 
  Crown, 
  Shield, 
  User,
  ArrowRight,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { EnhancedBreadcrumb } from '@/components/EnhancedBreadcrumb';
import { useToast } from '@/hooks/use-toast';
import { useDemoMode } from '@/contexts/DemoModeContext';
import UniversalAvatar from '@/components/UniversalAvatar';

interface UserForImpersonation {
  id: string;
  name: string;
  club: string | null;
  avatar_url: string | null;
  user_roles: Array<{
    role: string;
    club_id: string | null;
    club_role: string | null;
  }>;
  created_at: string;
}

export default function UserImpersonationPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();
  const { currentDemoUser, switchToDemoUser, exitDemoMode } = useDemoMode();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      // Mock users for now since there are database issues
      return [
        {
          id: '1',
          name: 'Jake Patterson',
          club: 'Alabama Bass Nation - Chapter 12',
          avatar_url: '/placeholder.svg',
          user_roles: [{ role: 'member', club_id: 'demo-club', club_role: 'president' }],
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Maria Santos',
          club: 'River Valley Independent',
          avatar_url: '/placeholder.svg',
          user_roles: [{ role: 'member', club_id: 'demo-club-2', club_role: 'member' }],
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Tommy Lee', 
          club: 'Trophy Cast Elite',
          avatar_url: '/placeholder.svg',
          user_roles: [{ role: 'admin', club_id: null, club_role: null }],
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Sarah Johnson',
          club: 'Alabama Bass Nation - Chapter 12',
          avatar_url: '/placeholder.svg',
          user_roles: [{ role: 'member', club_id: 'demo-club', club_role: 'secretary' }],
          created_at: new Date().toISOString()
        }
      ] as UserForImpersonation[];
    }
  });

  const filteredUsers = users.filter((user: UserForImpersonation) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.club?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (roleFilter === 'all') return true;
    if (roleFilter === 'admin') return user.user_roles?.some(r => r.role === 'admin');
    if (roleFilter === 'officer') return user.user_roles?.some(r => r.club_role && r.club_role !== 'member');
    if (roleFilter === 'member') return user.user_roles?.some(r => r.role === 'member');
    
    return true;
  });

  const handleImpersonate = async (userId: string, userName: string) => {
    try {
      // Find matching demo user
      const demoUserMap: Record<string, any> = {
        '1': { id: 'demo-jake-patterson', name: 'Jake Patterson' },
        '2': { id: 'demo-maria-santos', name: 'Maria Santos' }, 
        '3': { id: 'demo-tommy-lee', name: 'Tommy Lee' },
        '4': { id: 'demo-sarah-johnson', name: 'Sarah Johnson' }
      };
      
      const demoUser = demoUserMap[userId];
      if (demoUser) {
        switchToDemoUser(demoUser, false);
      }
      
      toast({
        title: 'Impersonation Started',
        description: `Now viewing as ${userName}`
      });
    } catch (error) {
      toast({
        title: 'Impersonation Failed',
        description: 'Unable to impersonate user',
        variant: 'destructive'
      });
    }
  };

  const getRoleDisplay = (userRoles: UserForImpersonation['user_roles']) => {
    if (!userRoles || userRoles.length === 0) return 'Member';
    
    const adminRole = userRoles.find(r => r.role === 'admin');
    if (adminRole) return 'Platform Admin';
    
    const officerRole = userRoles.find(r => r.club_role && r.club_role !== 'member');
    if (officerRole) return `Club ${officerRole.club_role?.replace('_', ' ').toUpperCase()}`;
    
    return 'Member';
  };

  const getRoleBadgeColor = (userRoles: UserForImpersonation['user_roles']) => {
    if (!userRoles || userRoles.length === 0) return 'bg-muted text-muted-foreground';
    
    const adminRole = userRoles.find(r => r.role === 'admin');
    if (adminRole) return 'bg-red-500/10 text-red-700 border-red-500/20';
    
    const officerRole = userRoles.find(r => r.club_role && r.club_role !== 'member');
    if (officerRole) return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
    
    return 'bg-water-blue/10 text-water-blue border-water-blue/20';
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Breadcrumb */}
      <EnhancedBreadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Admin Dashboard', href: '/admin/dashboard' },
        { label: 'User Impersonation' }
      ]} />

      {/* Header */}
      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-lg border border-red-500/20">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
          <Eye className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">User Impersonation</h1>
          <p className="text-muted-foreground">View the app from any user's perspective for support and testing</p>
        </div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-orange-700">Use responsibly</span>
        </div>
      </div>

      {/* Current Impersonation Status */}
      {currentDemoUser && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">Currently Impersonating</p>
                  <p className="text-sm text-muted-foreground">Demo User: {currentDemoUser?.name || 'Active'}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exitDemoMode}
              >
                Exit Impersonation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Find Users</CardTitle>
          <CardDescription>Search for users to impersonate for support or testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="officer">Club Officers</SelectItem>
                <SelectItem value="member">Members</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Platform Users ({filteredUsers.length})</span>
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                  <div className="w-20 h-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user: UserForImpersonation) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <UniversalAvatar
                      name={user.name}
                      photoUrl={user.avatar_url || '/placeholder.svg'}
                      size="row"
                      clickable={false}
                    />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">{user.club || 'No Club'}</p>
                        <Badge className={getRoleBadgeColor(user.user_roles)}>
                          {getRoleDisplay(user.user_roles)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleImpersonate(user.id, user.name)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Impersonate</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No users found matching your search criteria</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}