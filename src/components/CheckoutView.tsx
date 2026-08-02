'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { Check, Cart as CartIcon } from './Icons';
import AuthPanel from './AuthPanel';
import { money } from '@/lib/money';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth-context';
import { api, apiMessage, type ApiAddress } from '@/lib/api';

type Method = 'razorpay' | 'cod';

export default function CheckoutView() {
  const { items, count, subtotal, shipping, tax, total, clear } = useCart();
  const { user, status } = useAuth();
  // COD is the default because it is the only method that completes end to
  // end — there is no /payments module behind the Razorpay option yet.
  const [method, setMethod] = useState<Method>('cod');
  const [placed, setPlaced] = useState<{ orderId: string; id?: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState('');
  /** The saved address that pre-fills the form, once it has arrived. */
  const [preset, setPreset] = useState<ApiAddress | null>(null);
  const [addrLoaded, setAddrLoaded] = useState(false);

  // Saved addresses are per-user, so this only runs once signed in.
  useEffect(() => {
    if (status !== 'authed') return;
    let alive = true;
    api.addresses
      .list()
      .then((r) => {
        if (!alive) return;
        setPreset(r.data.find((a) => a.isDefault) ?? r.data[0] ?? null);
      })
      .catch(() => undefined)
      .finally(() => alive && setAddrLoaded(true));
    return () => {
      alive = false;
    };
  }, [status]);

  async function placeOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);

    const shippingAddress = {
      address: String(d.get('address') ?? ''),
      city: String(d.get('city') ?? ''),
      state: String(d.get('state') ?? ''),
      postalCode: String(d.get('pincode') ?? ''),
      country: 'India',
      mobile: String(d.get('mobile') ?? ''),
    };

    setSending(true);
    setFailed('');
    try {
      // POST /orders wants product ids; the cart only knows slugs, so the
      // catalogue is fetched once to map between them.
      const list = await api.catalog.products({ limit: 100 });
      const idBySlug = new Map(list.data.map((p) => [p.slug, p._id]));

      const r = await api.orders.create({
        items: items.map((i) => ({
          product: idBySlug.get(i.slug) ?? i.slug,
          quantity: i.qty,
        })),
        shippingAddress,
        paymentMethod: 'cod',
      });
      setPlaced({ orderId: r.data.orderId, id: r.data._id });
      clear();

      // Remember the address if it is new — next checkout pre-fills itself.
      if (!preset) api.addresses.create({ ...shippingAddress, isDefault: true }).catch(() => undefined);
    } catch (err) {
      // No fake confirmation: the order either exists on the server or it
      // does not, and the cart stays put so nothing is lost.
      setFailed(apiMessage(err, 'The store is unreachable — your cart is safe, try again shortly.'));
    } finally {
      setSending(false);
    }
  }

  if (placed) {
    return (
      <div className="empty">
        <span className="empty__bubble" style={{ color: 'var(--ok)' }}>
          <Check />
        </span>
        <h2>Order placed</h2>
        <p>
          Your reference is <b style={{ color: 'var(--ink)' }}>{placed.orderId}</b>. A confirmation
          is on its way to your inbox, and the order is listed in your account.
        </p>
        <Link className="btn" href={placed.id ? `/order/${placed.id}` : '/account'}>
          {placed.id ? 'View order' : 'View my orders'}
        </Link>
        <Link
          href="/shop"
          style={{ marginTop: 4, fontSize: 14, fontWeight: 500, color: 'var(--blue)' }}
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="empty">
        <span className="empty__bubble">
          <CartIcon />
        </span>
        <h2>Nothing to check out</h2>
        <p>Your cart is empty, so there is nothing to pay for yet.</p>
        <Link className="btn" href="/shop">
          Browse products
        </Link>
      </div>
    );
  }

  if (status === 'loading' || (status === 'authed' && !addrLoaded)) {
    return (
      <div className="acct-wait" role="status">
        <span className="spinner" aria-hidden="true" />
        <p>Getting your details…</p>
      </div>
    );
  }

  // `POST /orders` is a bearer-token route — an order has to belong to
  // someone. Sign-in happens right here so the cart is never abandoned.
  if (status === 'guest' || !user) {
    return (
      <AuthPanel
        heading="Sign in to check out"
        intro={`${count} item${count === 1 ? '' : 's'} ready. Orders are tied to your account so you can track them — it takes a moment to create one.`}
      />
    );
  }

  return (
    // Wrappers are `display:contents` below 1080px; above it the form fields
    // take the main column and the summary rides alongside them.
    <form className="co-layout" onSubmit={placeOrder}>
      <div className="co-layout__main">
        <div className="panel">
          <h3>Delivery address</h3>
          {preset && (
            <p className="field__hint" style={{ margin: '-2px 0 12px' }}>
              Filled in from your saved address — edit anything that has changed.
            </p>
          )}
          <div className="field">
            <label htmlFor="co-name">Full name</label>
            <input
              id="co-name"
              name="name"
              required
              autoComplete="name"
              defaultValue={`${user.firstName} ${user.lastName}`.trim()}
            />
          </div>
          <div className="field">
            <label htmlFor="co-addr">Address</label>
            <input
              id="co-addr"
              name="address"
              required
              autoComplete="street-address"
              defaultValue={preset?.address ?? ''}
            />
          </div>
          <div className="field-2">
            <div className="field">
              <label htmlFor="co-city">City</label>
              <input
                id="co-city"
                name="city"
                required
                autoComplete="address-level2"
                defaultValue={preset?.city ?? ''}
              />
            </div>
            <div className="field">
              <label htmlFor="co-state">State</label>
              <input
                id="co-state"
                name="state"
                required
                autoComplete="address-level1"
                defaultValue={preset?.state ?? ''}
              />
            </div>
          </div>
          <div className="field-2">
            <div className="field">
              <label htmlFor="co-pin">Pincode</label>
              <input
                id="co-pin"
                name="pincode"
                required
                inputMode="numeric"
                pattern="\d{6}"
                title="Six digit pincode"
                autoComplete="postal-code"
                defaultValue={preset?.postalCode ?? ''}
              />
            </div>
          <div className="field">
            <label htmlFor="co-phone">Mobile</label>
            <input
              id="co-phone"
              name="mobile"
              required
              inputMode="tel"
              pattern="\d{10}"
              title="Ten digit mobile number"
              autoComplete="tel-national"
              defaultValue={preset?.mobile ?? user.mobile ?? ''}
            />
          </div>
          </div>
        </div>

        <div className="panel">
          <h3>Payment</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(
              [
                ['cod', 'Cash on delivery', 'Pay the courier when your order arrives'],
                ['razorpay', 'Pay online', 'Not available yet — no payment gateway is connected'],
              ] as const
            ).map(([value, title, note]) => (
              <label
                key={value}
                className="icon-row"
                style={{
                  cursor: 'pointer',
                  borderColor: method === value ? 'var(--navy)' : undefined,
                }}
              >
                <input
                  type="radio"
                  name="method"
                  value={value}
                  checked={method === value}
                  disabled={value === 'razorpay'}
                  onChange={() => setMethod(value)}
                  style={{ accentColor: 'var(--navy)', width: 18, height: 18, flex: 'none' }}
                />
                <div className="icon-row__body">
                  <h3>{title}</h3>
                  <p>{note}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="co-layout__side">
        <div className="panel">
          <h3>
            {count} item{count === 1 ? '' : 's'}
          </h3>
          <div className="totals">
            {items.map(({ product, qty, lineTotal }) => (
              <div key={product.slug}>
                <span>
                  {product.name} × {qty}
                </span>
                <span>{money(lineTotal)}</span>
              </div>
            ))}
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
          <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            Subtotal {money(subtotal)}. Prototype checkout — no payment is taken.
          </p>
        </div>

        <div style={{ padding: '16px var(--pad) 0' }}>
          <button className="btn btn--block" type="submit" disabled={sending}>
            {sending ? 'Placing…' : method === 'cod' ? 'Place order' : `Pay ${money(total)}`}
          </button>
          {failed && (
            <p className="sect__msg sect__msg--err" role="alert">
              {failed}
            </p>
          )}
        </div>
      </div>

      <div className="foot-space" />
    </form>
  );
}
