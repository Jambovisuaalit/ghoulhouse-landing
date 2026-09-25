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
    const handleAnalyticsReady = () => trackEvent('page_view');
    if (window.localStorage.getItem('ghoulhouse_analytics_consent') === 'accepted') {
      trackEvent('page_view');
    }
    window.addEventListener('ghoulhouse:analytics-ready', handleAnalyticsReady);

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash !== '#yhteys') return;
      const intent = link.dataset.ctaIntent === 'photos' ? 'photos' : 'booking';
      const service = link.dataset.ctaService || url.searchParams.get('service') || (intent === 'photos' ? 'social' : 'unspecified');
      trackEvent(intent === 'photos' ? 'photo_demo_cta_click' : 'primary_cta_click', {
        service, intent,
        location: link.closest('header') ? 'navigation' : link.closest('#top, .seoHero') ? 'hero' : 'page',
      });
    };

    document.addEventListener('click', handleClick);

    if (!('IntersectionObserver' in window)) {
      return () => {
        window.removeEventListener('ghoulhouse:analytics-ready', handleAnalyticsReady);
        document.removeEventListener('click', handleClick);
      };
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
      window.removeEventListener('ghoulhouse:analytics-ready', handleAnalyticsReady);
      document.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  }, []);

  return null;
}
