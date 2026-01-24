import React from 'react';
import HeroSection from '../components/handbook/HeroSection';
import TableOfContents from '../components/handbook/TableOfContents';
import PartHeader from '../components/handbook/PartHeader';
import Dedication from '../components/handbook/content/Dedication';
import Foreword from '../components/handbook/content/Foreword';
import Chapter1 from '../components/handbook/content/Chapter1';
import Chapter2 from '../components/handbook/content/Chapter2';
import Chapter3 from '../components/handbook/content/Chapter3';
import Chapter4 from '../components/handbook/content/Chapter4';
import Chapter8 from '../components/handbook/content/Chapter8';
import Chapter11 from '../components/handbook/content/Chapter11';
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
import FinalChapter from '../components/handbook/content/FinalChapter';
import PlaceholderChapter from '../components/handbook/content/PlaceholderChapter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
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
        <PlaceholderChapter id="chapter-5" number={5} title='Upstream Marketing & Being "In the Know"' />
        <PlaceholderChapter id="chapter-6" number={6} title="Sales, Pressure, and Clarity" />
        <PlaceholderChapter id="chapter-7" number={7} title="Operations as Margin Protection" />
        <Chapter8 />
        <PlaceholderChapter id="chapter-9" number={9} title="The ALP Decision Matrix" />
        <PlaceholderChapter id="chapter-10" number={10} title="From Chaos to Control" />
        
        {/* Part III */}
        <PartHeader number="III" title="Time, Money, & Leverage" />
        <Chapter11 />
        <PlaceholderChapter id="chapter-12" number={12} title="Notices & Playing Offense" />
        <PlaceholderChapter id="chapter-13" number={13} title="Scheduling as Time Control" />
        <PlaceholderChapter id="chapter-14" number={14} title="Start–Stop Work and Productivity Loss" />
        <PlaceholderChapter id="chapter-15" number={15} title="Financial Command: Seeing the Business Clearly" />
        <Chapter16 />
        <Chapter17 />
        
        {/* Part IV */}
        <PartHeader number="IV" title="Identity & Scale" />
        <Chapter18 />
        <Chapter19 />
        <Chapter20 />
        <Chapter21 />
        <Chapter22 />
        
        {/* Part V */}
        <PartHeader number="V" title="Real-Time Application" />
        <Chapter23 />
        <Chapter24 />
        <Chapter25 />
        
        {/* Part VI */}
        <PartHeader number="VI" title="Commitment" />
        <FinalChapter />
        
        {/* Footer */}
        <footer className="py-32 text-center border-t border-chapter-divider">
          <p className="text-sm uppercase tracking-widest opacity-40 font-sans" style={{ letterSpacing: '0.2em' }}>
            The ALP Handbook
          </p>
          <p className="text-sm opacity-30 mt-4 font-sans">
            © Marshall Wilkinson
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
