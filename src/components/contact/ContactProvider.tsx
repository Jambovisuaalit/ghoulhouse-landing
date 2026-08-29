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

interface ContactContextValue {
  openContact: () => void;
  closeContact: () => void;
  isOpen: boolean;
}

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const siteContentRef = useRef<HTMLDivElement>(null);

  const openContact = useCallback(() => {
    trackEvent('cta_click', { path: window.location.pathname });
    trackEvent('lead_form_open', { path: window.location.pathname });
    setIsOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    setIsOpen(false);
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
    () => ({ openContact, closeContact, isOpen }),
    [openContact, closeContact, isOpen]
  );

  return (
    <ContactContext.Provider value={value}>
      <div ref={siteContentRef}>{children}</div>
      {isOpen ? <ContactModal onClose={closeContact} /> : null}
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
