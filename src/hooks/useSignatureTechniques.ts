import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useSignatureTechniques() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateSignatureTechniques = useCallback(async (techniques: string[]) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ signature_techniques: techniques })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Signature techniques updated successfully",
      });

      return { success: true, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update signature techniques",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getSignatureTechniques = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { techniques: [], error: null };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('signature_techniques')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      return { 
        techniques: data?.signature_techniques || [], 
        error: null 
      };
    } catch (error: any) {
      return { 
        techniques: [], 
        error: error.message || "Failed to fetch signature techniques" 
      };
    }
  }, []);

  return {
    updateSignatureTechniques,
    getSignatureTechniques,
    loading
  };
}