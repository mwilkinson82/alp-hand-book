import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const StickyPurchaseButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { user, hasPurchased, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePurchase = async () => {
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading || (user && hasPurchased) || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-32 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={handlePurchase}
        disabled={checkoutLoading}
        className="pill-cta shadow-2xl py-3 px-6 text-[11px]"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        {checkoutLoading ? '…' : 'Get the Handbook — $47'}
      </button>
    </div>
  );
};

export default StickyPurchaseButton;
