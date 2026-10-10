import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Home });

// Placeholder until Phase 4 builds the real landing page.
function Home() {
  return (
    <main id='main' className='container py-24'>
      <h1 className='text-[40px] font-extrabold tracking-[-0.03em]'>
        Migration in progress
      </h1>
    </main>
  );
}
