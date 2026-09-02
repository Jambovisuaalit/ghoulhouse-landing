'use client';

import { useEffect } from 'react';
import { trackEvent, type FunnelEvent } from '@/lib/analytics';

const observedSections: Array<{
  id: string;
  event: FunnelEvent;
}> = [
  { id: 'hinta', event: 'pricing_view' },
  { id: 'esimerkit', event: 'content_example_view' },
];

export default function FunnelAnalytics() {
  useEffect(() => {
    trackEvent('page_view');

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href="#laheta-kuvat"]');
      if (!link) return;

      trackEvent('primary_cta_click', {
        location: link.closest('header') ? 'navigation' : link.closest('#top') ? 'hero' : 'page',
      });
      trackEvent('photo_demo_cta_click');
    };

    document.addEventListener('click', handleClick);

    if (!('IntersectionObserver' in window)) {
      return () => document.removeEventListener('click', handleClick);
    }

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

    return () => {
      document.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  }, []);

  return null;
}
