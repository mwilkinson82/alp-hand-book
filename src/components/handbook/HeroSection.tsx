import React from 'react';
import bookCover from '@/assets/book-cover-v2.png';
import ExpandableImage from './ExpandableImage';
import Eyebrow from '@/components/editorial/Eyebrow';

const HeroSection: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8 py-16">
      <Eyebrow className="mb-10">ALP Contractor Circle</Eyebrow>

      <ExpandableImage
        src={bookCover}
        alt="The ALP Handbook — A field manual for running a contracting company. By Marshall Wilkinson."
        className="max-w-sm md:max-w-md lg:max-w-lg w-full h-auto shadow-2xl rounded-sm"
      />

      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="w-12 h-px bg-foreground/30" />
        <Eyebrow accent>AOS Edition — Second Edition</Eyebrow>
      </div>

      {/* Scroll indicator */}
      <div className="mt-16 animate-bounce opacity-30">
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
