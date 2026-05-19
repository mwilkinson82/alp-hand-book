import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import HeroSection from '../components/handbook/HeroSection';
import TableOfContents from '../components/handbook/TableOfContents';
import PartHeader from '../components/handbook/PartHeader';
import Dedication from '../components/handbook/content/Dedication';
import Foreword from '../components/handbook/content/Foreword';
import Chapter1 from '../components/handbook/content/Chapter1';
import Chapter2 from '../components/handbook/content/Chapter2';
import Chapter3 from '../components/handbook/content/Chapter3';
import Chapter4 from '../components/handbook/content/Chapter4';
import Chapter5 from '../components/handbook/content/Chapter5';
import Chapter6 from '../components/handbook/content/Chapter6';
import Chapter7 from '../components/handbook/content/Chapter7';
import Chapter8 from '../components/handbook/content/Chapter8';
import Chapter9 from '../components/handbook/content/Chapter9';
import Chapter10 from '../components/handbook/content/Chapter10';
import Chapter11 from '../components/handbook/content/Chapter11';
import Chapter12 from '../components/handbook/content/Chapter12';
import Chapter13 from '../components/handbook/content/Chapter13';
import Chapter14 from '../components/handbook/content/Chapter14';
import Chapter15 from '../components/handbook/content/Chapter15';
import Chapter16 from '../components/handbook/content/Chapter16';
import Chapter17 from '../components/handbook/content/Chapter17';
import Chapter18 from '../components/handbook/content/Chapter18';
import Chapter19 from '../components/handbook/content/Chapter19';
import Chapter20 from '../components/handbook/content/Chapter20';
import Chapter21 from '../components/handbook/content/Chapter21';
import Chapter22 from '../components/handbook/content/Chapter22';
import Chapter23 from '../components/handbook/content/Chapter23';
import Chapter24 from '../components/handbook/content/Chapter24';
import Chapter25 from '../components/handbook/content/Chapter25';
import Chapter26 from '../components/handbook/content/Chapter26';
import FinalChapter from '../components/handbook/content/FinalChapter';
import Volume2Intro from '../components/handbook/content/Volume2Intro';
import Chapter27 from '../components/handbook/content/Chapter27';
import Chapter28 from '../components/handbook/content/Chapter28';
import Chapter29 from '../components/handbook/content/Chapter29';
import Chapter30 from '../components/handbook/content/Chapter30';
import Chapter31 from '../components/handbook/content/Chapter31';
import Chapter32 from '../components/handbook/content/Chapter32';
import ReadingHeader from '../components/handbook/ReadingHeader';
import ReadingProgress from '../components/handbook/ReadingProgress';
import FloatingTOC from '../components/handbook/FloatingTOC';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Handbook: React.FC = () => {
  const { user, hasPurchased, loading, purchaseLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Track if we're still waiting for magic link tokens to be processed
  const [waitingForAuth, setWaitingForAuth] = useState(() => {
    // Check if URL has auth tokens (magic link redirect)
    const hash = window.location.hash;
    return hash.includes('access_token') || hash.includes('type=magiclink');
  });

  // Clear the waiting state once auth finishes loading
  useEffect(() => {
    if (!loading) {
      // Give a small delay to ensure tokens are processed
      const timer = setTimeout(() => {
        setWaitingForAuth(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    // Don't redirect while waiting for magic link auth to complete
    if (waitingForAuth) return;
    
    // If not loading and either not logged in or hasn't purchased, redirect
    if (!loading && !purchaseLoading) {
      if (!user) {
        navigate('/');
        return;
      }
      if (!hasPurchased) {
        navigate('/');
        return;
      }
    }
  }, [user, hasPurchased, loading, purchaseLoading, navigate, waitingForAuth]);

  // Show loading state (including when waiting for magic link)
  if (loading || purchaseLoading || waitingForAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin opacity-50" />
        <p className="mt-4 font-sans text-sm opacity-70">Loading your content...</p>
      </div>
    );
  }

  // If not authorized, show nothing (will redirect)
  if (!user || !hasPurchased) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <ReadingHeader />
      <ReadingProgress />
      
      <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24 pt-14">
        <HeroSection />
        
        <TableOfContents />
        
        {/* Front Matter */}
        <Dedication />
        <Foreword />
        
        {/* Part I */}
        <PartHeader number="I" title="The Frame" />
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
        
        {/* Part II */}
        <PartHeader number="II" title="The Stool (Systems)" />
        <Chapter4 />
        <Chapter5 />
        <Chapter6 />
        <Chapter7 />
        <Chapter8 />
        <Chapter9 />
        <Chapter10 />
        
        {/* Part III */}
        <PartHeader number="III" title="Time, Money, & Leverage" />
        <Chapter11 />
        <Chapter12 />
        <Chapter13 />
        <Chapter14 />
        <Chapter15 />
        <Chapter16 />
        <Chapter17 />
        <Chapter18 />
        
        {/* Part IV */}
        <PartHeader number="IV" title="Identity & Scale" />
        <Chapter19 />
        <Chapter20 />
        <Chapter21 />
        <Chapter22 />
        <Chapter23 />
        
        {/* Part V */}
        <PartHeader number="V" title="Real-Time Application" />
        <Chapter24 />
        <Chapter25 />
        <Chapter26 />
        
        {/* Part VI */}
        <PartHeader number="VI" title="Commitment" />
        <FinalChapter />

        {/* Part VII — Volume 2 */}
        <PartHeader number="VII" title="Volume 2 — The Operating System" />
        <Volume2Intro />
        <Chapter27 />
        <Chapter28 />
        <Chapter29 />
        <Chapter30 />
        <Chapter31 />
        <Chapter32 />
        
        {/* Footer */}
        <footer className="py-32 text-center border-t border-chapter-divider">
          <p className="text-sm uppercase tracking-widest opacity-40 font-sans" style={{ letterSpacing: '0.2em' }}>
            The ALP Handbook
          </p>
          <p className="text-sm opacity-30 mt-4 font-sans">
            © Marshall Wilkinson
          </p>
          <button 
            onClick={() => signOut()} 
            className="mt-6 text-sm font-sans opacity-50 hover:opacity-70 underline"
          >
            Sign Out
          </button>
        </footer>
      </div>
      
      <FloatingTOC />
    </div>
  );
};

export default Handbook;
