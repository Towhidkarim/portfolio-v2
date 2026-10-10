import type * as React from 'react';
import { cn } from '@/lib/utils';

// `panel` is for the always-dark surfaces (contact band): dark field colours
// with a brand-green focus ring.
export const fieldClasses = (tone: 'default' | 'panel') =>
  tone === 'panel'
    ? 'border-[#2A3644] bg-[#0B1118] text-[#F2F5F9] placeholder:text-[#8392A5] focus-visible:border-[#34D3A6] focus-visible:ring-[3px] focus-visible:ring-[#34D3A6]/25'
    : 'border-line bg-card text-foreground placeholder:text-ink3 focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/25';

function Input({
  className,
  type,
  tone = 'default',
  ...props
}: React.ComponentProps<'input'> & { tone?: 'default' | 'panel' }) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'h-12 w-full min-w-0 rounded-control border px-4 text-[15px] font-medium outline-none transition-[border-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50',
        fieldClasses(tone),
        'aria-invalid:border-destructive aria-invalid:ring-destructive/25',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
