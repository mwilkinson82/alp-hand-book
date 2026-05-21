import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import bookCover from '@/assets/book-cover-v2.png';
import PartHeader from '@/components/handbook/PartHeader';
import Dedication from '@/components/handbook/content/Dedication';
import Foreword from '@/components/handbook/content/Foreword';
import HowToUse from '@/components/handbook/content/HowToUse';
import Chapter2 from '@/components/handbook/content/Chapter2';
import Chapter3 from '@/components/handbook/content/Chapter3';
import Chapter27 from '@/components/handbook/content/Chapter27';
import Chapter19 from '@/components/handbook/content/Chapter19';
import Chapter23 from '@/components/handbook/content/Chapter23';
import PreviewHeader from '@/components/handbook/PreviewHeader';
import ReadingProgress from '@/components/handbook/ReadingProgress';
import PreviewTableOfContents from '@/components/handbook/PreviewTableOfContents';
import PreviewFloatingTOC from '@/components/handbook/PreviewFloatingTOC';
import StickyPurchaseButton from '@/components/handbook/StickyPurchaseButton';
import { Lock } from 'lucide-react';

const SalesLanding: React.FC = () => {
  const { user, hasPurchased, loading } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  // If user has purchased, redirect to the full book
  if (!loading && user && hasPurchased) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <h1 className="chapter-heading text-3xl md:text-4xl mb-6">You Own This Book</h1>
        <p className="body-text mb-8 opacity-70">Thank you for your purchase. Enjoy the full reading experience.</p>
        <Link to="/read">
          <Button className="font-sans uppercase tracking-widest">
            Read the Handbook
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PreviewHeader />
      <ReadingProgress />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 pt-20">
        {/* Hero Section */}
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-16">
          <img 
            src={bookCover} 
            alt="The ALP Handbook - To Operating a Top-Tier Contracting Company by Marshall Wilkinson" 
            className="max-w-xs md:max-w-sm lg:max-w-md w-full h-auto shadow-2xl rounded-sm mb-12"
          />
          
          <h1 className="handbook-title text-4xl md:text-5xl lg:text-6xl mb-6 text-center">
            The ALP Handbook
          </h1>
          
          <p className="body-text text-lg md:text-xl max-w-2xl mb-4 opacity-80 text-center mx-auto">
            A control doctrine for entrepreneurs who refuse to lose grip on what they've built.
          </p>
          
          <p className="font-sans text-sm uppercase tracking-widest opacity-50 mb-4 text-center">
            By Marshall Wilkinson
          </p>
          
          <p className="body-text text-sm opacity-60 mb-8 italic max-w-xl mx-auto text-center">
            An interactive web reading experience — not a PDF, not a physical book. Read in your browser, with audio commentary and chapter navigation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              onClick={handlePurchase}
              disabled={checkoutLoading || loading}
              size="lg"
              className="font-sans uppercase tracking-widest"
            >
              {checkoutLoading ? 'Loading...' : 'Purchase Now — $47'}
            </Button>
            
            <a href="#toc" className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity">
              ↓ Explore the Table of Contents
            </a>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="py-24 border-t border-chapter-divider">
          <div className="max-w-3xl">
            <h2 className="section-heading text-2xl md:text-3xl mb-8">What You'll Learn</h2>
            <div className="body-text space-y-4">
              <p>This handbook exists to help you:</p>
              <ul className="list-doctrine">
                <li>See clearly when things feel chaotic</li>
                <li>Decide correctly when pressure rises</li>
                <li>Enforce standards without apology</li>
                <li>Scale without losing yourself or the business</li>
              </ul>
              <p className="body-text-emphasis pt-4">
                This is not a handbook about business. It is a handbook about command.
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div id="toc" className="border-t border-chapter-divider">
          <PreviewTableOfContents />
        </div>

        {/* Preview Section Intro */}
        <div id="preview" className="py-16 border-t border-chapter-divider">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest opacity-50 mb-4 font-sans" style={{ letterSpacing: '0.2em' }}>
              Free Preview
            </p>
            <h2 className="chapter-heading text-3xl md:text-4xl">Experience the Handbook</h2>
            <p className="body-text mt-4 opacity-70 max-w-2xl mx-auto">
              Read selected chapters from across the handbook. Try the floating navigation and audio chapters to experience the full virtual reading experience.
            </p>
          </div>
        </div>

        {/* Preview Chapters */}
        <Dedication />
        <Foreword />
        <HowToUse />
        
        <PartHeader number="I" title="The Frame" />
        <Chapter2 />
        <Chapter3 />

        <PartHeader number="II" title="The Operating System" eyebrow="Volume 2 — New" />
        <Chapter27 />

        <PartHeader number="IV" title="Time, Money, and Commercial Control" />
        <Chapter19 />

        <PartHeader number="V" title="Identity, Leadership, and Scale" />
        <Chapter23 />

        {/* Purchase CTA */}
        <div className="py-32 text-center border-t border-chapter-divider">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-8">
            <Lock className="w-6 h-6 opacity-50" />
          </div>
          
          <h2 className="chapter-heading text-3xl md:text-4xl mb-6">
            Unlock the Complete Handbook
          </h2>
          
          <p className="body-text max-w-2xl mx-auto mb-8 opacity-70">
            You've experienced a sample of what's inside. The full handbook contains 26 chapters plus a final commitment chapter — 
            a complete operating doctrine for building and maintaining command of your business.
          </p>

          <Button 
            onClick={handlePurchase}
            disabled={checkoutLoading || loading}
            size="lg"
            className="font-sans uppercase tracking-widest text-sm sm:text-base w-full sm:w-auto"
          >
            {checkoutLoading ? 'Loading...' : 'Purchase Full Handbook — $47'}
          </Button>

          {!user && (
            <p className="mt-4 text-sm opacity-50 font-sans">
              Already purchased?{' '}
              <Link to="/auth" className="underline hover:opacity-70">
                Sign in to access
              </Link>
            </p>
          )}
        </div>

        {/* Footer */}
        <footer className="py-16 text-center border-t border-chapter-divider">
          <p className="text-sm uppercase tracking-widest opacity-40 font-sans" style={{ letterSpacing: '0.2em' }}>
            The ALP Handbook
          </p>
          <p className="text-sm opacity-30 mt-4 font-sans">
            © Marshall Wilkinson
          </p>
        </footer>
      </div>

      <PreviewFloatingTOC />
      <StickyPurchaseButton />
    </div>
  );
};

export default SalesLanding;
