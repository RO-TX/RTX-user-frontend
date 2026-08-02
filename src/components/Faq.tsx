'use client';

import { useId, useState } from 'react';

export default function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="faq" data-open={open ? '' : undefined}>
      <button
        type="button"
        className="faq__q"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {q}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      {open && (
        <p className="faq__a" id={id}>
          {a}
        </p>
      )}
    </div>
  );
}
