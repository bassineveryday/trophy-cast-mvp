import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tournamentService } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import type { CreateTournamentData, UpdateTournamentData } from '@/types/database';

// Get all tournaments
export function useTournaments() {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await tournamentService.getAll();
      if (error) throw error;
      return data || [];
    }
  });
}

// Get tournaments by club
export function useTournamentsByClub(clubId: string) {
  return useQuery({
    queryKey: ['tournaments', 'club', clubId],
    queryFn: async () => {
      const { data, error } = await tournamentService.getByClub(clubId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!clubId
  });
}

// Get tournament by ID
export function useTournament(id: string) {
  return useQuery({
    queryKey: ['tournaments', id],
    queryFn: async () => {
      const { data, error } = await tournamentService.getById(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
}

// Create tournament mutation
export function useCreateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tournamentData: CreateTournamentData) => {
      const { data, error } = await tournamentService.create(tournamentData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast({
        title: 'Success',
        description: 'Tournament created successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create tournament'
      });
    }
  });
}

// Update tournament mutation
export function useUpdateTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...tournamentData }: UpdateTournamentData & { id: string }) => {
      const { data, error } = await tournamentService.update(id, tournamentData);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', variables.id] });
      toast({
        title: 'Success',
        description: 'Tournament updated successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update tournament'
      });
    }
  });
}

// Delete tournament mutation
export function useDeleteTournament() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await tournamentService.delete(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast({
        title: 'Success',
        description: 'Tournament deleted successfully!'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete tournament'
      });
    }
  });
}