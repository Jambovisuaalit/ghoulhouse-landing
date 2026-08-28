'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useContact } from './ContactProvider';

interface ContactTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
  children: ReactNode;
  onBeforeOpen?: () => void;
}

export default function ContactTrigger({
  children,
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
        openContact();
      }}
    >
      {children}
    </button>
  );
}
