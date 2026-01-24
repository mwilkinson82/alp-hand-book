import React from 'react';

const MountainIcon = () => (
  <svg
    viewBox="0 0 200 80"
    className="w-48 md:w-64 h-auto mb-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Main peak */}
    <path d="M100 10 L60 70 L140 70 Z" fill="currentColor" stroke="none" />
    {/* Left peak */}
    <path d="M50 30 L20 70 L80 70 Z" fill="currentColor" stroke="none" />
    {/* Right peak */}
    <path d="M150 30 L120 70 L180 70 Z" fill="currentColor" stroke="none" />
    {/* Snow caps - main */}
    <path d="M100 10 L85 35 L90 35 L80 50 L88 50 L95 38 L100 45 L105 38 L112 50 L120 50 L110 35 L115 35 Z" fill="hsl(var(--background))" stroke="none" />
    {/* Snow caps - left */}
    <path d="M50 30 L42 45 L47 45 L40 55 L48 55 L55 42 L58 55 L66 55 L60 45 L65 45 Z" fill="hsl(var(--background))" stroke="none" />
    {/* Snow caps - right */}
    <path d="M150 30 L142 45 L147 45 L140 55 L148 55 L155 42 L158 55 L166 55 L160 45 L165 45 Z" fill="hsl(var(--background))" stroke="none" />
  </svg>
);

const HeroSection: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8 py-32 bg-gradient-to-b from-background via-background to-background/95">
      {/* Mountain Logo */}
      <MountainIcon />
      
      {/* ALP Letters */}
      <div className="text-4xl md:text-5xl font-serif tracking-[0.5em] mb-6 font-bold">
        ALP
      </div>
      
      {/* Main Title */}
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-wide mb-4">
        THE ALP<br />HANDBOOK
      </h1>
      
      {/* Subtitle */}
      <div className="text-lg md:text-xl font-serif tracking-wider opacity-90 mb-8 uppercase">
        To Operating a Top-Tier<br />Contracting Company
      </div>
      
      {/* Decorative line */}
      <div className="w-32 h-px bg-foreground/30 mb-8" />
      
      {/* Tagline */}
      <p className="text-base md:text-lg font-light max-w-xl opacity-80 font-serif italic mb-12">
        An Entrepreneurial <span className="text-brand-accent not-italic font-medium">Operating System</span><br />
        for Contractors Who Want to Scale <span className="text-brand-accent not-italic font-medium">with</span> Control
      </p>
      
      {/* Author */}
      <div className="mt-8">
        <div className="text-xl md:text-2xl font-serif tracking-widest font-bold mb-2">
          MARSHALL WILKINSON
        </div>
        <div className="text-xs tracking-[0.3em] opacity-50 uppercase">
          ALP Entrepreneurial Framework
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="mt-24 animate-bounce opacity-30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
