import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

const PurchaseSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [confirming, setConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkPurchaseStatus } = useAuth();

  useEffect(() => {
    const confirmPurchase = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found');
        setConfirming(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('confirm-purchase', {
          body: { session_id: sessionId },
        });

        if (error) throw error;

        if (data?.success) {
          // Refresh purchase status in auth context
          await checkPurchaseStatus();
        }
      } catch (err) {
        console.error('Error confirming purchase:', err);
        setError('Failed to confirm purchase. Please contact support if you were charged.');
      } finally {
        setConfirming(false);
      }
    };

    confirmPurchase();
  }, [searchParams, checkPurchaseStatus]);

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
        <CheckCircle className="w-10 h-10 text-foreground opacity-70" />
      </div>
      
      <h1 className="chapter-heading text-3xl md:text-4xl mb-4">Purchase Complete</h1>
      
      <p className="body-text opacity-70 mb-8 max-w-md">
        Thank you for your purchase. You now have lifetime access to The ALP Handbook.
      </p>

      <Link to="/read">
        <Button size="lg" className="font-sans uppercase tracking-widest">
          Start Reading
        </Button>
      </Link>
    </div>
  );
};

export default PurchaseSuccess;
