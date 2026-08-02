'use client';

import { useState } from 'react';
import { ArrowRight, Check } from './Icons';
import AmcEnquiry from './AmcEnquiry';
import { money } from '@/lib/money';

export interface Plan {
  name: string;
  note: string;
  price: number;
  visits: string;
  includes: string[];
  featured?: boolean;
}

/**
 * The plan cards, unchanged apart from what "Book" does: it opens the AMC
 * enquiry form in place instead of bouncing to /repair, which is what the
 * doc maps this CTA onto.
 */
export default function PlanCards({ plans }: { plans: Plan[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="plans">
      {plans.map((p) => (
        <article className={`plan${p.featured ? ' plan--featured' : ''}`} key={p.name}>
          {p.featured && <span className="plan__tag">Most popular</span>}
          <div className="plan__top">
            <div>
              <h3 className="plan__name">{p.name}</h3>
              <p className="plan__note">{p.note}</p>
            </div>
            <div className="plan__price">
              <b>{money(p.price)}</b>
              <span>{p.visits}</span>
            </div>
          </div>
          <ul className="plan__list">
            {p.includes.map((line) => (
              <li key={line}>
                <Check />
                {line}
              </li>
            ))}
          </ul>

          {open === p.name ? (
            <AmcEnquiry plan={p.name} onClose={() => setOpen(null)} />
          ) : (
            <button
              className="btn btn--sm btn--block"
              type="button"
              onClick={() => setOpen(p.name)}
            >
              Book {p.name}
              <ArrowRight className="icon icon--sm" />
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
