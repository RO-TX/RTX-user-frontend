'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Check } from './Icons';
import { money } from '@/lib/money';
import { useCart } from '@/lib/cart';
import { cardImage, type Product } from '@/data/catalog';

/** Compact add-on cards — "Frequently Bought Together". */
export default function MiniProductRow({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  function handleAdd(slug: string) {
    add(slug);
    setAdded(slug);
    window.setTimeout(() => setAdded((s) => (s === slug ? null : s)), 1200);
  }

  return (
    <div className="minirail">
      {products.map((p) => (
        <article className="mini" key={p.slug}>
          <Link href={`/product/${p.slug}`} className="mini__media">
            <Image src={cardImage(p)} alt={p.name} width={220} height={220} />
          </Link>
          <h3>
            <Link href={`/product/${p.slug}`}>{p.name}</Link>
          </h3>
          <div className="mini__foot">
            <span className="price">{money(p.price)}</span>
            <button
              className="add"
              onClick={() => handleAdd(p.slug)}
              disabled={!p.inStock}
              aria-label={`Add ${p.name} to cart`}
            >
              {added === p.slug ? <Check /> : <Plus />}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
