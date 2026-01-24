import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Mail } from 'lucide-react';

interface PaymentResult {
  success: boolean;
  is_new_user?: boolean;
  password_reset_required?: boolean;
  email?: string;
  user_id?: string;
  error?: string;
  already_recorded?: boolean;
}

const PurchaseSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [confirming, setConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const { user, checkPurchaseStatus } = useAuth();

  // Magic link state
  const [magicLinkSending, setMagicLinkSending] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null);
  const magicLinkAttemptedRef = useRef(false);

  const sendMagicLink = async (email: string) => {
    setMagicLinkError(null);
    setMagicLinkSending(true);
    try {
      const redirectTo = `${window.location.origin}/read`;
      const { error: linkError } = await supabase.auth.signInWithOtp({
        email,
        options: { 
          emailRedirectTo: redirectTo,
          shouldCreateUser: false // User already exists from edge function
        }
      });
      if (linkError) {
        setMagicLinkError(linkError.message);
        return;
      }
      setMagicLinkSent(true);
    } finally {
      setMagicLinkSending(false);
    }
  };

  useEffect(() => {
    const processPayment = async () => {
      const sessionId = searchParams.get('session_id');

      if (!sessionId) {
        setError('No session ID found');
        setConfirming(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('process-payment-success', {
          body: { session_id: sessionId },
        });

        if (error) throw error;

        if (data?.success) {
          setResult(data);

          // If user is already logged in, refresh their purchase status
          if (user) {
            await checkPurchaseStatus();
          }
        } else if (data?.error) {
          throw new Error(data.error);
        }
      } catch (err) {
        console.error('Error processing payment:', err);
        setError('Failed to confirm purchase. Please contact support if you were charged.');
      } finally {
        setConfirming(false);
      }
    };

    processPayment();
  }, [searchParams, checkPurchaseStatus, user]);

  // Auto-send magic link for new users
  useEffect(() => {
    if (!result?.is_new_user || !result?.email) return;
    if (magicLinkAttemptedRef.current) return;
    magicLinkAttemptedRef.current = true;
    sendMagicLink(result.email);
  }, [result]);

  if (confirming) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin opacity-50 mb-8" />
        <h1 className="chapter-heading text-2xl md:text-3xl mb-4">Confirming Your Purchase...</h1>
        <p className="body-text opacity-70">Please wait while we verify your payment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <h1 className="chapter-heading text-2xl md:text-3xl mb-4">Something Went Wrong</h1>
        <p className="body-text opacity-70 mb-8 max-w-md">{error}</p>
        <Link to="/">
          <Button variant="outline" className="font-sans uppercase tracking-widest">
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  // Magic link sent - show check email instructions
  if (magicLinkSent && result?.email) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
          <Mail className="w-10 h-10 text-foreground opacity-70" />
        </div>

        <h1 className="chapter-heading text-3xl md:text-4xl mb-6">Check Your Email!</h1>

        <div className="max-w-md space-y-4 mb-8">
          <p className="body-text opacity-70">
            We've sent a magic sign-in link to:
          </p>
          <div className="flex items-center gap-2 bg-muted px-4 py-3 rounded-md justify-center">
            <Mail className="w-4 h-4 opacity-70" />
            <span className="font-mono text-sm">{result.email}</span>
          </div>
          <p className="body-text opacity-70">
            Click the link in your email to sign in and start reading immediately. No password needed!
          </p>
        </div>

        <p className="body-text opacity-50 text-sm mb-8">
          Didn't receive it? Check your spam folder, or click below to resend.
        </p>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="font-sans uppercase tracking-widest"
            disabled={magicLinkSending}
            onClick={() => sendMagicLink(result.email!)}
          >
            {magicLinkSending ? 'Sending…' : 'Resend Magic Link'}
          </Button>
        </div>
      </div>
    );
  }

  // New user flow - send magic link
  if (result?.is_new_user && result?.email) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
          <CheckCircle className="w-10 h-10 text-foreground opacity-70" />
        </div>

        <h1 className="chapter-heading text-3xl md:text-4xl mb-4">Payment Successful!</h1>

        <p className="body-text opacity-70 mb-6 max-w-md">
          We're setting up your access. You'll receive a sign-in link at:
        </p>

        <div className="flex items-center gap-2 bg-muted px-4 py-3 rounded-md mb-8">
          <Mail className="w-4 h-4 opacity-70" />
          <span className="font-mono text-sm">{result.email}</span>
        </div>

        {magicLinkError && (
          <p className="text-sm text-destructive mb-4">{magicLinkError}</p>
        )}

        <div className="w-full max-w-sm space-y-4">
          <Button
            type="button"
            size="lg"
            className="w-full font-sans uppercase tracking-widest"
            onClick={() => sendMagicLink(result.email!)}
            disabled={magicLinkSending}
          >
            {magicLinkSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              'Send Me the Sign-In Link'
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Existing user (not logged in) - show magic link option
  if (!user && result?.email) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
            <CheckCircle className="w-10 h-10 text-foreground opacity-70" />
          </div>

          <h1 className="chapter-heading text-3xl md:text-4xl mb-4">You're All Set!</h1>

          <p className="body-text opacity-70 mb-6">
            You now have lifetime access to The ALP Handbook.
          </p>

          <div className="flex items-center gap-2 bg-muted px-4 py-3 rounded-md mb-8 justify-center">
            <Mail className="w-4 h-4 opacity-70" />
            <span className="font-mono text-sm">{result.email}</span>
          </div>

          {magicLinkError && (
            <p className="text-sm text-destructive mb-4">{magicLinkError}</p>
          )}

          <Button
            type="button"
            size="lg"
            className="w-full font-sans uppercase tracking-widest"
            onClick={() => sendMagicLink(result.email!)}
            disabled={magicLinkSending}
          >
            {magicLinkSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              'Email Me a Sign-In Link'
            )}
          </Button>
        </div>
      </div>
    );
  }

  // User is logged in - direct access
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
        <CheckCircle className="w-10 h-10 text-foreground opacity-70" />
      </div>

      <h1 className="chapter-heading text-3xl md:text-4xl mb-4">You're All Set!</h1>

      <p className="body-text opacity-70 mb-8 max-w-md">
        You now have lifetime access to The ALP Handbook.
      </p>

      <Link to="/read">
        <Button size="lg" className="font-sans uppercase tracking-widest">
          Start Reading Now
        </Button>
      </Link>
    </div>
  );
};

export default PurchaseSuccess;
