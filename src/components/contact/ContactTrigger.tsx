'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useContact, type ContactIntent } from './ContactProvider';

interface ContactTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
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
    <button
      type="button"
      {...props}
      onClick={() => {
        onBeforeOpen?.();
        openContact(intent);
      }}
    >
      {children}
    </button>
  );
}
