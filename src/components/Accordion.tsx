'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';

export default function Accordion({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <section className="accordion">
      <button
        type="button"
        className="accordion__head"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <h3>{title}</h3>
        <span className="accordion__toggle" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14" />
            {!open && <path d="M12 5v14" />}
          </svg>
        </span>
      </button>
      {open && (
        <p className="accordion__body" id={id}>
          {children}
        </p>
      )}
    </section>
  );
}
