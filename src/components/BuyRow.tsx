'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Minus, Plus } from './Icons';
import { money } from '@/lib/money';
import { useCart } from '@/lib/cart';
import type { Product } from '@/data/catalog';

const MAX_QTY = 9;

/**
 * Inline quantity + Add to Cart. The extended product screen puts this in
 * the content flow rather than a pinned bar, since the tab bar now owns
 * the bottom of the screen.
 */
export default function BuyRow({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const router = useRouter();

  function handleAdd() {
    add(product.slug, qty);
    router.push('/cart');
  }

  return (
    <div className="buyrow">
      <div className="qty">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
        >
          <Minus />
        </button>
        <output aria-live="polite">{qty}</output>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
          disabled={qty >= MAX_QTY}
          aria-label="Increase quantity"
        >
          <Plus />
        </button>
      </div>

      <button className="btn" type="button" onClick={handleAdd} disabled={!product.inStock}>
        {product.inStock ? (
          <>
            Add to Cart <b>{money(product.price * qty)}</b>
          </>
        ) : (
          'Out of Stock'
        )}
      </button>
    </div>
  );
}
