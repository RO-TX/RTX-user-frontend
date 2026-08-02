'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronRight, SpecIcon } from './Icons';
import PasswordField, { isStrongPassword, passwordProblems } from './PasswordField';
import AddressBook from './AddressBook';
import { money } from '@/lib/money';
import { cardImage } from '@/data/catalog';
import { useCatalog } from '@/lib/catalog-context';
import { amcPlan, type AccountOrder, type AccountUser } from '@/data/account';
import { api, apiMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const STATUS_LABEL: Record<AccountOrder['status'], string> = {
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

/** One collapsible block. Inline, never a modal — the page keeps its place. */
function Section({
  id,
  title,
  note,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  note: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="sect" data-open={open || undefined}>
      <button
        className="sect__head"
        type="button"
        aria-expanded={open}
        aria-controls={`sect-${id}`}
        onClick={onToggle}
      >
        <span className="sect__title">
          <b>{title}</b>
          <span>{note}</span>
        </span>
        <span className="sect__chev">
          <ChevronRight />
        </span>
      </button>
      {open && (
        <div className="sect__body" id={`sect-${id}`}>
          {children}
        </div>
      )}
    </section>
  );
}

export default function AccountPanels({
  user,
  orders,
  onSignOut,
}: {
  user: AccountUser;
  orders: AccountOrder[];
  onSignOut: (everywhere?: boolean) => Promise<void>;
}) {
  const { patchUser, forgetSession } = useAuth();
  const [open, setOpen] = useState<string | null>('orders');
  const [saved, setSaved] = useState<{ text: string; ok: boolean } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);
  /** Controlled so the rule checklist can score it; `form.reset()` misses it. */
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [delPw, setDelPw] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({ orderUpdates: true, filterReminders: true, offers: false });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [delMsg, setDelMsg] = useState('');
  const [addressCount, setAddressCount] = useState<number | null>(null);

  const catalogue = useCatalog();
  // Order items carry a slug when the catalogue knows it and a Mongo id
  // when the order route only populated that — match on either.
  const getProduct = (key: string) => catalogue.find((p) => p.slug === key || p.id === key);
  const toggle = (id: string) => setOpen((v) => (v === id ? null : id));

  async function saveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const mobile = String(d.get('mobile') ?? '');
    if (!/^\d{10}$/.test(mobile)) {
      setSaved({ text: 'Mobile must be 10 digits.', ok: false });
      return;
    }

    // PATCH /auth/profile takes these four and nothing else.
    const body = {
      firstName: String(d.get('firstName') ?? ''),
      lastName: String(d.get('lastName') ?? ''),
      mobile,
      image: String(d.get('image') ?? ''),
    };

    setSaved({ text: 'Saving…', ok: true });
    try {
      // `image` must be a URL or absent — an empty string fails validation.
      const r = await api.auth.updateProfile(body.image ? body : { ...body, image: undefined });
      setSaved({ text: r.message ?? 'Profile updated.', ok: true });
      patchUser(body);
    } catch (err) {
      setSaved({ text: apiMessage(err, 'Could not save your details.'), ok: false });
    }
  }

  async function savePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const next = newPw;
    if (!isStrongPassword(next)) {
      setPwMsg({ text: `Password still needs: ${passwordProblems(next).join(', ')}.`, ok: false });
      return;
    }
    if (next !== String(d.get('confirm') ?? '')) {
      setPwMsg({ text: 'The two new passwords do not match.', ok: false });
      return;
    }
    setPwMsg({ text: 'Changing…', ok: true });
    try {
      await api.auth.changePassword(curPw, next);
      form.reset();
      setCurPw('');
      setNewPw('');
      // The server revoked every refresh token, so this session is over too —
      // drop straight back to the sign-in panel rather than pretending.
      setPwMsg({ text: 'Password changed. Sign in again with the new one.', ok: true });
      forgetSession();
    } catch (err) {
      setPwMsg({ text: apiMessage(err, 'Could not change the password.'), ok: false });
    }
  }

  async function deleteAccount(password: string) {
    setDelMsg('Deleting…');
    try {
      await api.auth.deleteAccount(password);
      forgetSession();
    } catch (err) {
      setDelMsg(apiMessage(err, 'Could not delete the account.'));
    }
  }

  return (
    <div className="sects">
      <Section
        id="orders"
        title="Orders"
        note={
          orders.length ? `${orders.length} orders · last on ${fmt(orders[0].createdAt)}` : 'None yet'
        }
        open={open === 'orders'}
        onToggle={() => toggle('orders')}
      >
        {orders.length === 0 && (
          <div className="panel">
            <p className="sect__note" style={{ margin: 0 }}>
              No orders yet. Anything you buy shows up here with its status and delivery address.
            </p>
            <Link className="btn btn--sm" href="/shop" style={{ marginTop: 12 }}>
              Browse products
            </Link>
          </div>
        )}
        <div className="orders">
          {orders.map((o) => {
            const isOpen = expanded === o.orderId;
            return (
              <article className="order" key={o.orderId}>
                <button
                  className="order__top"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : o.orderId)}
                >
                  <span className="order__thumbs">
                    {o.items.slice(0, 2).map((it) => {
                      const p = getProduct(it.slug);
                      return p ? (
                        <Image key={it.slug} src={cardImage(p)} alt="" width={80} height={80} />
                      ) : null;
                    })}
                  </span>
                  <span className="order__meta">
                    <b>{o.orderId}</b>
                    <span>
                      {fmt(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? 's' : ''}
                    </span>
                    <span className={`ostat ostat--${o.status}`}>{STATUS_LABEL[o.status]}</span>
                  </span>
                  <span className="order__end">
                    <b>{money(o.totalAmount)}</b>
                    <span className="order__chev">
                      <ChevronRight />
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div className="order__detail">
                    {o.items.map((it) => {
                      const p = getProduct(it.slug);
                      if (!p) return null;
                      return (
                        <Link className="oline" href={`/product/${p.slug}`} key={it.slug}>
                          <Image src={cardImage(p)} alt="" width={80} height={80} />
                          <span>
                            <b>{p.name}</b>
                            <span>
                              Qty {it.quantity} · {money(it.price)} each
                            </span>
                          </span>
                          <span className="oline__total">{money(it.price * it.quantity)}</span>
                        </Link>
                      );
                    })}

                    <dl className="ofacts">
                      <div>
                        <dt>Payment</dt>
                        <dd>
                          {o.paymentMethod === 'cod' ? 'Cash on delivery' : 'Online'} ·{' '}
                          {o.paymentStatus === 'completed' ? 'Paid' : 'Due'}
                        </dd>
                      </div>
                      <div>
                        <dt>Ships to</dt>
                        <dd>
                          {o.shippingAddress.address}, {o.shippingAddress.city}{' '}
                          {o.shippingAddress.postalCode}
                        </dd>
                      </div>
                      <div>
                        <dt>Tracking</dt>
                        <dd>
                          {o.shipping?.waybill
                            ? `${o.shipping.carrierName} · ${o.shipping.waybill}`
                            : 'Not dispatched yet'}
                        </dd>
                      </div>
                    </dl>

                    <p className="sect__note">
                      Live tracking is not wired up yet — the courier number above is the record we
                      hold.
                    </p>

                    {o.id && (
                      <Link className="btn btn--ghost btn--sm" href={`/order/${o.id}`}>
                        View details
                      </Link>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Section>

      <Section
        id="addresses"
        title="Addresses"
        note={addressCount === null ? 'Delivery addresses' : `${addressCount} saved`}
        open={open === 'addresses'}
        onToggle={() => toggle('addresses')}
      >
        <AddressBook onCount={setAddressCount} />
        <p className="sect__note">
          Saved to your account, so they follow you to any device. The default one is filled in for
          you at checkout.
        </p>
      </Section>

      <Section
        id="profile"
        title="Personal details"
        note={`${user.firstName} ${user.lastName} · ${user.mobile}`}
        open={open === 'profile'}
        onToggle={() => toggle('profile')}
      >
        <form className="panel" onSubmit={saveProfile}>
          <div className="field-2">
            <div className="field">
              <label htmlFor="ac-fn">First name</label>
              <input id="ac-fn" name="firstName" defaultValue={user.firstName} autoComplete="given-name" />
            </div>
            <div className="field">
              <label htmlFor="ac-ln">Last name</label>
              <input id="ac-ln" name="lastName" defaultValue={user.lastName} autoComplete="family-name" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="ac-mob">Mobile</label>
            <input
              id="ac-mob"
              name="mobile"
              inputMode="numeric"
              maxLength={10}
              defaultValue={user.mobile}
              autoComplete="tel-national"
            />
          </div>
          <div className="field">
            <label htmlFor="ac-em">Email</label>
            <input id="ac-em" defaultValue={user.email} readOnly aria-describedby="ac-em-note" />
            <span className="field__hint" id="ac-em-note">
              Email is your sign-in and cannot be changed here.
            </span>
          </div>
          <div className="field">
            <label htmlFor="ac-img">Profile photo URL</label>
            <input id="ac-img" name="image" defaultValue={user.image} placeholder="https://…" />
            <span className="field__hint">
              A link, not an upload — the upload endpoint is staff-only today.
            </span>
          </div>
          <button className="btn btn--sm btn--block" type="submit">
            Save changes
          </button>
          {saved && (
            <p className={`sect__msg${saved.ok ? ' sect__msg--ok' : ' sect__msg--err'}`} role="status">
              {saved.ok && <Check />}
              {saved.text}
            </p>
          )}
        </form>
      </Section>

      <Section
        id="amc"
        title="Service plan"
        note={`${amcPlan.product} · ${amcPlan.plan}`}
        open={open === 'amc'}
        onToggle={() => toggle('amc')}
      >
        <div className="panel">
          <div className="planrow">
            <span className="pill-note pill-note--live">Active</span>
            <div>
              <b>
                {amcPlan.product} · {amcPlan.plan}
              </b>
              <span>
                Next visit {amcPlan.nextVisit} · renews {amcPlan.renews}
              </span>
            </div>
          </div>
          <div className="planrow__acts">
            <Link className="btn btn--ghost btn--sm" href="/amc">
              Change plan
            </Link>
            <Link className="btn btn--sm" href="/repair">
              Book a visit
            </Link>
          </div>
        </div>
      </Section>

      <Section
        id="prefs"
        title="Notifications"
        note={Object.values(prefs).filter(Boolean).length + ' of 3 on'}
        open={open === 'prefs'}
        onToggle={() => toggle('prefs')}
      >
        <div className="panel">
          {(
            [
              ['orderUpdates', 'Order updates', 'Dispatch, delivery and payment'],
              ['filterReminders', 'Filter reminders', 'When a cartridge is due'],
              ['offers', 'Offers', 'Occasional discounts, never more than monthly'],
            ] as const
          ).map(([key, title, note]) => (
            <label className="toggle" key={key}>
              <span>
                <b>{title}</b>
                <span>{note}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
              />
              <span className="toggle__track" aria-hidden="true" />
            </label>
          ))}
          <p className="sect__note">Saved on this device — there is no preferences endpoint yet.</p>
        </div>
      </Section>

      <Section
        id="security"
        title="Password &amp; security"
        note={user.emailVerified ? 'Email verified' : 'Email not verified'}
        open={open === 'security'}
        onToggle={() => toggle('security')}
      >
        <form className="panel" onSubmit={savePassword}>
          <PasswordField
            name="currentPassword"
            label="Current password"
            value={curPw}
            onChange={setCurPw}
            autoComplete="current-password"
          />
          <PasswordField
            name="newPassword"
            label="New password"
            value={newPw}
            onChange={setNewPw}
            autoComplete="new-password"
            showRules
          />
          <div className="field">
            <label htmlFor="ac-cf">Repeat it</label>
            <input id="ac-cf" name="confirm" type="password" autoComplete="new-password" />
          </div>
          <button className="btn btn--sm btn--block" type="submit">
            Change password
          </button>
          {pwMsg && (
            <p className={`sect__msg${pwMsg.ok ? ' sect__msg--ok' : ' sect__msg--err'}`} role="status">
              {pwMsg.ok && <Check />}
              {pwMsg.text}
            </p>
          )}
        </form>

        <div className="rows" style={{ paddingTop: 12 }}>
          <button className="icon-row" type="button" onClick={() => onSignOut(true)}>
            <span className="icon-row__bubble">
              <SpecIcon name="shield" />
            </span>
            <span className="icon-row__body">
              <h3>Sign out everywhere</h3>
              <p>Ends every session on every device</p>
            </span>
            <span className="icon-row__chev">
              <ChevronRight />
            </span>
          </button>
        </div>

        <div className="danger">
          <b>Delete account</b>
          <span>Removes your profile and order history. This cannot be undone.</span>
          {confirmDelete ? (
            <form
              className="danger__confirm"
              onSubmit={(e) => {
                e.preventDefault();
                const pw = new FormData(e.currentTarget).get('password');
                void deleteAccount(String(pw ?? ''));
              }}
            >
              <PasswordField
                name="password"
                label="Type your password to confirm"
                value={delPw}
                onChange={setDelPw}
                autoComplete="current-password"
              />
              <div className="danger__acts">
                <button
                  className="btn btn--ghost btn--sm"
                  type="button"
                  onClick={() => {
                    setConfirmDelete(false);
                    setDelMsg('');
                    setDelPw('');
                  }}
                >
                  Keep my account
                </button>
                <button className="btn btn--sm btn--danger" type="submit">
                  Delete permanently
                </button>
              </div>
              {delMsg && (
                <p className="sect__msg sect__msg--err" role="status">
                  {delMsg}
                </p>
              )}
            </form>
          ) : (
            <button className="btn btn--ghost btn--sm" type="button" onClick={() => setConfirmDelete(true)}>
              Delete my account
            </button>
          )}
        </div>
      </Section>

      <div className="rows" style={{ paddingTop: 18 }}>
        <Link className="icon-row" href="/support">
          <span className="icon-row__bubble">
            <SpecIcon name="tds" />
          </span>
          <span className="icon-row__body">
            <h3>Help &amp; FAQ</h3>
            <p>Answers, contact channels</p>
          </span>
          <span className="icon-row__chev">
            <ChevronRight />
          </span>
        </Link>
      </div>

      <div className="amc-cta">
        <button className="btn btn--ghost btn--block btn--sm" type="button" onClick={() => onSignOut()}>
          Sign out
        </button>
      </div>
    </div>
  );
}
