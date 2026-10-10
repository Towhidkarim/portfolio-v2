import { Label as LabelPrimitive } from 'radix-ui';
import type * as React from 'react';
import { cn } from '@/lib/utils';

// 13/500, sits above the field. `panel` is the muted colour used on the dark band.
function Label({
  className,
  tone = 'default',
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  tone?: 'default' | 'panel';
}) {
  return (
    <LabelPrimitive.Root
      data-slot='label'
      className={cn(
        'mb-2 block select-none text-[13px] font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        tone === 'panel' ? 'text-[#A5B1C0]' : 'text-ink2',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
