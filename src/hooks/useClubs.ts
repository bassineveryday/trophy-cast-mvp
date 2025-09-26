import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubService } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import type { CreateClubData, UpdateClubData } from '@/types/database';

// Get all clubs
export function useClubs() {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await clubService.getAll();
      if (error) throw error;
      return data || [];
    }
  });
}

// Get club by ID
export function useClub(id: string) {
  return useQuery({
    queryKey: ['clubs', id],
    queryFn: async () => {
      const { data, error } = await clubService.getById(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
}

// Create club mutation
export function useCreateClub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clubData: CreateClubData) => {
      const { data, error } = await clubService.create(clubData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({
        title: 'Success',
        description: 'Club created successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create club'
      });
    }
  });
}

// Update club mutation
export function useUpdateClub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...clubData }: UpdateClubData & { id: string }) => {
      const { data, error } = await clubService.update(id, clubData);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['clubs', variables.id] });
      toast({
        title: 'Success',
        description: 'Club updated successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update club'
      });
    }
  });
}

// Delete club mutation
export function useDeleteClub() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await clubService.delete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({
        title: 'Success',
        description: 'Club deleted successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete club'
      });
    }
  });
}