import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import WhatWeDo from '@/components/WhatWeDo';
import ConnectedTechnology from '@/components/ConnectedTechnology';
import CurrentProjects from '@/components/CurrentProjects';
import Capabilities from '@/components/Capabilities';
import Process from '@/components/Process';
import WhyFyndig from '@/components/WhyFyndig';
import Careers from '@/components/Careers';
import Vision from '@/components/Vision';
import Contact from '@/components/Contact';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';
import Cursor from '@/components/Cursor';
import { fetchProjects } from '@/lib/api';
import { projects as staticProjects } from '@/data/projects';

/**
 * Content is fetched on the server when a backend is configured
 * (NEXT_PUBLIC_API_URL). Every fetch falls back to the files in src/data, so
 * the page renders identically with the API down — or with no API at all.
 */
export default async function Home() {
  const projects = (await fetchProjects()) ?? staticProjects;

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <WhatWeDo />
        <ConnectedTechnology />
        <CurrentProjects projects={projects} />
        <Capabilities />
        <Process />
        <WhyFyndig />
        <Careers />
        <Vision />
        <Contact />
        <Location />
      </main>
      <Footer />
      <ScrollAnimations />
      <Cursor />
    </>
  );
}
