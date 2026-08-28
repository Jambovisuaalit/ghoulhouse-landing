'use client';

import dynamic from 'next/dynamic';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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

  const openContact = useCallback(() => {
    trackEvent('primary_cta_click');
    trackEvent('lead_form_open');
    setIsOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openContact, closeContact, isOpen }),
    [openContact, closeContact, isOpen]
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
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
