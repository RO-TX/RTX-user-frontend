'use client';

import Link from 'next/link';
import { Cart } from './Icons';
import { useCart } from '@/lib/cart';

export default function CartBadge() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="tap cart"
      aria-label={count ? `Cart, ${count} item${count === 1 ? '' : 's'}` : 'Cart, empty'}
    >
      <Cart className="icon" />
      {count > 0 && <span className="cart__count">{count}</span>}
    </Link>
  );
}
