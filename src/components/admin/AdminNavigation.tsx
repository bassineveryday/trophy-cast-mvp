import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Crown, 
  Settings, 
  BarChart3, 
  Users, 
  Shield, 
  Eye, 
  Bug,
  Zap,
  ChevronDown,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsPlatformAdmin } from '@/hooks/usePlatformAdmin';

export function AdminNavigation() {
  const isPlatformAdmin = useIsPlatformAdmin();
  const [adminMode, setAdminMode] = useState(false);

  if (!isPlatformAdmin) return null;

  return (
    <div className="flex items-center space-x-2">
      {/* Admin Override Toggle */}
      <Button
        variant={adminMode ? "default" : "outline"}
        size="sm"
        onClick={() => setAdminMode(!adminMode)}
        className="flex items-center space-x-2"
      >
        <Shield className="w-4 h-4" />
        <span className="hidden md:inline">Admin Override</span>
        {adminMode && (
          <Badge className="ml-1 bg-orange-500 text-white">ON</Badge>
        )}
      </Button>

      {/* Admin Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-orange-500" />
            <span className="hidden md:inline">Platform Admin</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-background border shadow-lg z-50" 
          align="end"
        >
          {/* Platform Management */}
          <div className="px-3 py-2 text-sm font-semibold border-b">
            Platform Management
          </div>
          
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Platform Analytics
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/admin/users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/admin/clubs" className="flex items-center">
              <Crown className="mr-2 h-4 w-4" />
              Club Oversight
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* System Tools */}
          <div className="px-3 py-2 text-sm font-semibold border-b">
            System Tools
          </div>
          
          <DropdownMenuItem asChild>
            <Link to="/admin/impersonation" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              User Impersonation
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/admin/system" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/admin/debug" className="flex items-center">
              <Bug className="mr-2 h-4 w-4" />
              Debug Panel
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Quick Actions */}
          <div className="px-3 py-2 text-sm font-semibold border-b">
            Quick Actions
          </div>
          
          <DropdownMenuItem asChild>
            <Link to="/database-example" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Database Console
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => window.open(`https://supabase.com/dashboard/project/jgpjktzghngpzxsxfurm`, '_blank')}>
            <Zap className="mr-2 h-4 w-4" />
            Supabase Console
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}