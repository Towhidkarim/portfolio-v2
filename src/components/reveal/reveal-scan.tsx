import { useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';

declare global {
  interface Window {
    __revealScan?: () => void;
  }
}

// Re-runs the observer scan after every client navigation so newly mounted
// [data-reveal] elements are picked up. Already revealed elements keep data-in
// and never replay. Render once in the root layout.
export function RevealScan() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // biome-ignore lint/correctness/useExhaustiveDependencies: rescan on every path change
  useEffect(() => {
    window.__revealScan?.();
  }, [pathname]);
  return null;
}
