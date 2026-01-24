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
      <div className="max-w-5xl mx-auto px-3 sm:px-6 md:px-12 h-12 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <span className="text-xs sm:text-sm font-medium tracking-wide uppercase opacity-60 truncate" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>
            The ALP Handbook
          </span>
          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-accent opacity-60 font-sans shrink-0">
            Preview
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
            )}
          </button>
          
          {!loading && (
            <>
              {user && hasPurchased ? (
                <Link to="/read">
                  <Button size="sm" className="font-sans text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest px-2 sm:px-3">
                    Read
                  </Button>
                </Link>
              ) : user ? (
                <Button 
                  size="sm" 
                  onClick={handlePurchase}
                  disabled={checkoutLoading}
                  className="font-sans text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest gap-1 sm:gap-2 px-2 sm:px-3"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{checkoutLoading ? '...' : '$47'}</span>
                  <span className="xs:hidden">{checkoutLoading ? '...' : '$47'}</span>
                </Button>
              ) : (
                <Link to="/auth">
                  <Button size="sm" variant="outline" className="font-sans text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest px-2 sm:px-3">
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
