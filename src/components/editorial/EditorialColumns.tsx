import React from 'react';
import { cn } from '@/lib/utils';

interface EditorialColumnsProps {
  columns?: 2 | 3;
  children: React.ReactNode;
  className?: string;
}

/**
 * Justified multi-column body block — the portal "Boring wins." treatment.
 * Falls back to a single column on mobile.
 */
const EditorialColumns: React.FC<EditorialColumnsProps> = ({
  columns = 3,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'editorial-columns',
        columns === 2 ? 'editorial-columns--2' : 'editorial-columns--3',
        className
      )}
    >
      {children}
    </div>
  );
};

export default EditorialColumns;
