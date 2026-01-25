import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const StickyPreviewButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, hasPurchased, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section (roughly 600px)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show if loading, user has purchased, or not scrolled enough
  if (loading || (user && hasPurchased) || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Link to="/preview">
        <Button
          size="sm"
          variant="outline"
          className="shadow-lg font-sans text-xs uppercase tracking-widest gap-2 px-4 py-2 rounded-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-background"
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </Link>
    </div>
  );
};

export default StickyPreviewButton;
