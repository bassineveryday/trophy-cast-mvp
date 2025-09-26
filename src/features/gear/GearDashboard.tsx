import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GearManagement } from '@/components/gear/GearManagement';
import { useProfileData } from '@/hooks/useProfileData';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ContextAwareFloatingButton } from '@/components/voice/ContextAwareFloatingButton';

export default function GearDashboard() {
  const { profile, loading } = useProfileData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Loading gear dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Fishing Gear</h1>
      </div>

      {/* Gear Management Component */}
      <GearManagement 
        signatureTechniques={profile?.signature_techniques || []}
      />

      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
}