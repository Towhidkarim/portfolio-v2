import { useSyncExternalStore } from 'react';

// Runs inline in <head>, before first paint, so a dark-mode visitor never sees a
// light flash. The server HTML is identical for everyone: the theme is applied
// only by this script (class on <html>), never rendered by the server.
export const themeInit = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})();`;

export type Theme = 'light' | 'dark';

const root = () => document.documentElement;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ['class'] });
  // follow the OS setting until the visitor picks a theme themselves
  const media = matchMedia('(prefers-color-scheme: dark)');
  const onMedia = () => {
    try {
      if (!localStorage.getItem('theme')) {
        root().classList.toggle('dark', media.matches);
      }
    } catch {}
  };
  media.addEventListener('change', onMedia);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', onMedia);
  };
}

const getSnapshot = (): Theme =>
  root().classList.contains('dark') ? 'dark' : 'light';
const getServerSnapshot = (): Theme => 'light';

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setTheme = (next: Theme) => {
    root().classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };
  return {
    theme,
    setTheme,
    toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  };
}
