import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  city: z.string().trim().max(50, 'City must be less than 50 characters').optional(),
  home_state: z.string().optional(),
  tournaments_fished: z.coerce.number().min(0).max(9999).optional(),
  aoy_titles: z.coerce.number().min(0).max(99).optional(),
  biggest_catch_weight: z.coerce.number().min(0).max(99.99).optional(),
  biggest_catch_species: z.string().trim().max(50, 'Species must be less than 50 characters').optional(),
  biggest_catch_location: z.string().trim().max(100, 'Location must be less than 100 characters').optional(),
  favorite_water: z.string().trim().max(100, 'Favorite water must be less than 100 characters').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ExtendedProfile {
  id: string;
  name: string;
  city: string | null;
  home_state: string | null;
  tournaments_fished: number;
  aoy_titles: number;
  biggest_catch_weight: number | null;
  biggest_catch_species: string | null;
  biggest_catch_location: string | null;
  favorite_water: string | null;
}

interface EditProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfile: ExtendedProfile;
  onUpdate: (updates: Partial<ExtendedProfile>) => Promise<void>;
}

export function EditProfile({ open, onOpenChange, currentProfile, onUpdate }: EditProfileProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentProfile.name,
      city: currentProfile.city || '',
      home_state: currentProfile.home_state || '',
      tournaments_fished: currentProfile.tournaments_fished,
      aoy_titles: currentProfile.aoy_titles,
      biggest_catch_weight: currentProfile.biggest_catch_weight || undefined,
      biggest_catch_species: currentProfile.biggest_catch_species || '',
      biggest_catch_location: currentProfile.biggest_catch_location || '',
      favorite_water: currentProfile.favorite_water || '',
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: currentProfile.name,
        city: currentProfile.city || '',
        home_state: currentProfile.home_state || '',
        tournaments_fished: currentProfile.tournaments_fished,
        aoy_titles: currentProfile.aoy_titles,
        biggest_catch_weight: currentProfile.biggest_catch_weight || undefined,
        biggest_catch_species: currentProfile.biggest_catch_species || '',
        biggest_catch_location: currentProfile.biggest_catch_location || '',
        favorite_water: currentProfile.favorite_water || '',
      });
    }
  }, [currentProfile, open, form]);

  const handleSave = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const updates = {
        ...data,
        city: data.city || null,
        home_state: data.home_state || null,
        biggest_catch_species: data.biggest_catch_species || null,
        biggest_catch_location: data.biggest_catch_location || null,
        favorite_water: data.favorite_water || null,
      };
      
      await onUpdate(updates);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your angler profile information. This information will be visible to other anglers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            {saving && (
              <div className="flex justify-center py-4">
                <LoadingSpinner message="Updating profile..." />
              </div>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <CardDescription>Your name and location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Your city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="home_state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Career Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Career Statistics</CardTitle>
                <CardDescription>Your tournament history and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tournaments_fished"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tournaments Fished</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aoy_titles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AOY Titles Won</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="favorite_water"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favorite Water Body</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lake Guntersville, Wheeler Lake" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Biggest Catch */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Biggest Catch</CardTitle>
                <CardDescription>Details about your personal best catch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="biggest_catch_weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="biggest_catch_species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Species</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Largemouth Bass" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="biggest_catch_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Caught</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lake Guntersville, AL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}