import { TabsContent } from '@radix-ui/react-tabs';
import React from 'react';
import { TListProps } from '../page';
import FadeEffect from '@/components/framer/FadeEffect';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MenuContents({ listItems }: { listItems: TListProps }) {
  return (
    <>
      {listItems.map((items, index) => (
        <TabsContent className='w-full' value={items.value} key={index}>
          <FadeEffect className='w-full'>
            {items.component ? items.component : items.title}
          </FadeEffect>
        </TabsContent>
      ))}
    </>
  );
}
