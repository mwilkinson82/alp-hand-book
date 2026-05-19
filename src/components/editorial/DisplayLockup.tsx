import React from 'react';
import { cn } from '@/lib/utils';
import Eyebrow from './Eyebrow';

interface DisplayLockupProps {
  eyebrow?: React.ReactNode;
  eyebrowAccent?: boolean;
  title: React.ReactNode;
  tagline?: React.ReactNode;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Cover-grade title lockup: eyebrow → Instrument Serif display title → hairline rule → italic tagline.
 * Matches the structure of the V2 cover and the AOS portal "Welcome aboard." block.
 */
const DisplayLockup: React.FC<DisplayLockupProps> = ({
  eyebrow,
  eyebrowAccent = false,
  title,
  tagline,
  align = 'left',
  size = 'md',
  className,
  children,
}) => {
  const sizeClasses = {
    sm: 'text-3xl md:text-4xl lg:text-5xl',
    md: 'text-4xl md:text-6xl lg:text-7xl',
    lg: 'text-5xl md:text-7xl lg:text-8xl',
  };

  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <div className={cn('mb-8', align === 'center' && 'flex justify-center')}>
          <Eyebrow accent={eyebrowAccent}>{eyebrow}</Eyebrow>
        </div>
      )}

      <h1
        className={cn(
          sizeClasses[size],
          'leading-[0.92] font-serif'
        )}
        style={{
          fontWeight: 700,
          letterSpacing: '-0.03em',
          fontVariationSettings: '"opsz" 144, "SOFT" 50',
        }}
      >
        {title}
      </h1>

      {tagline && (
        <>
          <div
            className={cn(
              'h-px bg-foreground/30 my-8',
              align === 'center' ? 'w-16 mx-auto' : 'w-12'
            )}
          />
          <div className="editorial-tagline text-xl md:text-2xl lg:text-3xl text-foreground/85 leading-snug max-w-2xl">
            {tagline}
          </div>
        </>
      )}

      {children}
    </div>
  );
};

export default DisplayLockup;
