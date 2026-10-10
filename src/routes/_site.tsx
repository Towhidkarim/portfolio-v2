import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteNav } from '@/components/site/site-nav';

// Public pages share the nav and footer. Admin, login and the styleguide stay outside.
export const Route = createFileRoute('/_site')({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <>
      <SiteNav />
      <main id='main'>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
