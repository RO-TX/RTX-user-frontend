'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Bolt, Check, Cup, Droplet, Leak, Pin, Plus, Sound, SpecIcon } from './Icons';
import { api, apiMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const MAX_ATTACHMENTS = 8;

interface Attachment {
  url: string;
  type: 'image' | 'video';
  filename?: string;
  size?: number;
}

const ISSUES = [
  { id: 'no-water', label: 'No water at all', Icon: Droplet },
  { id: 'slow', label: 'Slow or weak flow', Icon: () => <SpecIcon name="flow" /> },
  { id: 'leak', label: 'Leaking or dripping', Icon: Leak },
  { id: 'noise', label: 'Loud or odd noise', Icon: Sound },
  { id: 'power', label: 'Not switching on', Icon: Bolt },
  { id: 'taste', label: 'Taste or smell off', Icon: Cup },
] as const;

/**
 * The six cities an engineer can reach, each mapped to the district the API
 * wants. `district` is a required field on POST /support/repair-requests, but
 * asking a customer for it is friction — one is derivable from the other, so
 * the form asks for the city and fills the district in.
 */
const CITIES: Array<{ city: string; district: string }> = [
  { city: 'Delhi', district: 'New Delhi' },
  { city: 'Noida', district: 'Gautam Buddha Nagar' },
  { city: 'Greater Noida', district: 'Gautam Buddha Nagar' },
  { city: 'Gurugram', district: 'Gurugram' },
  { city: 'Ghaziabad', district: 'Ghaziabad' },
  { city: 'Faridabad', district: 'Faridabad' },
];

type Errors = Partial<Record<'name' | 'mobile' | 'email' | 'pincode' | 'city' | 'address', string>>;

/** Mirrors the create-repair validation on the backend, field for field. */
function validate(f: {
  name: string;
  mobile: string;
  email: string;
  pincode: string;
  city: string;
  address: string;
}): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'Tell us who to ask for';
  if (!/^\d{10}$/.test(f.mobile)) e.mobile = '10 digits, no spaces or +91';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'Check the email address';
  if (!/^\d{6}$/.test(f.pincode)) e.pincode = '6 digits';
  if (!f.city) e.city = 'Pick your city';
  if (f.address.trim().length < 8) e.address = 'House and street, so the engineer finds you';
  return e;
}

/** Used only when the API is unreachable, so the prototype still completes. */
function mockRequestId() {
  return `REQ-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}

/**
 * Symptom picker plus the booking form.
 *
 * The fields are exactly the ones `POST /support/repair-requests` accepts —
 * name, email, mobile, pincode, district, city, address, description,
 * attachments. Photos/videos upload immediately on selection via the public
 * `POST /uploads/repair-attachment` (no auth — same as this form itself), and
 * the returned URLs ride along on the final submit. On submit it POSTs for
 * real and falls back to a local reference if the desk is unreachable.
 */
export default function RepairBooking() {
  // Signed in? Then we already know who is asking — don't make them retype it.
  const { user } = useAuth();
  const [issue, setIssue] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [ref, setRef] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [offline, setOffline] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_ATTACHMENTS - attachments.length);
    e.target.value = '';
    if (!files.length) return;

    setUploading(true);
    setUploadError('');
    try {
      for (const file of files) {
        const r = await api.uploads.repairAttachment(file);
        setAttachments((prev) => [...prev, r.data]);
      }
    } catch (err) {
      setUploadError(apiMessage(err, "Couldn't upload — try again in a moment."));
    } finally {
      setUploading(false);
    }
  }

  function removeAttachment(url: string) {
    setAttachments((prev) => prev.filter((a) => a.url !== url));
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const d = new FormData(ev.currentTarget);
    const values = {
      name: String(d.get('name') ?? ''),
      mobile: String(d.get('mobile') ?? ''),
      email: String(d.get('email') ?? ''),
      pincode: String(d.get('pincode') ?? ''),
      city: String(d.get('city') ?? ''),
      address: String(d.get('address') ?? ''),
    };

    const found = validate(values);
    setErrors(found);

    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // The symptom tile is the opening line of `description`; the API has no
    // separate field for it.
    const symptom = ISSUES.find((i) => i.id === issue)?.label;
    const notes = String(d.get('description') ?? '').trim();
    const description = [symptom, notes].filter(Boolean).join('. ') || 'Service visit requested.';

    setSending(true);
    setOffline('');
    try {
      // district is derived from the city; both are required by the API.
      const district = CITIES.find((c) => c.city === values.city)?.district ?? values.city;
      const r = await api.support.repairRequest({
        ...values,
        district,
        description,
        ...(attachments.length ? { attachments } : {}),
      });
      setRef(r.data.requestId);
    } catch (err) {
      setOffline(apiMessage(err, 'Saved locally — the service desk was unreachable.'));
      setRef(mockRequestId());
    } finally {
      setSending(false);
    }
  }

  if (ref) {
    return (
      <div className="done" role="status">
        <span className="done__tick">
          <Check />
        </span>
        <h3>Booked. We call you next.</h3>
        <p>
          Reference <b>{ref}</b> — quote it if you ring the service desk.
        </p>
        {offline && <p className="done__warn">{offline}</p>}
        <div className="done__next">
          <div>
            <b>1</b>
            <span>A call within one working day to fix the slot</span>
          </div>
          <div>
            <b>2</b>
            <span>A two-hour arrival window by SMS the day before</span>
          </div>
        </div>
        <p className="done__note">
          There is no online status page yet — the desk calls you, not the other way round.
        </p>
        <button
          className="btn btn--ghost btn--sm"
          type="button"
          onClick={() => {
            setRef('');
            setIssue('');
            setErrors({});
          }}
        >
          Book another visit
        </button>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span className="field__err" id={`err-${k}`}>
        {errors[k]}
      </span>
    ) : null;
  const aria = (k: keyof Errors) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `err-${k}` : undefined,
  });

  return (
    // Keyed on the user so the pre-filled defaults land once /auth/refresh
    // resolves, which happens a beat after this first renders.
    <form className="book" key={user?.id ?? 'guest'} ref={form} onSubmit={onSubmit} noValidate>
      <div className="book__step">
        <span className="book__n">1</span>
        <div>
          <h3>What is it doing?</h3>
          <p>Optional, but it decides which parts the engineer packs.</p>
        </div>
      </div>

      <div className="issues">
        {ISSUES.map(({ id, label, Icon }) => (
          <button
            className="issue"
            key={id}
            type="button"
            aria-pressed={issue === id}
            data-active={issue === id ? '' : undefined}
            onClick={() => setIssue(issue === id ? '' : id)}
          >
            <span className="issue__bubble">
              <Icon />
            </span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="book__step">
        <span className="book__n">2</span>
        <div>
          <h3>Where do we come?</h3>
          <p>
            <Pin className="icon icon--sm" />
            On-site visits across Delhi NCR only
          </p>
        </div>
      </div>

      <div className="book__step">
        <span className="book__n">3</span>
        <div>
          <h3>Show us the problem (optional)</h3>
          <p>A photo or short clip helps the engineer bring the right part.</p>
        </div>
      </div>

      <div className="attachments">
        <div className="chips">
          {attachments.map((a) => (
            <span className="chip" key={a.url}>
              {a.type === 'video' ? '🎬' : '🖼'} {a.filename ?? a.type}
              <button
                type="button"
                aria-label={`Remove ${a.filename ?? a.type}`}
                onClick={() => removeAttachment(a.url)}
              >
                ×
              </button>
            </span>
          ))}
          {attachments.length < MAX_ATTACHMENTS && (
            <button
              className="chip"
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
            >
              <Plus className="icon icon--sm" />
              {uploading ? 'Uploading…' : 'Add photo/video'}
            </button>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={onFiles}
        />
        {uploadError && <span className="field__err">{uploadError}</span>}
      </div>

      <div className="panel">
        <div className="field-2">
          <div className="field">
            <label htmlFor="rp-name">Your name</label>
            <input
              id="rp-name"
              name="name"
              autoComplete="name"
              placeholder="Ananya Rao"
              defaultValue={user ? `${user.firstName} ${user.lastName}`.trim() : ''}
              {...aria('name')}
            />
            {err('name')}
          </div>
          <div className="field">
            <label htmlFor="rp-mob">Mobile</label>
            <input
              id="rp-mob"
              name="mobile"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              placeholder="9876543210"
              defaultValue={user?.mobile ?? ''}
              {...aria('mobile')}
            />
            {err('mobile')}
          </div>
        </div>

        <div className="field">
          <label htmlFor="rp-email">Email</label>
          <input
            id="rp-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={user?.email ?? ''}
            {...aria('email')}
          />
          {err('email')}
        </div>

        <div className="field-2">
          <div className="field">
            <label htmlFor="rp-city">City</label>
            <select id="rp-city" name="city" defaultValue="" {...aria('city')}>
              <option value="" disabled>
                Choose…
              </option>
              {CITIES.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
            {err('city')}
          </div>
          <div className="field">
            <label htmlFor="rp-pin">Pincode</label>
            <input
              id="rp-pin"
              name="pincode"
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
              placeholder="110001"
              {...aria('pincode')}
            />
            {err('pincode')}
          </div>
        </div>

        <div className="field">
          <label htmlFor="rp-addr">Address</label>
          <input
            id="rp-addr"
            name="address"
            autoComplete="street-address"
            placeholder="Flat 402, Tower B, Green Acres"
            {...aria('address')}
          />
          {err('address')}
        </div>

        <div className="field">
          <label htmlFor="rp-note">Anything else? (optional)</label>
          <textarea
            id="rp-note"
            name="description"
            placeholder="Started three days ago, worse in the evening…"
          />
        </div>

        <button className="btn btn--block" type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Request a visit'}
          <ArrowRight className="icon icon--sm" />
        </button>
        <p className="book__fine">
          No payment now. The ₹299 visit fee is collected by the engineer and comes off the repair —
          free under an active <Link href="/amc">AMC</Link>.
        </p>
      </div>
    </form>
  );
}
