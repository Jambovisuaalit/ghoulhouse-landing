'use client';

import { useState } from 'react';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Mechanism from '@/components/sections/Mechanism';
import Examples from '@/components/sections/Examples';
import Deliverables from '@/components/sections/Deliverables';
import Process from '@/components/sections/Process';
import Pricing from '@/components/sections/Pricing';
import Audience from '@/components/sections/Audience';
import Founder from '@/components/sections/Founder';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';
import Footer from '@/components/layout/Footer';
import Navigation from '@/components/layout/Navigation';
import ContactModal from '@/components/ui/ContactModal';

export default function Home() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleCTAClick = () => {
    setShowContactModal(true);
  };

  return (
    <>
      <Navigation onCtaClick={handleCTAClick} />
      <main className="min-h-screen bg-white">
        <Hero onCtaClick={handleCTAClick} />
        <Problem />
        <Mechanism />
        <Examples />
        <Deliverables />
        <Process />
        <Pricing />
        <Audience />
        <Founder />
        <FAQ />
        <FinalCTA onCtaClick={handleCTAClick} />
      </main>
      <Footer />
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </>
  );
}
