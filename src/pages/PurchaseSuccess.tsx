import React, { useEffect, useState } from 'react';
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
  error?: string;
}

const PurchaseSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [confirming, setConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const { user, checkPurchaseStatus } = useAuth();

  useEffect(() => {
    const processPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found');
        setConfirming(false);
        return;
      }

      try {
        // Call the new process-payment-success function that doesn't require auth
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

  // New user flow - they need to set a password
  if (result?.is_new_user && result?.password_reset_required) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
          <CheckCircle className="w-10 h-10 text-foreground opacity-70" />
        </div>
        
        <h1 className="chapter-heading text-3xl md:text-4xl mb-4">Purchase Complete!</h1>
        
        <p className="body-text opacity-70 mb-4 max-w-md">
          Thank you for your purchase. Your account has been created with the email:
        </p>
        
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-md mb-6">
          <Mail className="w-4 h-4 opacity-70" />
          <span className="font-mono text-sm">{result.email}</span>
        </div>
        
        <p className="body-text opacity-70 mb-8 max-w-md">
          Check your email to set your password, then sign in to access The ALP Handbook.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/auth">
            <Button size="lg" className="font-sans uppercase tracking-widest">
              Sign In
            </Button>
          </Link>
          <Link to="/auth?mode=forgot">
            <Button size="lg" variant="outline" className="font-sans uppercase tracking-widest">
              Resend Password Email
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
      
      <h1 className="chapter-heading text-3xl md:text-4xl mb-4">Purchase Complete</h1>
      
      <p className="body-text opacity-70 mb-8 max-w-md">
        Thank you for your purchase. You now have lifetime access to The ALP Handbook.
      </p>

      {user ? (
        <Link to="/read">
          <Button size="lg" className="font-sans uppercase tracking-widest">
            Start Reading
          </Button>
        </Link>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/auth">
            <Button size="lg" className="font-sans uppercase tracking-widest">
              Sign In to Read
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PurchaseSuccess;
