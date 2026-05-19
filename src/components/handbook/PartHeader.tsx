import React from 'react';

interface PartHeaderProps {
  number: string;
  title: string;
  eyebrow?: string;
}

const PartHeader: React.FC<PartHeaderProps> = ({ number, title, eyebrow }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center py-32">
      <div className="text-sm uppercase tracking-widest opacity-50 mb-6 font-sans" style={{ letterSpacing: '0.25em' }}>
        Part {number}
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight font-serif">
        {title}
      </h1>
      {eyebrow && (
        <div className="mt-6">
          <span className="text-[11px] uppercase tracking-widest px-3 py-1 rounded-sm bg-brand-accent/15 text-brand-accent font-sans" style={{ letterSpacing: '0.25em' }}>
            {eyebrow}
          </span>
        </div>
      )}
      <div className="part-divider mt-16" />
    </div>
  );
};

export default PartHeader;
