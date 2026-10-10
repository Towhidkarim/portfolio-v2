import type * as React from 'react';
import { cn } from '@/lib/utils';

// Design `.sk`: --pill fill. Pulse is disabled under prefers-reduced-motion.
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      aria-hidden='true'
      className={cn('rounded-md bg-pill motion-safe:animate-pulse', className)}
      {...props}
    />
  );
}

export { Skeleton };
