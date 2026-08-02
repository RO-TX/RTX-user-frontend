'use client';

import { useState } from 'react';
import { ReviewStars } from './sections';
import { reviews as fallback, type Review } from '@/data/content';

export default function ReviewCarousel({ reviews = fallback }: { reviews?: Review[] }) {
  const [i, setI] = useState(0);
  // An empty list would otherwise take the whole page down on render.
  const list = reviews.length ? reviews : fallback;
  const r = list[Math.min(i, list.length - 1)];

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
