import Image from 'next/image';
import Link from 'next/link';
import { categories as fallback, type Category } from '@/data/catalog';

/**
 * The image category rail. Two jobs: a shortcut from the home screen, and
 * the filter control on /shop — which is why it takes an `active` slug and
 * can render an "All" entry that clears the filter.
 */
export default function CategoryRail({
  active,
  showAll = false,
  categories = fallback,
}: {
  active?: string;
  showAll?: boolean;
  categories?: Category[];
}) {
  return (
    <nav className="cats" aria-label="Categories">
      {showAll && (
        <Link href="/shop" className="cat" data-active={!active ? '' : undefined}>
          {/* No word inside the crop — the chip's own label already says
              "Everything", and a second one read as a stutter. A dot stands
              in so this chip keeps the shape of the rest of the rail. */}
          <span className="cat__tile cat__tile--all" aria-hidden="true" />
          <span>Everything</span>
        </Link>
      )}
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={c.href ?? `/shop?c=${c.slug}`}
          className="cat"
          data-active={c.slug === active ? '' : undefined}
        >
          <span className="cat__tile">
            <Image src={c.image} alt="" width={124} height={124} />
          </span>
          {/* Clamped to two lines in CSS — `title` gives the rest back on a
              pointer, and tapping through puts the full name on the results
              heading, which is the only route a touch device has. */}
          <span title={c.name}>{c.name}</span>
        </Link>
      ))}
    </nav>
  );
}
