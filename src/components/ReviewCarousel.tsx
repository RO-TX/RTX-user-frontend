'use client';

import { useState } from 'react';
import { ReviewStars } from './sections';
import type { Review } from '@/data/content';

/**
 * Renders nothing at all when there is nothing to render. A storefront with
 * no testimonials should be quiet about it, not show invented ones — so the
 * caller can hand this whatever the API returned and let it decide.
 */
export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [i, setI] = useState(0);
  const list = reviews;
  const r = list[Math.min(i, list.length - 1)];

  if (!list.length) return null;

  return (
    <>
      <article className="review">
        <ReviewStars rating={r.rating} />
        <p className="review__body">{r.body}</p>
        <div className="review__by">
          <span className="review__avatar" aria-hidden="true">
            {r.name.charAt(0)}
          </span>
          <span>
            <b>{r.name}</b>
            <span>{r.role}</span>
          </span>
        </div>
      </article>

      <div className="dots dots--tap" role="tablist" aria-label="Choose a review">
        {list.map((rev, n) => (
          <button
            key={rev.name}
            role="tab"
            aria-selected={n === i}
            aria-label={`Review ${n + 1} of ${list.length}, from ${rev.name}`}
            data-active={n === i ? '' : undefined}
            onClick={() => setI(n)}
          />
        ))}
      </div>
    </>
  );
}
