import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BackButton from '@/components/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Fish, Mic, MicOff, Wifi, WifiOff } from 'lucide-react';

const catchSchema = z.object({
  tournament_id: z.string().optional(),
  species: z.string().min(1, 'Species is required'),
  weight: z.string().min(1, 'Weight is required'),
  length: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type CatchFormData = z.infer<typeof catchSchema>;

// Offline queue using localStorage
const QUEUE_KEY = 'trophy-cast-catch-queue';

export default function LogCatch() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [queuedCount, setQueuedCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<CatchFormData>({
    resolver: zodResolver(catchSchema),
    defaultValues: {
      tournament_id: '',
      species: 'Largemouth',
      weight: '',
      length: '',
      notes: '',
    }
  });

  useEffect(() => {
    loadTournaments();
    checkQueue();
    
    // Monitor online status
    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadTournaments = async () => {
    try {
      const { data } = await supabase
        .from('tournaments')
        .select('id, name, date')
        .order('date', { ascending: false })
        .limit(10);
      
      setTournaments(data || []);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    }
  };

  const checkQueue = () => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    setQueuedCount(queue.length);
  };

  const processQueue = async () => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    if (queue.length === 0) return;

    toast({
      title: 'Processing queue',
      description: `Syncing ${queue.length} queued catch(es)...`,
    });

    for (const catchData of queue) {
      try {
        await supabase.from('catches').insert(catchData);
      } catch (error) {
        console.error('Failed to sync catch:', error);
      }
    }

    localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
    setQueuedCount(0);
    
    toast({
      title: 'Sync complete',
      description: 'All catches synced successfully',
    });
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: 'destructive',
        title: 'Not supported',
        description: 'Voice input not supported in this browser',
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsVoiceActive(true);
    recognition.onend = () => setIsVoiceActive(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const currentNotes = form.getValues('notes') || '';
      form.setValue('notes', currentNotes + (currentNotes ? ' ' : '') + transcript);
    };
    
    recognition.onerror = () => {
      setIsVoiceActive(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Voice recognition failed',
      });
    };
    
    recognition.start();
  };

  const handleSubmit = async (data: CatchFormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const catchData = {
        user_id: user.id,
        tournament_id: data.tournament_id || null,
        species: data.species,
        weight: parseFloat(data.weight),
        length: data.length ? parseFloat(data.length) : null,
        notes: data.notes || null,
        timestamp: new Date().toISOString(),
      };

      if (!isOnline) {
        // Queue for later
        const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
        queue.push(catchData);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
        setQueuedCount(queue.length);
        
        toast({
          title: 'Queued',
          description: 'Catch will be synced when online',
        });
        
        form.reset();
      } else {
        const { error } = await supabase.from('catches').insert(catchData);
        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Catch logged successfully',
        });
        
        navigate('/my-catches');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <BackButton />
      
      <div className="max-w-md mx-auto mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mr-3">
              <Fish className="w-6 h-6 text-success" />
            </div>
            <h1 className="text-2xl font-heading font-bold">Log Catch</h1>
          </div>
          <div className="flex items-center text-sm">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
          </div>
        </div>

        {queuedCount > 0 && (
          <Card className="mb-4 bg-warning/10 border-warning">
            <CardContent className="p-4">
              <p className="text-sm">
                {queuedCount} catch(es) queued. Will sync when online.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Catch Details</CardTitle>
            <CardDescription>Log your catch with voice or keyboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="tournament_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tournament (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tournaments.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name} ({new Date(t.date).toLocaleDateString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Species</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Largemouth">Largemouth Bass</SelectItem>
                          <SelectItem value="Smallmouth">Smallmouth Bass</SelectItem>
                          <SelectItem value="Spotted">Spotted Bass</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="5.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (inches, optional)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="18.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Textarea 
                            placeholder="Add details about the catch..." 
                            className="flex-1"
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant={isVoiceActive ? 'destructive' : 'outline'}
                          size="icon"
                          onClick={startVoiceInput}
                          className="shrink-0"
                        >
                          {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging...' : isOnline ? 'Log Catch' : 'Queue Catch (Offline)'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
