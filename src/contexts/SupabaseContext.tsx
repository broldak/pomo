import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  createClient,
  type Session,
  type User,
  type SupabaseClient,
} from "@supabase/supabase-js";

// TODO: Move to .env / doppler
const supabaseUrl = "https://kmmvggdgtcjbtswslvlg.supabase.co";
const supabaseAnonKey = "sb_publishable_Xta_zUxlLz2N_95Km3eDGw_aXARvbkL";

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Context types
interface SupabaseContextType {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Create context
const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

// Provider component
interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    supabase,
    session,
    user,
    loading,
    signOut,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Export the context for direct access if needed
export { SupabaseContext };
