import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import FetchMailsAction from '@/lib/global-actions/FetchMails';
import { Mail, Calendar, User, MessageSquare } from 'lucide-react';

export default async function Inbox() {
  const MAX_PER_PAGE = 20;
  const mails = await FetchMailsAction(MAX_PER_PAGE, 0);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);

      if (diffSecs < 60) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffWeeks < 4) return `${diffWeeks}w ago`;
      if (diffMonths < 12) return `${diffMonths}mo ago`;

      const years = Math.floor(diffMonths / 12);
      return `${years}y ago`;
    } catch {
      return dateString;
    }
  };

  return (
    <section className='w-full'>
      <h1 className='mt-4 text-2xl font-bold'>Inbox</h1>
      <p className='mb-6 text-sm text-muted-foreground'>
        {mails?.length || 0} message{mails?.length !== 1 ? 's' : ''}
      </p>

      {!mails || mails.length === 0 ? (
        <Card className='border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Mail className='mb-4 size-12 text-muted-foreground opacity-50' />
            <p className='text-muted-foreground'>No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4 px-3'>
          {mails.map((mail) => (
            <Dialog key={mail.id}>
              <DialogTrigger asChild>
                <Card className='cursor-pointer transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-primary'>
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <CardTitle className='line-clamp-1 text-lg'>
                          {mail.senderName}
                        </CardTitle>
                        <CardDescription className='line-clamp-1 text-xs'>
                          {mail.senderEmail}
                        </CardDescription>
                      </div>
                      <Badge variant='outline' className='ml-2 shrink-0'>
                        <Calendar className='mr-1 size-3' />
                        {formatDate(mail.sentAt)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='line-clamp-2 text-sm text-muted-foreground'>
                      {mail.message}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className='max-w-2xl'>
                <ScrollArea className='h-[70vh]'>
                  <div className='space-y-4 px-4'>
                    <DialogHeader>
                      <DialogTitle className='text-2xl'>
                        New Message
                      </DialogTitle>
                      <DialogDescription>
                        Full message details
                      </DialogDescription>
                    </DialogHeader>

                    <div className='space-y-4 py-4'>
                      <div className='rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4'>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2'>
                            <User className='size-4 text-primary' />
                            <span className='text-sm font-semibold text-muted-foreground'>
                              From
                            </span>
                          </div>
                          <p className='text-lg font-bold'>{mail.senderName}</p>
                          <a
                            href={`mailto:${mail.senderEmail}`}
                            className='text-sm text-blue-600 hover:underline dark:text-blue-400'
                          >
                            {mail.senderEmail}
                          </a>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Calendar className='size-4 text-muted-foreground' />
                        <span className='text-sm font-semibold text-muted-foreground'>
                          Received
                        </span>
                        <span className='text-sm'>
                          {new Date(mail.sentAt).toLocaleString()}
                        </span>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <MessageSquare className='size-4 text-primary' />
                          <span className='text-sm font-semibold text-muted-foreground'>
                            Message
                          </span>
                        </div>
                        <div className='rounded-lg border border-border bg-muted/50 p-4'>
                          <p className='whitespace-pre-wrap text-sm leading-relaxed'>
                            {mail.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <DialogFooter>
                  <Button asChild variant='outline' className='w-full'>
                    <a href={`mailto:${mail.senderEmail}`}>Reply via Email</a>
                  </Button>
                  <DialogClose asChild>
                    <Button className='w-full' variant='secondary'>
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </section>
  );
}
