import React from 'react';
import MenuList from './_components/menu-list';
import { Tabs } from '@/components/ui/tabs';
import MenuContents from './_components/menu-contents';
import { FolderKanban, FolderPlus, House, MailOpen } from 'lucide-react';
import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { routes } from '@/lib/constants';
import AddProject from './_components/tabs/AddProject';
import { ScrollArea } from '@/components/ui/scroll-area';
import ViewProjects from './_components/tabs/ViewProjects';

export type TListProps = {
  icon?: React.ReactNode;
  value: string;
  title: string;
  component: React.ReactNode;
}[];
const tabList: TListProps = [
  { icon: <House />, title: 'Home', value: 'home', component: '' },
  { icon: <MailOpen />, title: 'Inbox', value: 'inbox', component: '' },
  {
    icon: <FolderKanban />,
    title: 'Projects',
    value: 'projects',
    component: <ViewProjects />,
  },
  {
    icon: <FolderPlus />,
    title: 'Add Project',
    value: 'addProject',
    component: <AddProject />,
  },
];

export default async function Home() {
  const { session, user } = await validateRequest();
  if (!session) redirect(routes.login);

  return (
    <main className='flex h-svh w-svw'>
      <Tabs defaultValue={tabList[0].value} className='flex w-4/5'>
        <section className='flex h-svh w-1/5 flex-col border-r border-gray-200 px-4 pb-5 pt-4'>
          <h1 className='mb-5 text-3xl font-extrabold'>Logo Here</h1>
          <div className='pb-[30%]' />
          <ScrollArea>
            <MenuList listItems={tabList} className='' />
          </ScrollArea>
          <div className='mt-auto'>Bottom</div>
        </section>
        <section className='h-svh w-4/5 px-4 pt-4'>
          <div className='h-16'>
            <h1 className='mb-2 text-3xl font-bold'>{user.username}</h1>
            <h4 className='font-semibold capitalize text-muted-foreground'>
              {user.role}
            </h4>
          </div>
          <ScrollArea className='h-[calc(100%-4rem)]'>
            <MenuContents listItems={tabList} />
          </ScrollArea>
        </section>
      </Tabs>
      <section className='h-full w-1/5'>Side Menu</section>
    </main>
  );
}
