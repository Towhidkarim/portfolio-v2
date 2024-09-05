'use client';
import Reveal from '@/components/framer/Reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionTitle from '@/components/ui/section-title';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import contactImage from '@/public/images/contact.svg';
import { useRef, useState } from 'react';
import SendMailAction from '@/lib/global-actions/SendMail';
import { toast } from 'sonner';

export default function Contact() {
  // const [mail, setMail] = useState('');
  // const [name, setName] = useState('');
  // const [message, setMessage] = useState('');

  const mail = useRef('');
  const name = useRef('');
  const message = useRef('');
  const [isLoading, setIsLoading] = useState(false);

  const formOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await SendMailAction({
      senderEmail: mail.current,
      senderName: name.current,
      message: message.current,
      id: '',
    });
    setIsLoading(false);
    if (res.ok)
      toast('Succes!', {
        description: res.message,
        action: { label: 'Close', onClick: () => {} },
      });
    else
      toast('Error', {
        description: res.message,
        action: { label: 'Close', onClick: () => {} },
      });
  };

  return (
    <section id='contact' className='my-32'>
      <SectionTitle>Contact</SectionTitle>
      <br />
      <div className='flex flex-col items-center justify-center gap-16 lg:flex-row'>
        <div className='mx-auto flex w-10/12 flex-col items-center justify-center text-center md:items-start lg:w-2/5 lg:text-left'>
          <Reveal disableReveal>
            <Image src={contactImage} alt='' />
          </Reveal>
          <Reveal className='my-5 w-full'>
            <h1 className='text-4xl font-bold'>Get in Touch</h1>
          </Reveal>
          <Reveal className='w-full' delay={0.25}>
            <h2 className='text-lg'>
              Send me a message, give me feedbacks or whatever you may like
            </h2>
          </Reveal>
        </div>
        <Reveal
          disableReveal
          delay={0.4}
          className='mx-auto w-10/12 p-1 lg:w-2/5'
        >
          <form onSubmit={formOnSubmit}>
            <Input
              onChange={(e) => (name.current = e.target.value.toString())}
              type='text'
              className='px-4 py-5'
              placeholder='Your Name'
              required
            />
            <br />
            <Input
              onChange={(e) => (mail.current = e.target.value.toString())}
              type='email'
              className='px-4 py-5'
              placeholder='Your Email'
              required
            />
            <br />
            <Textarea
              onChange={(e) => (message.current = e.target.value.toString())}
              placeholder='Your message here'
              className='h-44 max-h-48 min-h-44 px-4 py-4'
              required
            ></Textarea>
            <br />
            <br />
            <Button disabled={isLoading} className='w-full'>
              Send Message
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
