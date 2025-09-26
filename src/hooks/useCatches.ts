import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catchService } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import type { CreateCatchData, UpdateCatchData } from '@/types/database';

// Get all catches for current user
export function useCatches() {
  return useQuery({
    queryKey: ['catches'],
    queryFn: async () => {
      const { data, error } = await catchService.getAll();
      if (error) throw error;
      return data || [];
    }
  });
}

// Get catches by tournament
export function useCatchesByTournament(tournamentId: string) {
  return useQuery({
    queryKey: ['catches', 'tournament', tournamentId],
    queryFn: async () => {
      const { data, error } = await catchService.getByTournament(tournamentId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!tournamentId
  });
}

// Get catch by ID
export function useCatch(id: string) {
  return useQuery({
    queryKey: ['catches', id],
    queryFn: async () => {
      const { data, error } = await catchService.getById(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
}

// Create catch mutation
export function useCreateCatch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (catchData: CreateCatchData) => {
      const { data, error } = await catchService.create(catchData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catches'] });
      toast({
        title: 'Success',
        description: 'Catch logged successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to log catch'
      });
    }
  });
}

// Update catch mutation
export function useUpdateCatch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...catchData }: UpdateCatchData & { id: string }) => {
      const { data, error } = await catchService.update(id, catchData);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['catches'] });
      queryClient.invalidateQueries({ queryKey: ['catches', variables.id] });
      toast({
        title: 'Success',
        description: 'Catch updated successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update catch'
      });
    }
  });
}

// Delete catch mutation
export function useDeleteCatch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await catchService.delete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catches'] });
      toast({
        title: 'Success',
        description: 'Catch deleted successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete catch'
      });
    }
  });
}