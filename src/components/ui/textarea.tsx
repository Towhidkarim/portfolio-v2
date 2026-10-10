import type * as React from 'react';
import { cn } from '@/lib/utils';
import { fieldClasses } from './input';

function Textarea({
  className,
  tone = 'default',
  ...props
}: React.ComponentProps<'textarea'> & { tone?: 'default' | 'panel' }) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'flex min-h-32 w-full rounded-control border px-4 py-3 text-[15px] font-medium outline-none transition-[border-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50',
        fieldClasses(tone),
        'aria-invalid:border-destructive aria-invalid:ring-destructive/25',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
