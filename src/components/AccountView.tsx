'use client';

import { useEffect, useState } from 'react';
import AccountPanels from './AccountPanels';
import AuthPanel from './AuthPanel';
import { Check } from './Icons';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { toAccountOrder } from '@/lib/api/adapt';
import { addressBook, amcPlan, type AccountOrder } from '@/data/account';

/**
 * The account screen, client-side end to end.
 *
 * It has to be: `GET /auth/me` and `GET /orders/mine` are bearer-token routes,
 * and the token only exists in the browser — the Next server never sees the
 * refresh cookie, which is scoped to the API origin. Rendering this on the
 * server could only ever produce a 401.
 */
export default function AccountView() {
  const { user, status, signOut } = useAuth();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [addressCount, setAddressCount] = useState<number | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (status !== 'authed') {
      setOrders([]);
      setAddressCount(null);
      return;
    }
    let alive = true;
    setLoadingOrders(true);

    api.orders
      .mine(1, 20)
      .then((r) => alive && setOrders(r.data.map(toAccountOrder)))
      .catch(() => alive && setOrders([]))
      .finally(() => alive && setLoadingOrders(false));

    api.addresses
      .list()
      .then((r) => alive && setAddressCount(r.data.length))
      .catch(() => undefined);

    return () => {
      alive = false;
    };
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="acct-wait" role="status">
        <span className="spinner" aria-hidden="true" />
        <p>Checking your session…</p>
      </div>
    );
  }

  if (status === 'guest' || !user) {
    return (
      <AuthPanel
        heading="Your account"
        intro="Sign in to see your orders, saved addresses and service plan. Placing an order needs an account, so we know where to send it."
      />
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  const joined = user.createdAt ? new Date(user.createdAt) : null;
  const since =
    joined && !Number.isNaN(joined.getTime())
      ? joined.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      : null;

  return (
    <>
      {/* Identity first: who is signed in, verified or not, since when. */}
      <section className="idcard">
        <span className="idcard__av" aria-hidden="true">
          {initials}
        </span>
        <div className="idcard__body">
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <p>{user.email}</p>
          {user.mobile && <p>+91 {user.mobile}</p>}
          <div className="idcard__tags">
            {user.emailVerified && (
              <span className="idcard__tag">
                <Check />
                Verified
              </span>
            )}
            {since && <span className="idcard__tag idcard__tag--quiet">Member since {since}</span>}
          </div>
        </div>
      </section>

      <div className="acctstats">
        <div>
          <b>{loadingOrders ? '—' : orders.length}</b>
          <span>Orders</span>
        </div>
        <div>
          <b>{addressCount ?? addressBook(orders).length}</b>
          <span>Addresses</span>
        </div>
        <div>
          <b>{amcPlan.plan}</b>
          <span>AMC plan</span>
        </div>
      </div>

      <AccountPanels user={user} orders={orders} onSignOut={signOut} />
    </>
  );
}
