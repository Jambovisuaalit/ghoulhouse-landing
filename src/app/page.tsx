import Audience from '@/components/sections/Audience';
import Deliverables from '@/components/sections/Deliverables';
import Examples from '@/components/sections/Examples';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';
import Founder from '@/components/sections/Founder';
import Hero from '@/components/sections/Hero';
import Mechanism from '@/components/sections/Mechanism';
import Pricing from '@/components/sections/Pricing';
import Problem from '@/components/sections/Problem';
import Process from '@/components/sections/Process';
import Footer from '@/components/layout/Footer';
import Navigation from '@/components/layout/Navigation';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Problem />
        <Mechanism />
        <Examples />
        <Deliverables />
        <Process />
        <Pricing />
        <Audience />
        <Founder />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
