'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Check, Pin, Plus, Trash } from './Icons';
import { addressBook, type ShippingAddress } from '@/data/account';
import { api, type ApiAddress } from '@/lib/api';

const STORAGE_KEY = 'rtx-addresses';

export interface SavedAddress extends ShippingAddress {
  id: string;
}

interface Stored {
  items: SavedAddress[];
  defaultId: string;
}

/** Seeded from the addresses past orders actually shipped to. */
function seed(): Stored {
  const items = addressBook().map((entry, i) => ({ ...entry.addr, id: `a${i}` }));
  return { items, defaultId: items[0]?.id ?? '' };
}

function fromApi(items: ApiAddress[]): Stored {
  return {
    items: items.map((a) => ({ ...a, id: a._id })),
    defaultId: items.find((a) => a.isDefault)?._id ?? items[0]?._id ?? '',
  };
}

type Errors = Partial<Record<'address' | 'city' | 'state' | 'postalCode' | 'mobile', string>>;

function validate(a: Omit<SavedAddress, 'id'>): Errors {
  const e: Errors = {};
  if (a.address.trim().length < 8) e.address = 'House and street, please';
  if (!a.city.trim()) e.city = 'Required';
  if (!a.state.trim()) e.state = 'Required';
  if (!/^\d{6}$/.test(a.postalCode)) e.postalCode = '6 digits';
  if (!/^\d{10}$/.test(a.mobile)) e.mobile = '10 digits';
  return e;
}

/**
 * A real address book — add, edit, delete, choose a default.
 *
 * Tries `GET /addresses` first; signed in, that is the source of truth and
 * every edit round-trips. Signed out it falls back to a localStorage mirror
 * seeded from past orders, so a guest browsing the screen still sees
 * something rather than an auth wall.
 */
export default function AddressBook({ onCount }: { onCount?: (n: number) => void } = {}) {
  const [state, setState] = useState<Stored>(seed);
  const [live, setLive] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  // Read local mirror once, then try the real endpoint — if it works, it wins.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        if (Array.isArray(parsed?.items)) setState(parsed);
      }
    } catch {
      /* corrupt storage — keep the seeded list */
    }

    api.addresses
      .list()
      .then((r) => {
        setLive(true);
        setState(fromApi(r.data));
      })
      .catch(() => {
        /* not logged in / backend unreachable — stay on the local mirror */
      });
  }, []);

  // Keep the caller's "N saved" summary honest.
  useEffect(() => {
    onCount?.(state.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items.length]);

  function persist(next: Stored) {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode — the book just won't survive a reload */
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>, id: string | null) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const draft = {
      label: String(d.get('label') ?? '').trim() || 'Address',
      address: String(d.get('address') ?? ''),
      city: String(d.get('city') ?? ''),
      state: String(d.get('state') ?? ''),
      postalCode: String(d.get('postalCode') ?? ''),
      country: 'India',
      mobile: String(d.get('mobile') ?? ''),
    };

    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length) return;

    if (live) {
      try {
        if (id) {
          const r = await api.addresses.update(id, draft);
          setState((s) => ({ ...s, items: s.items.map((a) => (a.id === id ? { ...r.data, id } : a)) }));
          setEditing(null);
        } else {
          const r = await api.addresses.create(draft);
          setState((s) => ({
            items: [...s.items, { ...r.data, id: r.data._id }],
            defaultId: s.defaultId || r.data._id,
          }));
          setAdding(false);
        }
        return;
      } catch {
        /* fall through to the local mirror if the live call fails mid-session */
      }
    }

    if (id) {
      persist({ ...state, items: state.items.map((a) => (a.id === id ? { ...draft, id } : a)) });
      setEditing(null);
    } else {
      const fresh = { ...draft, id: `a${Date.now().toString(36)}` };
      persist({
        items: [...state.items, fresh],
        defaultId: state.defaultId || fresh.id,
      });
      setAdding(false);
    }
  }

  async function remove(id: string) {
    if (live) {
      try {
        await api.addresses.remove(id);
      } catch {
        /* ignore — still remove locally below */
      }
    }
    const items = state.items.filter((a) => a.id !== id);
    persist({ items, defaultId: state.defaultId === id ? (items[0]?.id ?? '') : state.defaultId });
  }

  async function setDefault(id: string) {
    if (live) {
      try {
        await api.addresses.setDefault(id);
      } catch {
        /* ignore — still set locally below */
      }
    }
    persist({ ...state, defaultId: id });
  }

  const err = (k: keyof Errors) =>
    errors[k] ? <span className="field__err">{errors[k]}</span> : null;

  const form = (a: SavedAddress | null) => (
    <form className="addrform" onSubmit={(e) => submit(e, a?.id ?? null)}>
      <div className="field-2">
        <div className="field">
          <label htmlFor={`ad-label-${a?.id ?? 'new'}`}>Label</label>
          <input
            id={`ad-label-${a?.id ?? 'new'}`}
            name="label"
            defaultValue={a?.label ?? ''}
            placeholder="Home"
          />
        </div>
        <div className="field">
          <label htmlFor={`ad-mob-${a?.id ?? 'new'}`}>Mobile</label>
          <input
            id={`ad-mob-${a?.id ?? 'new'}`}
            name="mobile"
            inputMode="numeric"
            maxLength={10}
            defaultValue={a?.mobile ?? ''}
            placeholder="9876543210"
          />
          {err('mobile')}
        </div>
      </div>

      <div className="field">
        <label htmlFor={`ad-addr-${a?.id ?? 'new'}`}>Flat, building, street</label>
        <input
          id={`ad-addr-${a?.id ?? 'new'}`}
          name="address"
          defaultValue={a?.address ?? ''}
          placeholder="Flat 402, Tower B, Green Acres"
        />
        {err('address')}
      </div>

      <div className="field-2">
        <div className="field">
          <label htmlFor={`ad-city-${a?.id ?? 'new'}`}>City</label>
          <input id={`ad-city-${a?.id ?? 'new'}`} name="city" defaultValue={a?.city ?? ''} placeholder="Noida" />
          {err('city')}
        </div>
        <div className="field">
          <label htmlFor={`ad-state-${a?.id ?? 'new'}`}>State</label>
          <input
            id={`ad-state-${a?.id ?? 'new'}`}
            name="state"
            defaultValue={a?.state ?? ''}
            placeholder="Uttar Pradesh"
          />
          {err('state')}
        </div>
      </div>

      <div className="field-2">
        <div className="field">
          <label htmlFor={`ad-pin-${a?.id ?? 'new'}`}>Pincode</label>
          <input
            id={`ad-pin-${a?.id ?? 'new'}`}
            name="postalCode"
            inputMode="numeric"
            maxLength={6}
            defaultValue={a?.postalCode ?? ''}
            placeholder="201301"
          />
          {err('postalCode')}
        </div>
        <div className="field">
          <label htmlFor={`ad-ctry-${a?.id ?? 'new'}`}>Country</label>
          <input id={`ad-ctry-${a?.id ?? 'new'}`} defaultValue="India" readOnly />
        </div>
      </div>

      <div className="addrform__acts">
        <button
          className="btn btn--ghost btn--sm"
          type="button"
          onClick={() => {
            setEditing(null);
            setAdding(false);
            setErrors({});
          }}
        >
          Cancel
        </button>
        <button className="btn btn--sm" type="submit">
          {a ? 'Save address' : 'Add address'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="addrs">
      {state.items.map((a) =>
        editing === a.id ? (
          <div className="addr addr--editing" key={a.id}>
            {form(a)}
          </div>
        ) : (
          <article className="addr" key={a.id}>
            <span className="addr__pin">
              <Pin />
            </span>
            <div className="addr__body">
              <b>
                {a.label}
                {state.defaultId === a.id && <span className="addr__tag">Default</span>}
              </b>
              <span>{a.address}</span>
              <span>
                {a.city}, {a.state} {a.postalCode} · {a.country}
              </span>
              <span className="addr__meta">{a.mobile}</span>

              <div className="addr__acts">
                {state.defaultId !== a.id && (
                  <button type="button" onClick={() => setDefault(a.id)}>
                    <Check />
                    Set default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditing(a.id);
                    setAdding(false);
                    setErrors({});
                  }}
                >
                  Edit
                </button>
                <button type="button" className="addr__del" onClick={() => remove(a.id)}>
                  <Trash />
                  Delete
                </button>
              </div>
            </div>
          </article>
        ),
      )}

      {adding ? (
        <div className="addr addr--editing">{form(null)}</div>
      ) : (
        <button
          className="addr__add"
          type="button"
          onClick={() => {
            setAdding(true);
            setEditing(null);
            setErrors({});
          }}
        >
          <Plus />
          Add a new address
        </button>
      )}
    </div>
  );
}
