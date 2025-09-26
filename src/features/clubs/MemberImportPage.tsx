import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MemberImportWizard from '@/components/member-import/MemberImportWizard';

export default function MemberImportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <div>Club not found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/clubs/${id}/manage`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Club Management
        </Button>
      </div>
      
      <MemberImportWizard 
        clubId={id} 
        onComplete={() => navigate(`/clubs/${id}/manage`)}
      />
    </div>
  );
}