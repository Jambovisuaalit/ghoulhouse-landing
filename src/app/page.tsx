import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Audience from '@/components/sections/Audience';
import Mechanism from '@/components/sections/Mechanism';
import Examples from '@/components/sections/Examples';
import Deliverables from '@/components/sections/Deliverables';
import Process from '@/components/sections/Process';
import Pricing from '@/components/sections/Pricing';
import Founder from '@/components/sections/Founder';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';
import Footer from '@/components/layout/Footer';
import Navigation from '@/components/layout/Navigation';
import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';
import { ContactProvider } from '@/components/contact/ContactProvider';

export default function Home() {
  return (
    <ContactProvider>
      <a className="skip-link" href="#main-content">
        Siirry pääsisältöön
      </a>
      <FunnelAnalytics />
      <Navigation />
      <main id="main-content" className="min-h-screen bg-ghost">
        <Hero />
        <Problem />
        <Audience />
        <Mechanism />
        <Examples />
        <Deliverables />
        <Process />
        <Pricing />
        <Founder />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </ContactProvider>
  );
}
