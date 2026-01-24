import React, { useEffect, useState } from 'react';
import { Moon, Sun, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const PreviewHeader: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { user, hasPurchased, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (saved === 'dark' || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium tracking-wide uppercase opacity-60" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>
            The ALP Handbook
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent opacity-60 font-sans">
            Preview
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 opacity-70" />
            ) : (
              <Moon className="w-5 h-5 opacity-70" />
            )}
          </button>
          
          {!loading && (
            <>
              {user && hasPurchased ? (
                <Link to="/read">
                  <Button size="sm" className="font-sans text-xs uppercase tracking-widest">
                    Read Book
                  </Button>
                </Link>
              ) : user ? (
                <Button 
                  size="sm" 
                  onClick={handlePurchase}
                  disabled={checkoutLoading}
                  className="font-sans text-xs uppercase tracking-widest gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {checkoutLoading ? 'Loading...' : 'Purchase $47'}
                </Button>
              ) : (
                <Link to="/auth">
                  <Button size="sm" variant="outline" className="font-sans text-xs uppercase tracking-widest">
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PreviewHeader;
