'use client';

import { ctaContext } from '@/lib/cta-context';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackEvent, type FunnelEvent } from '@/lib/analytics';
import { canTrackAnalytics } from '@/lib/analytics-consent';

const observedSections: Array<{
  section: string;
  event: FunnelEvent;
}> = [
  { section: 'pricing', event: 'pricing_view' },
  { section: 'content-examples', event: 'content_example_view' },
];

export default function FunnelAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    const handleAnalyticsReady = () => trackEvent('page_view');
    if (canTrackAnalytics()) {
      trackEvent('page_view');
    }
    window.addEventListener('ghoulhouse:analytics-ready', handleAnalyticsReady);

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href$="#yhteys"]');
      if (!link) return;

      const form = document.querySelector<HTMLFormElement>('form[action="/api/leads"]');
      const data = form ? new FormData(form) : null;
      const context = ctaContext(link.href, window.location.href, data?.get('intent'), data?.get('service'));
      if (!context) return;
      trackEvent(context.intent === 'photos' ? 'photo_demo_cta_click' : 'proposal_cta_click', {
        ...context,
        location: link.closest('header') ? 'navigation' : link.closest('#top') ? 'hero' : 'page',
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
          if (!canTrackAnalytics() || !entry.isIntersecting || entry.intersectionRatio < 0.35) continue;

          const match = observedSections.find(
            (section) => section.section === entry.target.getAttribute('data-analytics-section')
          );

          if (!match || seen.has(match.section)) continue;

          seen.add(match.section);
          trackEvent(match.event);
          observer.unobserve(entry.target);
        }
      },
      { threshold: [0.35] }
    );

    const syncObserver = () => {
      observer.disconnect();
      if (!canTrackAnalytics()) return;
      for (const section of observedSections) {
        if (seen.has(section.section)) continue;
        for (const element of document.querySelectorAll(`[data-analytics-section="${section.section}"]`)) {
          observer.observe(element);
        }
      }
    };
    syncObserver();
    window.addEventListener('ghoulhouse:analytics-ready', syncObserver);
    window.addEventListener('ghoulhouse:analytics-consent', syncObserver);
    window.addEventListener('storage', syncObserver);

    return () => {
      window.removeEventListener('ghoulhouse:analytics-ready', handleAnalyticsReady);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('ghoulhouse:analytics-ready', syncObserver);
      window.removeEventListener('ghoulhouse:analytics-consent', syncObserver);
      window.removeEventListener('storage', syncObserver);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
