'use client';

import dynamic from 'next/dynamic';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { trackEvent } from '@/lib/analytics';

const ContactModal = dynamic(() => import('@/components/ui/ContactModal'), {
  ssr: false,
});

export type ContactIntent = 'booking' | 'photos';

interface ContactContextValue {
  openContact: (intent?: ContactIntent, trigger?: HTMLElement) => void;
  closeContact: () => void;
  isOpen: boolean;
  intent: ContactIntent;
}

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<ContactIntent>('booking');
  const siteContentRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openContact = useCallback((
    nextIntent: ContactIntent = 'booking',
    trigger?: HTMLElement
  ) => {
    returnFocusRef.current =
      trigger ?? (document.activeElement as HTMLElement | null);
    setIntent(nextIntent);
    trackEvent(nextIntent === 'booking' ? 'booking_cta_click' : 'photo_demo_cta_click');
    trackEvent('lead_form_open');
    setIsOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    setIsOpen(false);

    window.setTimeout(() => {
      const returnTarget = returnFocusRef.current;

      if (returnTarget?.isConnected) {
        returnTarget.focus({ preventScroll: true });
      }
    }, 0);
  }, []);

  useEffect(() => {
    const siteContent = siteContentRef.current;
    if (!siteContent) return;

    if (isOpen) {
      siteContent.setAttribute('inert', '');
      siteContent.setAttribute('aria-hidden', 'true');
    } else {
      siteContent.removeAttribute('inert');
      siteContent.removeAttribute('aria-hidden');
    }

    return () => {
      siteContent.removeAttribute('inert');
      siteContent.removeAttribute('aria-hidden');
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ openContact, closeContact, isOpen, intent }),
    [openContact, closeContact, isOpen, intent]
  );

  return (
    <ContactContext.Provider value={value}>
      <div ref={siteContentRef}>{children}</div>
      {isOpen ? <ContactModal onClose={closeContact} intent={intent} /> : null}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error('useContact must be used within ContactProvider.');
  }

  return context;
}
