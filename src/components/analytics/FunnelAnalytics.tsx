'use client';

import { useEffect } from 'react';
import { trackEvent, type FunnelEvent } from '@/lib/analytics';

const observedSections: Array<{
  id: string;
  event: FunnelEvent;
}> = [
  { id: 'pricing', event: 'pricing_view' },
  { id: 'esimerkit', event: 'content_example_view' },
];

export default function FunnelAnalytics() {
  useEffect(() => {
    trackEvent('page_view');

    if (!('IntersectionObserver' in window)) return;

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) continue;

          const match = observedSections.find(
            (section) => section.id === entry.target.id
          );

          if (!match || seen.has(match.id)) continue;

          seen.add(match.id);
          trackEvent(match.event);
          observer.unobserve(entry.target);
        }
      },
      { threshold: [0.35] }
    );

    for (const section of observedSections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
