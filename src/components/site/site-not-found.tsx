import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

// Child routes use this: a layout's own notFoundComponent would replace the nav too.
export function SiteNotFound() {
  return (
    <div className='container flex min-h-[60vh] flex-col items-start justify-center gap-4 py-24'>
      <p className='font-mono text-xs uppercase tracking-[0.14em] text-brand-ink'>
        404
      </p>
      <h1 className='text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em]'>
        Page not found
      </h1>
      <p className='max-w-[520px] text-[17px] leading-[1.65] text-ink2'>
        That page does not exist or has moved.
      </p>
      <Button asChild className='mt-2'>
        <Link to='/'>Back to home</Link>
      </Button>
    </div>
  );
}
