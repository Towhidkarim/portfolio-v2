import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import React from 'react';

export default function ScrollToTop() {
  // useEffect( () => {

  // }, [])

  return (
    <Button
      variant='default'
      className={cn(
        'fixed bottom-5 right-5 z-50 block rounded-full border-primary-foreground p-2',
      )}
    >
      <ArrowUp />
    </Button>
  );
}
