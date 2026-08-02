'use client';

import { useId, useState } from 'react';

/**
 * Description with a "Read More" toggle, as the extended product screen
 * shows. Collapsed to three lines via line-clamp so the fold lands in the
 * same place regardless of copy length.
 */
export default function ReadMore({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <section className="readmore">
      <h3>Description</h3>
      <p id={id} className="readmore__body" data-clamped={open ? undefined : ''}>
        {text}
      </p>
      <button
        type="button"
        className="link-blue link-blue--tight"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Read Less' : 'Read More'}
      </button>
    </section>
  );
}
