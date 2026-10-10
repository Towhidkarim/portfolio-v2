import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <main>
      <h1>Migration in progress</h1>
    </main>
  );
}
