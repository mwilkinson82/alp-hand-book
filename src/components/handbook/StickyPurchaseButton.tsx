import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const StickyPurchaseButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { user, hasPurchased, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section (roughly 400px)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePurchase = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Don't show if loading, user has purchased, or not scrolled enough
  if (loading || (user && hasPurchased) || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Button
        onClick={handlePurchase}
        disabled={checkoutLoading}
        size="sm"
        className="shadow-lg font-sans text-xs uppercase tracking-widest gap-2 px-4 py-2 rounded-full"
      >
        <ShoppingCart className="w-4 h-4" />
        {checkoutLoading ? '...' : '$47'}
      </Button>
    </div>
  );
};

export default StickyPurchaseButton;
