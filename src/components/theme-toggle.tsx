import { useHydrated } from '@tanstack/react-router';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme';

// 44 px round icon button. Until hydration the label is neutral so the server
// HTML does not depend on the visitor's theme.
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const hydrated = useHydrated();
  const dark = hydrated && theme === 'dark';
  return (
    <Button
      variant='outline'
      size='icon'
      className={className}
      onClick={toggle}
      aria-label={
        hydrated
          ? `Switch to ${dark ? 'light' : 'dark'} mode`
          : 'Toggle color theme'
      }
    >
      <Sun className='hidden dark:block' aria-hidden='true' />
      <Moon className='block dark:hidden' aria-hidden='true' />
    </Button>
  );
}
