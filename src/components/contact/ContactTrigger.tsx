'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useContact, type ContactIntent } from './ContactProvider';

interface ContactTriggerProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  children: ReactNode;
  intent?: ContactIntent;
  onBeforeOpen?: () => void;
}

export default function ContactTrigger({
  children,
  intent = 'booking',
  onBeforeOpen,
  ...props
}: ContactTriggerProps) {
  const { openContact } = useContact();

  return (
    <a
      href="#yhteydenotto"
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onBeforeOpen?.();
        openContact(intent, event.currentTarget);
      }}
    >
      {children}
    </a>
  );
}
