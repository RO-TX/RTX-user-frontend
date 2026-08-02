import { Star } from './Icons';

/**
 * Five stars, tail dimmed. A star lights once the score reaches three
 * quarters of it — which is what the reference screens show (4.8 → five
 * lit, 4.7 → four).
 */
export default function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} style={rating >= i + 0.75 ? undefined : { opacity: 0.3 }} />
      ))}
    </span>
  );
}
