'use client';

import Link from 'next/link';
import { ArrowRight } from './Icons';
import { money } from '@/lib/money';
import { useCart } from '@/lib/cart';

/** The pinned checkout bar. Renders nothing while the cart is empty. */
export default function CartFooter() {
  const { count, total } = useCart();
  if (count === 0) return null;

  return (
    <div className="buybar">
      <div style={{ flex: '0 0 auto', paddingLeft: 4 }}>
        <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.2 }}>Total</div>
        <div className="price" style={{ fontSize: 19 }}>
          {money(total)}
        </div>
      </div>
      <Link className="btn" href="/checkout">
        Checkout <ArrowRight className="icon icon--sm" />
      </Link>
    </div>
  );
}
