import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import React from 'react';
import { TListProps } from '../page';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MenuList({
  listItems,
  className,
}: {
  listItems: TListProps;
  className?: string;
}) {
  return (
    <TabsList className={cn('flex w-full flex-col gap-2', className)}>
      {listItems.map((item, index) => (
        <TabsTrigger
          className='flex items-center justify-start gap-4 whitespace-nowrap rounded-md py-3 pl-5 text-lg font-semibold capitalize text-muted-foreground opacity-85 transition-all hover:bg-primary/5 focus-visible:scale-50 data-[state=active]:text-primary data-[state=active]:opacity-100'
          key={index}
          value={item.value}
        >
          <span>{item.icon}</span>
          <span className='hidden md:block'>{item.title}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
