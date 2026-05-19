import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const StickyPreviewButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, hasPurchased, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || (user && hasPurchased) || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Link to="/preview">
        <button className="pill-cta pill-cta--ghost shadow-xl bg-background py-3 px-5 text-[11px]">
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
      </Link>
    </div>
  );
};

export default StickyPreviewButton;
