import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const fromPurchase = searchParams.get('from') === 'purchase';
  const purchaseEmail = searchParams.get('email') || '';
  const mode = searchParams.get('mode');
  const sent = searchParams.get('sent') === '1';
  
  const [isLogin, setIsLogin] = useState(true);
  const [useMagicLink, setUseMagicLink] = useState(true); // Default to magic link
  const [email, setEmail] = useState(purchaseEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // Magic link state
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  // Password setup / reset flow
  const [resetEmailSent, setResetEmailSent] = useState(sent);
  const [resetEmailLoading, setResetEmailLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  
  const { signIn, signUp, session, user, checkPurchaseStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setResetEmailSent(sent);
  }, [sent]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Login failed',
              description: 'Invalid email or password. Please try again.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Login failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          navigate(fromPurchase ? '/read' : '/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account exists',
              description: 'An account with this email already exists. Please log in instead.',
              variant: 'destructive',
            });
            setIsLogin(true);
          } else {
            toast({
              title: 'Sign up failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Account created',
            description: 'Your account has been created successfully.',
          });
          navigate(fromPurchase ? '/read' : '/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return;
    }
    
    setMagicLinkLoading(true);
    try {
      // Use server-side admin magic link (bypasses Supabase's client OTP rate limits)
      const { data, error } = await supabase.functions.invoke('send-welcome-email-admin', {
        body: { email },
      });

      if (error || (data && data.error)) {
        const msg = (data && data.error) || error?.message || 'Unable to send link';
        toast({
          title: 'Failed to send link',
          description: msg,
          variant: 'destructive',
        });
      } else {
        setMagicLinkSent(true);
        toast({
          title: 'Check your email',
          description: 'We sent you a sign-in link.',
        });
      }
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setResetError(emailResult.error.errors[0].message);
      return;
    }

    setResetEmailLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset&from=purchase&email=${encodeURIComponent(email)}&sent=1`,
      });

      if (error) {
        setResetError(error.message);
        return;
      }

      setResetEmailSent(true);
    } finally {
      setResetEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPasswordError(null);

    const passResult = passwordSchema.safeParse(newPassword);
    if (!passResult.success) {
      setNewPasswordError(passResult.error.errors[0].message);
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setNewPasswordError('Passwords do not match');
      return;
    }

    setResetEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setNewPasswordError(error.message);
        return;
      }

      // Refresh access state + take them straight to the book
      await checkPurchaseStatus();
      toast({
        title: 'Password set',
        description: 'Your account is ready. Redirecting you to the handbook…',
      });
      navigate('/read');
    } finally {
      setResetEmailLoading(false);
    }
  };

  // Password setup / reset UI
  if (mode === 'reset') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="chapter-heading text-3xl md:text-4xl mb-4">
              {fromPurchase ? 'Create Your Account' : 'Reset Your Password'}
            </h1>
            <p className="body-text text-base opacity-70">
              {session
                ? 'Choose a password to finish setup.'
                : 'We’ll email you a secure link to set your password.'}
            </p>
          </div>

          {session ? (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="font-sans text-sm uppercase tracking-wide opacity-70">
                  New password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background border-border font-sans"
                  disabled={resetEmailLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password-confirm" className="font-sans text-sm uppercase tracking-wide opacity-70">
                  Confirm password
                </Label>
                <Input
                  id="new-password-confirm"
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background border-border font-sans"
                  disabled={resetEmailLoading}
                />
              </div>

              {newPasswordError && (
                <p className="text-sm text-destructive font-sans">{newPasswordError}</p>
              )}

              <Button
                type="submit"
                className="w-full font-sans uppercase tracking-widest"
                disabled={resetEmailLoading}
              >
                {resetEmailLoading ? 'Please wait…' : 'Set Password & Continue'}
              </Button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSendResetEmail} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-sans text-sm uppercase tracking-wide opacity-70">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-background border-border font-sans"
                    disabled={resetEmailLoading}
                  />
                </div>

                {resetError && (
                  <p className="text-sm text-destructive font-sans">{resetError}</p>
                )}

                <Button
                  type="submit"
                  className="w-full font-sans uppercase tracking-widest"
                  disabled={resetEmailLoading}
                >
                  {resetEmailLoading ? 'Sending…' : 'Email Me the Setup Link'}
                </Button>
              </form>

              {resetEmailSent && (
                <div className="mt-8 space-y-2">
                  <p className="body-text text-sm opacity-70">
                    Check your inbox for the link, then come back here to set your password.
                  </p>
                  <p className="body-text text-sm opacity-50">If you don’t see it, check spam/promotions.</p>
                </div>
              )}
            </>
          )}

          <div className="mt-8 text-center space-y-3">
            <Link
              to={fromPurchase ? `/auth?from=purchase&email=${encodeURIComponent(email)}` : '/auth'}
              className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity underline"
            >
              Back to sign in
            </Link>

            <div>
              <Link
                to="/"
                className="font-sans text-sm opacity-50 hover:opacity-70 transition-opacity"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Magic link UI (default for returning users)
  if (useMagicLink && isLogin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="chapter-heading text-3xl md:text-4xl mb-4">
              {fromPurchase ? 'Access Your Handbook' : 'Welcome Back'}
            </h1>
            <p className="body-text text-base opacity-70">
              Enter your email and we'll send you a sign-in link.
            </p>
          </div>

          {magicLinkSent ? (
            <div className="text-center space-y-6">
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <p className="body-text text-lg mb-2">Check your inbox</p>
                <p className="body-text text-sm opacity-70">
                  We sent a sign-in link to <strong>{email}</strong>
                </p>
              </div>
              <p className="body-text text-sm opacity-50">
                Click the link in the email to sign in. Check spam if you don't see it.
              </p>
              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-sans text-sm uppercase tracking-wide opacity-70">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-background border-border font-sans"
                  disabled={magicLinkLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive font-sans">{errors.email}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full font-sans uppercase tracking-widest"
                disabled={magicLinkLoading}
              >
                {magicLinkLoading ? 'Sending...' : 'Send Sign-In Link'}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="font-sans text-sm opacity-50 hover:opacity-70 transition-opacity"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="chapter-heading text-3xl md:text-4xl mb-4">
            {fromPurchase 
              ? 'Access Your Handbook' 
              : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h1>
          <p className="body-text text-base opacity-70">
            {fromPurchase 
              ? 'Sign in with the email you used to purchase'
              : (isLogin 
                ? 'Sign in to access your purchased content' 
                : 'Create an account to purchase the handbook')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans text-sm uppercase tracking-wide opacity-70">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-background border-border font-sans"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-destructive font-sans">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-sans text-sm uppercase tracking-wide opacity-70">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-background border-border font-sans"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-destructive font-sans">{errors.password}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full font-sans uppercase tracking-widest"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="mt-8 text-center space-y-3">
          {isLogin && (
            <button
              type="button"
              onClick={() => setUseMagicLink(true)}
              className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity underline block w-full"
            >
              Sign in with magic link instead
            </button>
          )}
          
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity underline"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="font-sans text-sm opacity-50 hover:opacity-70 transition-opacity"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
