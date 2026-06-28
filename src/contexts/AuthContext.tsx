import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  checkPurchaseStatus: (sessionOverride?: Session | null) => Promise<void>;
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

  const sessionRef = useRef<Session | null>(null);
  const hasPurchasedRef = useRef(false);

  useEffect(() => {
    sessionRef.current = session;
    hasPurchasedRef.current = hasPurchased;
  }, [session, hasPurchased]);

  const checkPurchaseStatus = async (sessionOverride?: Session | null) => {
    const activeSession = sessionOverride ?? session;
    if (!activeSession) {
      setHasPurchased(false);
      return;
    }

    setPurchaseLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-purchase', {
        headers: {
          Authorization: `Bearer ${activeSession.access_token}`,
        },
      });
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
        const previousSession = sessionRef.current;
        const sameUser = Boolean(
          session?.user?.id && previousSession?.user?.id === session.user.id
        );

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Skip TOKEN_REFRESHED / USER_UPDATED — the user hasn't changed and
        // flipping purchaseLoading would unmount /read and lose scroll position
        // when the reader tabs back from Excel / Google.
        if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          return;
        }

        // Some browsers re-emit SIGNED_IN when returning to the tab. If the
        // same purchased reader is already mounted, do not flip purchaseLoading
        // and replace the book with the loader.
        if (event === 'SIGNED_IN' && sameUser && hasPurchasedRef.current) {
          return;
        }

        // Defer purchase check to avoid deadlock
        if (session?.user) {
          // Prevent route guards from redirecting before purchase check starts
          setPurchaseLoading(true);
          setTimeout(() => {
            checkPurchaseStatus(session);
          }, 0);
        } else {
          setHasPurchased(false);
          setPurchaseLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        // Prevent route guards from redirecting before purchase check starts
        setPurchaseLoading(true);
        setTimeout(() => {
          checkPurchaseStatus(session);
        }, 0);
      } else {
        setPurchaseLoading(false);
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
