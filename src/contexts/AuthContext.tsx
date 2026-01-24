import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasPurchased: boolean;
  purchaseLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkPurchaseStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const checkPurchaseStatus = async () => {
    if (!session) {
      setHasPurchased(false);
      return;
    }

    setPurchaseLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-purchase');
      if (error) {
        console.error('Error checking purchase status:', error);
        setHasPurchased(false);
      } else {
        setHasPurchased(data?.purchased === true);
      }
    } catch (err) {
      console.error('Error checking purchase status:', err);
      setHasPurchased(false);
    } finally {
      setPurchaseLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Defer purchase check to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            checkPurchaseStatus();
          }, 0);
        } else {
          setHasPurchased(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          checkPurchaseStatus();
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setHasPurchased(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        hasPurchased,
        purchaseLoading,
        signUp,
        signIn,
        signOut,
        checkPurchaseStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
