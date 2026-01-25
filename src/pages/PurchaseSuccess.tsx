import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Mail, Clock } from 'lucide-react';

interface PaymentResult {
  success: boolean;
  is_new_user?: boolean;
  email?: string;
  user_id?: string;
  error?: string;
  already_recorded?: boolean;
  welcome_email_sent?: boolean;
  welcome_email_error?: string;
}

const RESEND_COOLDOWN_SECONDS = 60;

const PurchaseSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [confirming, setConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const { user, checkPurchaseStatus } = useAuth();
  const processedRef = useRef(false);

  // Resend cooldown state
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendMagicLink = async () => {
    if (!result?.email || resendCooldown > 0 || resending) return;

    setResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const redirectTo = 'https://alphandbook.com/read';
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: result.email,
        options: { 
          emailRedirectTo: redirectTo,
          shouldCreateUser: false
        }
      });

      if (otpError) {
        setResendError(otpError.message);
        // Log the failure
        await supabase.functions.invoke('log-magic-link', {
          body: {
            email: result.email,
            source: 'purchase_success_manual_resend',
            status: 'failed',
            error_message: otpError.message,
          }
        });
      } else {
        setResendSuccess(true);
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        // Log the success
        await supabase.functions.invoke('log-magic-link', {
          body: {
            email: result.email,
            source: 'purchase_success_manual_resend',
            status: 'sent',
          }
        });
      }
    } catch (err) {
      setResendError('Failed to send magic link. Please try again.');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    const processPayment = async () => {
      // Prevent duplicate processing (React StrictMode)
      if (processedRef.current) return;
      processedRef.current = true;

      const sessionId = searchParams.get('session_id');

      if (!sessionId) {
        setError('No session ID found');
        setConfirming(false);
        return;
      }

      try {
        const { data, error: invokeError } = await supabase.functions.invoke('process-payment-success', {
          body: { session_id: sessionId },
        });

        if (invokeError) throw invokeError;

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

  // User is logged in - direct access
  if (user) {
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
  }

  // Not logged in - show email sent confirmation
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
        <CheckCircle className="w-10 h-10 text-foreground opacity-70" />
      </div>

      <h1 className="chapter-heading text-3xl md:text-4xl mb-4">Payment Successful!</h1>

      <div className="max-w-md space-y-4 mb-8">
        <p className="body-text opacity-70">
          Check your email for your welcome message and access link.
        </p>
        
        {result?.email && (
          <div className="flex items-center gap-2 bg-muted px-4 py-3 rounded-md justify-center">
            <Mail className="w-4 h-4 opacity-70" />
            <span className="font-mono text-sm">{result.email}</span>
          </div>
        )}

        {result?.welcome_email_error && (
          <p className="text-sm text-muted-foreground">
            Note: There was an issue sending your welcome email automatically. 
            Use the button below to request a new sign-in link.
          </p>
        )}
      </div>

      {/* Resend section */}
      <div className="w-full max-w-sm space-y-4 mb-8">
        {resendSuccess && (
          <p className="text-sm text-primary">
            ✓ A new sign-in link has been sent to your email!
          </p>
        )}
        
        {resendError && (
          <p className="text-sm text-destructive">{resendError}</p>
        )}

        <Button
          variant="outline"
          className="w-full font-sans uppercase tracking-widest"
          disabled={resending || resendCooldown > 0}
          onClick={handleResendMagicLink}
        >
          {resending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Resend in {resendCooldown}s
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Resend Sign-In Link
            </>
          )}
        </Button>
      </div>

      {/* Fallback info */}
      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          Didn't receive it? Check your spam folder, or visit{' '}
          <a 
            href="https://alphandbook.com/auth" 
            className="underline hover:text-foreground transition-colors"
          >
            alphandbook.com/auth
          </a>
          {' '}to request a new link.
        </p>
        <p>
          Questions? Email{' '}
          <a 
            href="mailto:marshall@marshallwilkinson.com" 
            className="underline hover:text-foreground transition-colors"
          >
            marshall@marshallwilkinson.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
