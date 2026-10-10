import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type * as React from 'react';
import { cn } from '@/lib/utils';

// Design: 48 px high, radius 12, 15/600. default = primary (ink), outline =
// secondary (bordered), brand = on the always-dark panel.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-[9px] whitespace-nowrap rounded-control text-[15px] font-semibold transition-[translate,transform,box-shadow,border-color,background-color,color] duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-0.5 [&_svg:not([class*='size-'])]:size-[19px] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-foreground text-background shadow-[0_10px_24px_-14px_var(--ink)]',
        outline:
          'border border-line bg-card text-foreground hover:border-brand',
        brand: 'bg-[#34D3A6] text-[#06241C]',
        secondary: 'bg-pill text-pill-ink hover:bg-line',
        ghost: 'text-foreground hover:bg-surface',
        destructive: 'bg-[#B91C1C] text-white hover:bg-[#991B1B]',
        link: 'h-auto px-0 text-brand-ink underline-offset-4 hover:underline motion-safe:hover:translate-y-0',
      },
      size: {
        default: 'h-12 px-[22px]',
        sm: 'h-10 px-4 text-sm',
        lg: 'h-[52px] px-6',
        // 44 px round icon button (design `.ib`)
        icon: 'size-11 rounded-full border border-line bg-card p-0 text-foreground hover:border-brand',
        'icon-sm': 'size-9 rounded-full p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  type,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      // real buttons never submit a form by accident
      type={asChild ? undefined : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
