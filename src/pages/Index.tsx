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
import ReadingHeader from '../components/handbook/ReadingHeader';
import ReadingProgress from '../components/handbook/ReadingProgress';
import FloatingTOC from '../components/handbook/FloatingTOC';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ReadingHeader />
      <ReadingProgress />
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-14">
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
      
      <FloatingTOC />
    </div>
  );
};

export default Index;
