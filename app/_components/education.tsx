import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, GraduationCap, Award } from 'lucide-react';
import Reveal from '@/components/framer/Reveal';
import SectionTitle from '@/components/ui/section-title';

export function Education() {
  const courses = [
    'Data Structures & Algorithms',
    'Object-Oriented Programming',
    'Database Management Systems',
    'Software Engineering',
    'Computer Networks',
    'Web Development',
    'Machine Learning',
    'Operating Systems',
  ];
  return (
    <section className='mx-auto w-full max-w-4xl'>
      <Reveal delay={0.2} className='mx-auto'>
        <div className='mb-12 text-center'>
          <SectionTitle>
            <span className='font-bold tracking-tight'>Education</span>
          </SectionTitle>
          <p className='text-lg text-muted-foreground'>
            My academic journey and achievements
          </p>
          <hr className='mx-auto my-2 h-2 w-28 rounded-full bg-primary' />
        </div>
      </Reveal>

      <Card className='relative overflow-hidden'>
        <div className='absolute left-0 top-0 h-full w-1 bg-primary'></div>
        <CardHeader className='pb-4'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-primary/10 p-2'>
                <GraduationCap className='h-6 w-6 text-primary' />
              </div>
              <div>
                <Reveal delay={0.3}>
                  <CardTitle className='text-xl'>
                    Bachelor of Science in Computer Science & Engineering
                  </CardTitle>
                  <CardDescription className='text-base font-medium text-foreground/80'>
                    Varendra University
                  </CardDescription>
                </Reveal>
              </div>
            </div>
            <Reveal delay={0.3}>
              <Badge variant='secondary' className='ml-4'>
                Current
              </Badge>
            </Reveal>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          <Reveal delay={0.4}>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='flex items-center gap-3'>
                <CalendarDays className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Duration</p>
                  <p className='text-sm text-muted-foreground'>
                    2022 - Present
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Award className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>CGPA</p>
                  <p className='text-sm text-muted-foreground'>3.99 / 4.00</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.5}>
            <div className='border-t pt-4'>
              <h4 className='mb-3 font-semibold'>Key Highlights</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li className='flex items-start gap-2'>
                  <div className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary'></div>
                  <span>
                    Maintaining exceptional academic performance with 3.99 CGPA
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary'></div>
                  <span>
                    Pursuing comprehensive studies in Computer Science and
                    Engineering
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <div className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary'></div>
                  <span>Expected graduation with honors</span>
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.6}>
            <div className='border-t pt-4'>
              <h4 className='mb-3 font-semibold'>Relevant Coursework</h4>
              <div className='flex flex-wrap gap-2'>
                {courses.map((item, index) => (
                  <Badge variant='outline' key={index}>
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>
        </CardContent>
      </Card>
    </section>
  );
}
