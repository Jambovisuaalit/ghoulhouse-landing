'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function CaseViewAnalytics({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent('case_view', {
      slug,
      path: window.location.pathname,
    });
  }, [slug]);

  return null;
}
