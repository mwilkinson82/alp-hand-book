import React from 'react';
import { cn } from '@/lib/utils';

type PillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'ghost';
  asChild?: boolean;
};

/**
 * Long-radius black pill CTA matching the AOS portal "ENTER THE PORTAL" button.
 * Use as the canonical primary CTA across the marketing surfaces.
 */
const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ children, className, variant = 'solid', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('pill-cta', variant === 'ghost' && 'pill-cta--ghost', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PillButton.displayName = 'PillButton';

export default PillButton;
