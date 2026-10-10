import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='mx-auto px-4 py-16 text-center container'>
      <h1 className='mb-4 font-bold text-4xl'>Project Not Found</h1>
      <p className='mb-8 text-muted-foreground'>
        The project you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href='/'>Return Home</Link>
      </Button>
    </div>
  );
}
