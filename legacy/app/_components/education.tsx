import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  GraduationCap,
  Award,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import Reveal from '@/components/framer/Reveal';
import SectionTitle from '@/components/ui/section-title';
import Link from 'next/link';

const programmingHeroCertUrl =
  'https://web.programming-hero.com/verification?validationNumber=PHL2B5L2B5-00611098';

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

  const level2Stack = [
    'TypeScript',
    'Next.js',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Prisma',
    'MongoDB',
    'Redux',
    'Docker',
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

      <div className='space-y-8'>
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
                  Completed
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
                    <p className='text-sm text-muted-foreground'>2022 - 2026</p>
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
                      Graduated with exceptional academic performance — 3.99
                      CGPA
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary'></div>
                    <span>
                      Completed comprehensive studies in Computer Science and
                      Engineering
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary'></div>
                    <span>Graduated with honors</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.6}>
              <div className='border-t pt-4'>
                <h4 className='mb-3 font-semibold'>Relevant Coursework</h4>
                <div className='flex flex-wrap gap-2'>
                  {courses.map((item) => (
                    <Badge variant='outline' key={item}>
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
          </CardContent>
        </Card>

        <Card className='relative overflow-hidden'>
          <div className='absolute left-0 top-0 h-full w-1 bg-primary'></div>
          <CardHeader className='pb-4'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-primary/10 p-2'>
                  <Trophy className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <Reveal delay={0.3}>
                    <CardTitle className='text-xl'>
                      Next Level Web Development — Level 2
                    </CardTitle>
                    <CardDescription className='text-base font-medium text-foreground/80'>
                      Programming Hero · Batch 5
                    </CardDescription>
                  </Reveal>
                </div>
              </div>
              <Reveal delay={0.3}>
                <Badge variant='secondary' className='shrink-0'>
                  Top Performer
                </Badge>
              </Reveal>
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            <Reveal delay={0.4}>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='flex items-center gap-3'>
                  <Award className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='font-medium'>Assignment Score</p>
                    <p className='text-sm text-muted-foreground'>
                      100% on all assignments
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <Trophy className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='font-medium'>Standing</p>
                    <p className='text-sm text-muted-foreground'>
                      Top performer in Batch 5
                    </p>
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
                      Completed Programming Hero&apos;s advanced Level 2
                      bootcamp with a perfect assignment record
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary'></div>
                    <span>
                      Built production-style full-stack projects under
                      industry-grade requirements and deadlines
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary'></div>
                    <span>
                      Strengthened TypeScript, backend architecture, and modern
                      full-stack delivery practices
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.6}>
              <div className='border-t pt-4'>
                <h4 className='mb-3 font-semibold'>Core Stack Covered</h4>
                <div className='flex flex-wrap gap-2'>
                  {level2Stack.map((item) => (
                    <Badge variant='outline' key={item}>
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.7}>
              <div className='border-t pt-4'>
                <Button variant='outline' asChild>
                  <Link
                    href={programmingHeroCertUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2'
                  >
                    <ExternalLink className='h-4 w-4' />
                    Verify Certificate
                  </Link>
                </Button>
              </div>
            </Reveal>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
