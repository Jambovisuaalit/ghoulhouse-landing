import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import ProblemSolution from '@/components/sections/ProblemSolution';
import Mechanism from '@/components/sections/Mechanism';
import Process from '@/components/sections/Process';
import Pricing from '@/components/sections/Pricing';
import ContentExamples from '@/components/sections/ContentExamples';
import Founder from '@/components/sections/Founder';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';
import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Siirry pääsisältöön
      </a>
      <FunnelAnalytics />
      <Navigation />
      <main id="main-content" className="min-h-screen bg-paper">
        <Hero />
        <Mechanism />
        <ProblemSolution />
        <Process />
        <ContentExamples />
        <Pricing />
        <Founder />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
