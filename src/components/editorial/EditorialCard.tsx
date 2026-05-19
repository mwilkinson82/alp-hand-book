import React from 'react';
import { cn } from '@/lib/utils';

interface EditorialCardProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

/**
 * Cream card with soft drop shadow + optional tracked uppercase footer band.
 * Matches the AOS portal sign-in card (rounded-2xl, "MEMBERS ONLY" footer).
 */
const EditorialCard: React.FC<EditorialCardProps> = ({
  children,
  footer,
  className,
  innerClassName,
}) => {
  return (
    <div className={cn('editorial-card', className)}>
      <div className={cn('px-8 md:px-12 py-10 md:py-12', innerClassName)}>{children}</div>
      {footer && <div className="editorial-card__footer">{footer}</div>}
    </div>
  );
};

export default EditorialCard;
