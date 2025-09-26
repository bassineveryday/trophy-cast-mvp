import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName: string;
  onUpload: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  disabled?: boolean;
}

export function AvatarUpload({ currentAvatarUrl, userName, onUpload, disabled }: AvatarUploadProps) {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, etc.)',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const result = await onUpload(selectedFile);
    
    if (result.success) {
      setShowModal(false);
      setPreview(null);
      setSelectedFile(null);
      toast({
        title: 'Success',
        description: 'Avatar updated successfully'
      });
    }
    setUploading(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <div className="relative group">
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage src={currentAvatarUrl || undefined} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xl md:text-3xl font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        
        <Button
          size="sm"
          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 shadow-lg"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Choose a new profile picture. It will be visible to other anglers.
            </DialogDescription>
          </DialogHeader>

          {preview && (
            <div className="flex justify-center py-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={preview} alt="Preview" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uploading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Update Avatar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}