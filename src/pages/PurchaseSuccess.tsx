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
}

const PurchaseSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [confirming, setConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const { user, checkPurchaseStatus } = useAuth();

  // Account setup (new purchaser)
  const [setupEmailSending, setSetupEmailSending] = useState(false);
  const [setupEmailSent, setSetupEmailSent] = useState(false);
  const [setupEmailError, setSetupEmailError] = useState<string | null>(null);
  const setupAttemptedRef = useRef(false);

  const sendSetupEmail = async (email: string) => {
    setSetupEmailError(null);
    setSetupEmailSending(true);
    try {
      const redirectTo = `${window.location.origin}/auth?mode=reset&from=purchase&email=${encodeURIComponent(email)}&sent=1`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) {
        setSetupEmailError(resetError.message);
        return;
      }
      setSetupEmailSent(true);
    } finally {
      setSetupEmailSending(false);
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

  // Auto-send setup email once for brand new purchasers
  useEffect(() => {
    if (!result?.is_new_user || !result?.email) return;
    if (setupAttemptedRef.current) return;
    setupAttemptedRef.current = true;
    sendSetupEmail(result.email);
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

  // Setup email sent - show step-by-step instructions
  if (setupEmailSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
          <Mail className="w-10 h-10 text-foreground opacity-70" />
        </div>

        <h1 className="chapter-heading text-3xl md:text-4xl mb-6">Almost There!</h1>

        <div className="max-w-md space-y-6">
          <div className="flex items-start gap-4 text-left">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="body-text-emphasis mb-1">Check your email</p>
              <p className="body-text opacity-70 text-sm">
                We sent a link to <span className="font-mono">{result?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="body-text-emphasis mb-1">Click the link to create your password</p>
              <p className="body-text opacity-70 text-sm">This finishes your account setup</p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="body-text-emphasis mb-1">Start reading The ALP Handbook</p>
              <p className="body-text opacity-70 text-sm">You'll have lifetime access</p>
            </div>
          </div>
        </div>

        <p className="body-text opacity-50 text-sm mt-8">
          Didn't receive the email? Check your spam folder.
        </p>

        <div className="mt-8 space-y-3">
          <Link to={`/auth?mode=reset&from=purchase&email=${encodeURIComponent(result?.email || '')}&sent=1`}>
            <Button variant="outline" className="font-sans uppercase tracking-widest">
              I have the link — continue
            </Button>
          </Link>

          {result?.email && (
            <Button
              variant="ghost"
              className="font-sans uppercase tracking-widest"
              disabled={setupEmailSending}
              onClick={() => sendSetupEmail(result.email!)}
            >
              {setupEmailSending ? 'Sending…' : 'Resend email'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // New user flow - email them the setup link
  if (result?.is_new_user && result?.email) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
          <CheckCircle className="w-10 h-10 text-foreground opacity-70" />
        </div>

        <h1 className="chapter-heading text-3xl md:text-4xl mb-4">Payment Successful!</h1>

        <p className="body-text opacity-70 mb-6 max-w-md">
          One last step — create your password to access the handbook.
        </p>

        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-md mb-8">
          <Mail className="w-4 h-4 opacity-70" />
          <span className="font-mono text-sm">{result.email}</span>
        </div>

        {setupEmailError && (
          <p className="text-sm text-destructive mb-4">{setupEmailError}</p>
        )}

        <div className="w-full max-w-sm space-y-4">
          <Button
            type="button"
            size="lg"
            className="w-full font-sans uppercase tracking-widest"
            onClick={() => sendSetupEmail(result.email!)}
            disabled={setupEmailSending}
          >
            {setupEmailSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              'Email Me the Setup Link'
            )}
          </Button>

          <Link to={`/auth?mode=reset&from=purchase&email=${encodeURIComponent(result.email)}&sent=1`}>
            <Button variant="outline" size="lg" className="w-full font-sans uppercase tracking-widest">
              Continue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Existing user or already logged in
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
        <CheckCircle className="w-10 h-10 text-foreground opacity-70" />
      </div>

      <h1 className="chapter-heading text-3xl md:text-4xl mb-4">You're All Set!</h1>

      <p className="body-text opacity-70 mb-8 max-w-md">
        You now have lifetime access to The ALP Handbook.
      </p>

      {user ? (
        <Link to="/read">
          <Button size="lg" className="font-sans uppercase tracking-widest">
            Start Reading Now
          </Button>
        </Link>
      ) : (
        <div className="space-y-6 max-w-md">
          <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-md justify-center">
            <Mail className="w-4 h-4 opacity-70" />
            <span className="font-mono text-sm">{result?.email}</span>
          </div>

          <p className="body-text opacity-70">
            Sign in with this email to access your handbook.
          </p>

          <Link to={`/auth?from=purchase&email=${encodeURIComponent(result?.email || '')}`}>
            <Button size="lg" className="font-sans uppercase tracking-widest w-full">
              Sign In to Read
            </Button>
          </Link>

          <Link to={`/auth?mode=reset&from=purchase&email=${encodeURIComponent(result?.email || '')}`}>
            <Button variant="outline" size="lg" className="font-sans uppercase tracking-widest w-full">
              Forgot password?
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PurchaseSuccess;
