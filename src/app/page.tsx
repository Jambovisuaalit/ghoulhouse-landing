import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Audience from '@/components/sections/Audience';
import Mechanism from '@/components/sections/Mechanism';
import Examples from '@/components/sections/Examples';
import Deliverables from '@/components/sections/Deliverables';
import Pricing from '@/components/sections/Pricing';
import Process from '@/components/sections/Process';
import Founder from '@/components/sections/Founder';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-ghost">
      <Hero />
      <Problem />
      <Audience />
      <Deliverables />
      <Examples />
      <Pricing />
      <Process />
      <Mechanism />
      <Founder />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
