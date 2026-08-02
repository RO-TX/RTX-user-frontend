'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BadgeGlyph, Plus, Check } from './Icons';
import Stars from './Stars';
import { money } from '@/lib/money';
import { useCart } from '@/lib/cart';
import { useState } from 'react';
import { cardImage, type Product } from '@/data/catalog';

/**
 * `wide` is the merchandising variant: the card takes the full row, with a
 * full-bleed photo band above the details. It reaches for `images[0]` rather
 * than the card crop — that is the larger source of the two, and a band this
 * wide shows every missing pixel.
 */
export default function ProductCard({
  product,
  wide = false,
}: {
  product: Product;
  wide?: boolean;
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add(product.slug);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <article className={`pcard${wide ? ' pcard--wide' : ''}`}>
      <Link href={`/product/${product.slug}`} className="pcard__media">
        <Image
          src={wide ? product.images[0] : cardImage(product)}
          alt={product.name}
          width={400}
          height={320}
          sizes={wide ? '(max-width: 760px) 100vw, 460px' : '(max-width: 760px) 50vw, 220px'}
        />
        {product.badge && (
          <span className={`tagline tagline--${product.badge === 'New' ? 'new' : 'best'}`}>
            <BadgeGlyph />
            {product.badge}
          </span>
        )}
      </Link>

      <div className="pcard__body">
        <h3>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="pcard__sub">{product.cardSubtitle ?? product.subtitle}</p>
        <div className="rating">
          <Stars rating={product.rating} />
          <span>
            <b>{product.rating}</b> ({product.reviews})
          </span>
        </div>
        <div className="pcard__foot">
          <span className="price">{money(product.price)}</span>
          <button
            className="add"
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={
              product.inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`
            }
          >
            {justAdded ? <Check /> : <Plus />}
          </button>
        </div>
      </div>
    </article>
  );
}
