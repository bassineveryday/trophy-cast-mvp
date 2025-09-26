import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SignatureTechniques } from '@/components/SignatureTechniques';
import { useSignatureTechniques } from '@/hooks/useSignatureTechniques';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface EditSignatureTechniquesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTechniques: string[];
  onUpdate: (techniques: string[]) => void;
}

export function EditSignatureTechniques({ 
  open, 
  onOpenChange, 
  currentTechniques, 
  onUpdate 
}: EditSignatureTechniquesProps) {
  const [techniques, setTechniques] = useState<string[]>(currentTechniques);
  const { updateSignatureTechniques, loading } = useSignatureTechniques();

  useEffect(() => {
    setTechniques(currentTechniques);
  }, [currentTechniques, open]);

  const handleSave = async () => {
    const result = await updateSignatureTechniques(techniques);
    if (result.success) {
      onUpdate(techniques);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setTechniques(currentTechniques);
    onOpenChange(false);
  };

  const hasChanges = JSON.stringify(techniques) !== JSON.stringify(currentTechniques);
  const isValid = techniques.length >= 1 && techniques.length <= 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Signature Techniques</DialogTitle>
          <DialogDescription>
            Update your signature fishing techniques. Select 1-3 techniques and drag to reorder by preference.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner message="Updating techniques..." />
            </div>
          ) : (
            <SignatureTechniques
              value={techniques}
              onChange={setTechniques}
              disabled={loading}
              showTitle={false}
            />
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || !isValid || loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}