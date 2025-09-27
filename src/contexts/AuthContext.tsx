import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  club: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  signature_techniques?: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; club: string; avatar_url?: string; signature_techniques?: string[]; home_state?: string; city?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string, intendedRoute?: string) => Promise<{ error: any }>;
  resendConfirmation: (email: string) => Promise<{ error: any } | void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Fetch user profile when session changes
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();

              if (error) {
                console.error('Error fetching profile:', error);
              } else {
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { name: string; club: string; avatar_url?: string; signature_techniques?: string[]; home_state?: string; city?: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
            club: userData.club,
            avatar_url: userData.avatar_url || '',
            signature_techniques: userData.signature_techniques || [],
            home_state: userData.home_state || '',
            city: userData.city || ''
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Up Error",
          description: error.message
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account."
        });
      }

      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        variant: "destructive",
        title: "Sign Up Error",
        description: errorMessage
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string, intendedRoute?: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign In Error",
          description: error.message
        });
      } else {
        // Store intended route for post-login navigation
        if (intendedRoute) {
          sessionStorage.setItem('trophycast_intended_route', intendedRoute);
        }
        
        toast({
          title: "Welcome back!",
          description: "Redirecting to your personalized dashboard..."
        });
      }

      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        variant: "destructive",
        title: "Sign In Error",
        description: errorMessage
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Out Error",
          description: error.message
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out."
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Resend Email Failed",
          description: error.message
        });
      } else {
        toast({
          title: "Confirmation Email Sent",
          description: "Check your inbox and spam folder for the verification link."
        });
      }
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        variant: "destructive",
        title: "Resend Email Failed",
        description: errorMessage
      });
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    resendConfirmation,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}