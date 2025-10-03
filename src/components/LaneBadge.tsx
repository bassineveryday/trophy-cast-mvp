import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export function LaneBadge() {
  const { profile } = useAuth();

  // Don't show badge if not logged in
  if (!profile) return null;

  const isDemo = (profile as any)?.is_demo ?? false;
  const label = isDemo ? 'DEMO' : 'PRODUCTION';
  const variant = isDemo ? 'secondary' : 'default';

  return (
    <Badge 
      variant={variant}
      className="text-xs px-2 py-0.5 rounded border font-mono"
    >
      {label}
    </Badge>
  );
}
