'use client';
import Reveal from '@/components/framer/Reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionTitle from '@/components/ui/section-title';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import contactImage from '@/public/images/contact.svg';

export default function Contact() {
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
          <Input type='text' className='px-4 py-5' placeholder='Your Name' />
          <br />
          <Input type='email' className='px-4 py-5' placeholder='Your Email' />
          <br />
          <Textarea
            placeholder='Your message here'
            className='h-44 max-h-48 min-h-44 px-4 py-4'
          ></Textarea>
          <br />
          <br />
          <Button className='w-full'>Send Message</Button>
        </Reveal>
      </div>
    </section>
  );
}
