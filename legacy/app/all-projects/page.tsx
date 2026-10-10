import React from 'react';
import Projects from '../_components/projects';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function page() {
  return (
    <div className='mx-auto max-w-7xl'>
      <br />
      <div className='flex flex-row items-center justify-start gap-2'>
        <Button variant='ghost' asChild>
          <Link href='/' className='size-24'>
            <ArrowLeft />
          </Link>
        </Button>
        <p className='text-xl'>Back To Homepage</p>
      </div>
      <Projects />
    </div>
  );
}
