import React, { useState } from 'react';
import { Download, Users, Calendar, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClubMembersWithRoles } from '@/hooks/useRBAC';
import { useToast } from '@/hooks/use-toast';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';

interface ExportField {
  key: string;
  label: string;
  enabled: boolean;
}

interface MemberExportToolsProps {
  clubId: string;
}

export default function MemberExportTools({ clubId }: MemberExportToolsProps) {
  const [exportFields, setExportFields] = useState<ExportField[]>([
    { key: 'name', label: 'Name', enabled: true },
    { key: 'email', label: 'Email', enabled: true },
    { key: 'phone', label: 'Phone', enabled: true },
    { key: 'home_state', label: 'Home State', enabled: true },
    { key: 'city', label: 'City', enabled: true },
    { key: 'club_role', label: 'Club Role', enabled: true },
    { key: 'signature_techniques', label: 'Signature Techniques', enabled: true },
    { key: 'emergency_contact', label: 'Emergency Contact', enabled: false },
    { key: 'boat_registration', label: 'Boat Registration', enabled: false },
    { key: 'created_at', label: 'Join Date', enabled: true },
  ]);

  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const { data: members = [], isLoading } = useClubMembersWithRoles(clubId);
  const { toast } = useToast();

  const handleFieldToggle = (fieldKey: string) => {
    setExportFields(prev => 
      prev.map(field => 
        field.key === fieldKey 
          ? { ...field, enabled: !field.enabled }
          : field
      )
    );
  };

  const exportData = () => {
    if (members.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no members in this club to export.',
        variant: 'destructive'
      });
      return;
    }

    const enabledFields = exportFields.filter(field => field.enabled);
    const headers = enabledFields.map(field => field.label);
    
    const rows = members.map(member => {
      return enabledFields.map(field => {
        switch (field.key) {
          case 'name':
            return member.profile?.name || '';
          case 'email':
            return ''; // Email not available in profile data for privacy
          case 'club_role':
            return member.club_role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Member';
          case 'signature_techniques':
            return ''; // Not available in current profile structure
          case 'created_at':
            return new Date(member.created_at).toLocaleDateString();
          default:
            return (member as any)[field.key] || '';
        }
      });
    });

    // Generate CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `club-members-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export completed',
      description: `Exported ${members.length} member records to CSV.`
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-3">Loading member data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <PermissionGuard permission="club.view.members" clubId={clubId}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Club Members
          </CardTitle>
          <CardDescription>
            Export current club roster with customizable fields
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">{members.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {members.filter(m => m.club_role !== 'member').length}
              </div>
              <div className="text-sm text-muted-foreground">Officers</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {members.filter(m => m.club_role === 'member').length}
              </div>
              <div className="text-sm text-muted-foreground">Regular Members</div>
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <h4 className="font-semibold mb-3">Select Fields to Export</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {exportFields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={field.enabled}
                    onCheckedChange={() => handleFieldToggle(field.key)}
                  />
                  <Label htmlFor={field.key} className="text-sm">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <Label htmlFor="format" className="text-sm font-medium">Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'csv' | 'excel') => setExportFormat(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="excel" disabled>Excel (.xlsx) - Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Button */}
          <div className="flex justify-center">
            <Button 
              onClick={exportData}
              disabled={exportFields.filter(f => f.enabled).length === 0 || members.length === 0}
              className="w-full max-w-md"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export {members.length} Members
            </Button>
          </div>
        </CardContent>
      </Card>
    </PermissionGuard>
  );
}