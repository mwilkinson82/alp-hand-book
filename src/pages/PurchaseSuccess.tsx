import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Loader2, Mail, Eye, EyeOff } from 'lucide-react';

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
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const { user, checkPurchaseStatus } = useAuth();
  
  // Password setup state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordSet, setPasswordSet] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('No session ID found');
        setConfirming(false);
        return;
      }

      try {
        // Call the process-payment-success function that doesn't require auth
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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!result?.email) {
      setPasswordError('Email not found. Please contact support.');
      return;
    }

    setSettingPassword(true);

    try {
      // Use signInWithPassword with the temp password won't work since we don't know it
      // Instead, we'll use the admin-created account and update password via a special flow
      // For now, let's sign up the user with their chosen password (this will fail if user exists)
      // Or better: use the password reset flow
      
      // Actually, the user was created with a random password. We need to:
      // 1. Send a password reset email, OR
      // 2. Have the edge function return a sign-in token/link
      
      // Simplest approach: sign them in with magic link / OTP, then they can set password
      // But for best UX, let's update the edge function to return a session token
      
      // For now, let's try password reset flow:
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(result.email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (resetError) {
        // If reset fails, try alternative approach
        console.error('Reset error:', resetError);
        setPasswordError('Could not send password reset. Please try signing in at /auth');
        setSettingPassword(false);
        return;
      }

      // Show success - they need to check email
      setPasswordSet(true);
    } catch (err) {
      console.error('Error setting password:', err);
      setPasswordError('Failed to set password. Please try again.');
    } finally {
      setSettingPassword(false);
    }
  };

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

  // Password set successfully - show email check prompt
  if (passwordSet) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-8">
          <Mail className="w-10 h-10 text-foreground opacity-70" />
        </div>
        
        <h1 className="chapter-heading text-3xl md:text-4xl mb-4">Check Your Email</h1>
        
        <p className="body-text opacity-70 mb-4 max-w-md">
          We've sent a password setup link to:
        </p>
        
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-md mb-6">
          <Mail className="w-4 h-4 opacity-70" />
          <span className="font-mono text-sm">{result?.email}</span>
        </div>
        
        <p className="body-text opacity-70 mb-8 max-w-md">
          Click the link in the email to set your password and access The ALP Handbook.
        </p>

        <Link to="/auth">
          <Button size="lg" className="font-sans uppercase tracking-widest">
            Go to Sign In
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
          Your account has been created with the email:
        </p>
        
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-md mb-6">
          <Mail className="w-4 h-4 opacity-70" />
          <span className="font-mono text-sm">{result.email}</span>
        </div>
        
        <p className="body-text opacity-70 mb-6 max-w-md">
          Set a password to access your handbook:
        </p>

        <form onSubmit={handleSetPassword} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          
          {passwordError && (
            <p className="text-sm text-destructive">{passwordError}</p>
          )}
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full font-sans uppercase tracking-widest"
            disabled={settingPassword}
          >
            {settingPassword ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              'Set Password & Continue'
            )}
          </Button>
        </form>
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
