'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from './Icons';
import { api, apiMessage } from '@/lib/api';

/**
 * `POST /support/amc-enquiries` — the route the doc maps "Explore AMC Plans"
 * onto. Body is exactly `{ name, email, address, mobile, message? }`.
 *
 * Inline under the chosen plan rather than a page of its own: the plan you
 * tapped stays on screen, and the enquiry is fire-and-forget anyway.
 */
export default function AmcEnquiry({ plan, onClose }: { plan: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = {
      name: String(d.get('name') ?? ''),
      email: String(d.get('email') ?? ''),
      address: String(d.get('address') ?? ''),
      mobile: String(d.get('mobile') ?? ''),
      message: `AMC enquiry — ${plan} plan. ${String(d.get('message') ?? '')}`.trim(),
    };

    if (!/^\d{10}$/.test(body.mobile)) {
      setError('Mobile must be 10 digits.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email)) {
      setError('Check the email address.');
      return;
    }
    if (body.address.trim().length < 8) {
      setError('We need an address to quote a visit.');
      return;
    }

    setSending(true);
    setError('');
    try {
      await api.support.amcEnquiry(body);
      setSent(true);
    } catch (err) {
      setError(apiMessage(err, 'Could not reach the service desk — try calling instead.'));
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="enq enq--done" role="status">
        <span className="enq__tick">
          <Check />
        </span>
        <div>
          <b>Enquiry sent</b>
          <span>Someone from the service desk calls you about the {plan} plan.</span>
        </div>
      </div>
    );
  }

  return (
    <form className="enq" onSubmit={submit}>
      <div className="field-2">
        <div className="field">
          <label htmlFor={`enq-name-${plan}`}>Your name</label>
          <input id={`enq-name-${plan}`} name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor={`enq-mob-${plan}`}>Mobile</label>
          <input
            id={`enq-mob-${plan}`}
            name="mobile"
            inputMode="numeric"
            maxLength={10}
            required
            autoComplete="tel-national"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`enq-email-${plan}`}>Email</label>
        <input id={`enq-email-${plan}`} name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor={`enq-addr-${plan}`}>Where is the purifier?</label>
        <input id={`enq-addr-${plan}`} name="address" required autoComplete="street-address" />
      </div>
      {error && <p className="field__err">{error}</p>}
      <div className="enq__acts">
        <button className="btn btn--ghost btn--sm" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn--sm" type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Send enquiry'}
          <ArrowRight className="icon icon--sm" />
        </button>
      </div>
    </form>
  );
}
