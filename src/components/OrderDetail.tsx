'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthPanel from './AuthPanel';
import { money } from '@/lib/money';
import { cardImage } from '@/data/catalog';
import { useCatalog } from '@/lib/catalog-context';
import { useAuth } from '@/lib/auth-context';
import { api, apiMessage } from '@/lib/api';
import { toAccountOrder } from '@/lib/api/adapt';
import type { AccountOrder } from '@/data/account';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Packing',
  shipped: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

/**
 * One order, fetched in the browser — `GET /orders/:id` checks ownership
 * against the bearer token, which only exists client-side.
 */
export default function OrderDetail({ id }: { id: string }) {
  const { status } = useAuth();
  const catalogue = useCatalog();
  const [order, setOrder] = useState<AccountOrder | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status !== 'authed') return;
    let alive = true;
    setError('');
    api.orders
      .one(id)
      .then((r) => alive && setOrder(toAccountOrder(r.data)))
      .catch((err) => alive && setError(apiMessage(err, 'Could not load this order.')));
    return () => {
      alive = false;
    };
  }, [id, status]);

  if (status === 'loading') {
    return (
      <div className="acct-wait" role="status">
        <span className="spinner" aria-hidden="true" />
        <p>Checking your session…</p>
      </div>
    );
  }

  if (status === 'guest') {
    return (
      <AuthPanel heading="Sign in to view this order" intro="Orders are only visible to the account that placed them." />
    );
  }

  if (error) {
    return (
      <div className="empty">
        <h2>Order not available</h2>
        <p>{error}</p>
        <Link className="btn" href="/account">
          Back to my orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="acct-wait" role="status">
        <span className="spinner" aria-hidden="true" />
        <p>Loading order…</p>
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <h1>Order {order.orderId}</h1>
        <p>
          {fmt(order.createdAt)} ·{' '}
          <span className={`ostat ostat--${order.status}`}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </p>
      </div>

      <div className="orders" style={{ padding: '14px var(--pad) 0' }}>
        <article className="order">
          <div className="order__detail">
            {order.items.map((it) => {
              const product = catalogue.find((p) => p.slug === it.slug || p.id === it.slug);
              return product ? (
                <Link className="oline" href={`/product/${product.slug}`} key={it.slug}>
                  <Image src={cardImage(product)} alt="" width={80} height={80} />
                  <span>
                    <b>{product.name}</b>
                    <span>
                      Qty {it.quantity} · {money(it.price)} each
                    </span>
                  </span>
                  <span className="oline__total">{money(it.price * it.quantity)}</span>
                </Link>
              ) : (
                <div className="oline" key={it.slug}>
                  <span>
                    <b>Item</b>
                    <span>
                      Qty {it.quantity} · {money(it.price)} each
                    </span>
                  </span>
                  <span className="oline__total">{money(it.price * it.quantity)}</span>
                </div>
              );
            })}

            <dl className="ofacts">
              <div>
                <dt>Total</dt>
                <dd>{money(order.totalAmount)}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>
                  {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Online'} ·{' '}
                  {order.paymentStatus === 'completed' ? 'Paid' : 'Due'}
                </dd>
              </div>
              <div>
                <dt>Ships to</dt>
                <dd>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode}
                </dd>
              </div>
              <div>
                <dt>Tracking</dt>
                <dd>
                  {order.shipping?.waybill
                    ? `${order.shipping.carrierName} · ${order.shipping.waybill}`
                    : 'Not dispatched yet'}
                </dd>
              </div>
            </dl>

            {order.shipping?.trackingHistory && order.shipping.trackingHistory.length > 0 && (
              <div className="rows" style={{ paddingTop: 12 }}>
                {order.shipping.trackingHistory.map((h, i) => (
                  <div className="row" key={i}>
                    <div className="row__body">
                      <h3>{h.status ?? h.description ?? 'Update'}</h3>
                      <p>
                        {[h.location, h.timestamp ? fmt(h.timestamp) : undefined]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {order.notes && <p className="sect__note">{order.notes}</p>}

            <p className="sect__note">
              Live tracking is not wired up yet — the courier number above is the record we hold.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
