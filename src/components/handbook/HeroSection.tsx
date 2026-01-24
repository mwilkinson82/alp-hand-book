import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8 py-32">
      <div className="handbook-subtitle mb-8 opacity-60">
        A Doctrine for Entrepreneurs
      </div>
      <h1 className="handbook-title mb-12">
        The ALP<br />Handbook
      </h1>
      <div className="w-16 h-px bg-foreground/20 mb-12" />
      <p className="text-lg md:text-xl font-light max-w-xl opacity-70 font-sans">
        Altitude. Logic. Pressure.
      </p>
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
