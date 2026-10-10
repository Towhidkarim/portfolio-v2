import { Link, useLocation } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { GITHUB_URL, nav } from '@/content/site';
import { cn } from '@/lib/utils';
import { GithubIcon } from './brand-icons';

type Id = (typeof nav.links)[number]['id'];

// Home links are in-page anchors; on other pages they lead back to the home sections.
function NavAnchor({
  id,
  home,
  className,
  onClick,
  children,
  ...rest
}: {
  id: Id;
  home: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
} & Record<string, unknown>) {
  if (home) {
    return (
      <a href={`#${id}`} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link
      to='/'
      hash={id === 'home' ? undefined : id}
      className={className}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Link>
  );
}

const linkClass = (on: boolean) =>
  cn(
    'inline-flex h-[42px] items-center rounded-full px-4 text-[14.5px] font-medium text-ink2 transition-[background-color,color] duration-200 hover:bg-surface hover:text-foreground',
    on && 'bg-brand-soft font-semibold text-brand-ink hover:bg-brand-soft',
  );

export function SiteNav() {
  const { pathname } = useLocation();
  const home = pathname === '/';
  const [active, setActive] = useState<Id>('home');
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  // scroll-spy: the section crossing a band near the top of the viewport is active
  useEffect(() => {
    if (!home) return;
    const sections = nav.links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as Id);
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, [home]);

  // 3 px progress bar: one rAF-throttled scroll listener, no re-render
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden='true'
        className='pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]'
      >
        <div
          ref={bar}
          className='h-full origin-left bg-brand'
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      <header className='sticky top-4 z-50 mt-5'>
        <div className='container'>
          <div className='flex h-16 items-center justify-between rounded-full border border-line bg-nav px-4 backdrop-blur-md md:px-5'>
            <Link
              to='/'
              aria-label='Towhid Karim, home'
              className='rounded-full px-2 text-xl font-extrabold tracking-[-0.03em]'
            >
              &lt;{nav.logo[0]}/{nav.logo[1]}&gt;
            </Link>

            <nav
              aria-label='Primary'
              className='hidden items-center gap-1 md:flex'
            >
              {nav.links.map((l) => {
                const on = home && active === l.id;
                return (
                  <NavAnchor
                    key={l.id}
                    id={l.id}
                    home={home}
                    className={linkClass(on)}
                    aria-current={on ? 'true' : undefined}
                  >
                    {l.label}
                  </NavAnchor>
                );
              })}
            </nav>

            <div className='flex items-center gap-2'>
              <Button
                asChild
                variant='outline'
                size='icon'
                className='hidden md:inline-flex'
              >
                <a
                  href={GITHUB_URL}
                  aria-label='GitHub profile'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <GithubIcon />
                </a>
              </Button>
              <ThemeToggle />
              <Button asChild className='hidden rounded-full md:inline-flex'>
                <NavAnchor id='contact' home={home}>
                  {nav.cta}
                </NavAnchor>
              </Button>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='md:hidden'
                    aria-label='Open menu'
                  >
                    <Menu aria-hidden='true' />
                  </Button>
                </SheetTrigger>
                <SheetContent side='right' className='w-[min(320px,100%)]'>
                  <SheetTitle className='sr-only'>Menu</SheetTitle>
                  <SheetDescription className='sr-only'>
                    Site sections
                  </SheetDescription>
                  <nav
                    aria-label='Mobile'
                    className='mt-12 flex flex-col gap-1 p-4'
                  >
                    {nav.links.map((l) => (
                      <NavAnchor
                        key={l.id}
                        id={l.id}
                        home={home}
                        onClick={() => setOpen(false)}
                        className={cn(
                          linkClass(home && active === l.id),
                          'h-12 text-base',
                        )}
                      >
                        {l.label}
                      </NavAnchor>
                    ))}
                    <Button asChild className='mt-4 h-[52px] rounded-full'>
                      <NavAnchor
                        id='contact'
                        home={home}
                        onClick={() => setOpen(false)}
                      >
                        {nav.cta}
                      </NavAnchor>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
