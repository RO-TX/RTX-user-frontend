'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash, Cart as CartIcon } from './Icons';
import { money } from '@/lib/money';
import { useCart, FREE_SHIPPING_THRESHOLD } from '@/lib/cart';
import { cardImage } from '@/data/catalog';

export default function CartView() {
  const { items, count, subtotal, shipping, tax, total, setQty, remove } = useCart();

  if (count === 0) {
    return (
      <div className="empty">
        <span className="empty__bubble">
          <CartIcon />
        </span>
        <h2>Your cart is empty</h2>
        <p>Browse the range and add a purifier, filter or membrane to get started.</p>
        <Link className="btn" href="/shop">
          Start shopping
        </Link>
      </div>
    );
  }

  const toFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    // `display:contents` below 1080px — the wrappers only exist to split the
    // line items from the summary once there is room for two columns.
    <div className="cart-layout">
      <div className="cart-layout__items">
        <div className="rows">
          {items.map(({ product, qty, lineTotal }) => (
            <div className="row" key={product.slug}>
              <Link href={`/product/${product.slug}`} className="row__media">
                <Image src={cardImage(product)} alt="" width={132} height={132} />
              </Link>

              <div className="row__body">
                <h3>
                  <Link href={`/product/${product.slug}`}>{product.name}</Link>
                </h3>
                <p>{product.subtitle}</p>
                <span className="price" style={{ fontSize: 15, marginTop: 2 }}>
                  {money(lineTotal)}
                </span>
              </div>

              <div className="row__end">
                <button
                  onClick={() => remove(product.slug)}
                  aria-label={`Remove ${product.name}`}
                  style={{ color: 'var(--faint)' }}
                >
                  <Trash className="icon icon--sm" />
                </button>
                <div className="qty">
                  <button
                    onClick={() => setQty(product.slug, qty - 1)}
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus />
                  </button>
                  <output>{qty}</output>
                  <button
                    onClick={() => setQty(product.slug, qty + 1)}
                    disabled={qty >= 9}
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {toFreeShipping > 0 && (
          <div style={{ padding: '14px var(--pad) 0' }}>
            <span className="pill-note">Add {money(toFreeShipping)} for free shipping</span>
          </div>
        )}
      </div>

      <div className="cart-layout__side">
        <div className="panel">
          <h3>Order summary</h3>
          <div className="totals">
            <div>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
            </div>
            <div>
              <span>GST (18%)</span>
              <span>{money(tax)}</span>
            </div>
            <div className="grand">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="foot-space" />
    </div>
  );
}
