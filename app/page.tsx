import Navbar from './_components/navbar';
import JumpingText from '@/components/framer/JumpingText';
import Image from 'next/image';
import Hero from './_components/hero';
import SectionTitle from '@/components/ui/section-title';
import SkillSection from './_components/skills-section';
import Projects from './_components/projects';
import AboutMe from './_components/aboutme';
import Contact from './_components/contact';
import Footer from '@/components/footer';
import ScrollToTop from './_components/ScrollToTop';
import CursorFollower from '@/components/framer/CursorFollower';
import { Education } from './_components/education';
import { BlogSection } from './_components/blog-section';

export default function Home() {
  return (
    <main className='relative flex min-h-svh flex-col overflow-y-auto overflow-x-hidden scroll-smooth bg-background text-primary selection:bg-primary selection:text-background dark:text-muted-foreground'>
      <div className='absolute inset-0 h-[90vh] w-screen bg-background bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:32px_32px]'>
        <div className='absolute bottom-0 h-64 w-full bg-gradient-to-t from-background to-transparent'></div>
      </div>
      <Navbar />
      <div className='container mx-auto'>
        <Hero />
        <div className='my-40'></div>
        <SkillSection />
        <Projects />
        <BlogSection />
        <br />
        <br />
        <Education />
        <AboutMe />
        <Contact />
        <br /> <br />
      </div>
      <Footer />
      <CursorFollower />
      {/* <ScrollToTop /> */}
    </main>
  );
}
