import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

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

type AuthState = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any } | void>;
};

const AuthCtx = createContext<AuthState>({ 
  user: null, 
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resendConfirmation: async () => ({ error: null })
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    console.debug("[Auth:init] starting");
    const safety = setTimeout(() => {
      if (mounted) {
        console.debug("[Auth:safety-timeout] forcing loading=false");
        setLoading(false);
      }
    }, 5000);

    const init = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) console.error("[Auth] getSession error:", error);
      console.debug("[Auth:session]", { hasSession: !!session, userId: session?.user?.id });
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);

      if (u) {
        const p = await fetchProfile(u.id);
        if (mounted) setProfile(p);
      } else {
        setProfile(null);
      }
      clearTimeout(safety);
    };

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      if (!mounted) return;
      console.debug("[Auth:onAuthStateChange]", { hasSession: !!session, userId: session?.user?.id });
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const p = await fetchProfile(u.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    init();

    return () => {
      mounted = false;
      clearTimeout(safety);
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: userData
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    return { error };
  };

  const value = useMemo(() => ({ 
    user, 
    profile, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    resendConfirmation 
  }), [user, profile, loading]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);