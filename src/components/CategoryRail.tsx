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
          <span className="cat__tile cat__tile--all" aria-hidden="true">
            All
          </span>
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
          <span>{c.name}</span>
        </Link>
      ))}
    </nav>
  );
}
