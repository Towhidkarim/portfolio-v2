import { ArrowUp } from 'lucide-react';
import { footer } from '@/content/site';

export function SiteFooter() {
  return (
    <footer className='border-t border-[#1D2733] bg-panel text-[13.5px] text-[#A5B1C0]'>
      <div className='container flex min-h-[84px] flex-col items-center justify-between gap-2 py-6 text-center sm:flex-row sm:py-0 sm:text-left'>
        <p>{footer.copyright}</p>
        <p>{footer.middle}</p>
        <button
          type='button'
          className='inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-medium text-[#F2F5F9] hover:text-[#34D3A6]'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {footer.top}
          <ArrowUp aria-hidden='true' className='size-4' />
        </button>
      </div>
    </footer>
  );
}
