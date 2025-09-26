import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';

interface ImportButtonProps {
  clubId: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function ImportButton({ clubId, variant = 'default', size = 'default', className }: ImportButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/clubs/${clubId}/import`);
  };

  return (
    <PermissionGuard permission="club.manage.members" clubId={clubId}>
      <Button 
        variant={variant} 
        size={size}
        className={className}
        onClick={handleClick}
      >
        <Upload className="h-4 w-4 mr-2" />
        Import Members
      </Button>
    </PermissionGuard>
  );
}