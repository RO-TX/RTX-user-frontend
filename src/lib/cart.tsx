'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { Product } from '@/data/catalog';
import { useCatalog } from './catalog-context';
import { api } from './api';

const STORAGE_KEY = 'rtx-cart';
const SHIPPING_FLAT = 499;
const FREE_SHIPPING_OVER = 5000;
const TAX_RATE = 0.18;

export interface CartLine {
  slug: string;
  qty: number;
}

type Action =
  | { type: 'add'; slug: string; qty?: number }
  | { type: 'setQty'; slug: string; qty: number }
  | { type: 'remove'; slug: string }
  | { type: 'clear' }
  | { type: 'hydrate'; lines: CartLine[] };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'hydrate':
      return action.lines;
    case 'add': {
      const qty = action.qty ?? 1;
      const found = state.find((l) => l.slug === action.slug);
      if (!found) return [...state, { slug: action.slug, qty }];
      return state.map((l) => (l.slug === action.slug ? { ...l, qty: l.qty + qty } : l));
    }
    case 'setQty':
      if (action.qty < 1) return state.filter((l) => l.slug !== action.slug);
      return state.map((l) => (l.slug === action.slug ? { ...l, qty: action.qty } : l));
    case 'remove':
      return state.filter((l) => l.slug !== action.slug);
    case 'clear':
      return [];
  }
}

export interface CartItem extends CartLine {
  product: Product;
  lineTotal: number;
}

interface CartValue {
  lines: CartLine[];
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const products = useCatalog();

  // Read once on mount. Starting empty on both server and client keeps the
  // first paint identical, so restoring the cart can't cause a hydration diff.
  useEffect(() => {
    let localLines: CartLine[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          localLines = parsed.filter(
            (l): l is CartLine =>
              !!l &&
              typeof (l as CartLine).slug === 'string' &&
              Number.isFinite((l as CartLine).qty) &&
              products.some((p) => p.slug === (l as CartLine).slug),
          );
        }
      }
    } catch {
      /* corrupt or unavailable storage — start with an empty cart */
    }

    if (localLines.length) {
      dispatch({ type: 'hydrate', lines: localLines });
      return;
    }

    // Nothing local (first visit on this device, or a cleared cart) — check
    // whether this guest session already has a cart on the server.
    api.cart
      .get()
      .then((r) => {
        const remoteLines: CartLine[] = r.data.items.flatMap((it) => {
          const p = products.find((p) => p.id === it.productId);
          return p ? [{ slug: p.slug, qty: it.quantity }] : [];
        });
        if (remoteLines.length) dispatch({ type: 'hydrate', lines: remoteLines });
      })
      .catch(() => {
        /* no backend / no existing cart — start empty, same as before */
      });
    // `products` is read inside, but re-validating on every catalogue change
    // would fight the user's own edits; hydrate once, like before.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode / quota — the cart just won't persist */
    }
  }, [lines]);

  const value = useMemo<CartValue>(() => {
    const items: CartItem[] = lines.flatMap((line) => {
      const product = products.find((p) => p.slug === line.slug);
      return product ? [{ ...line, product, lineTotal: product.price * line.qty }] : [];
    });

    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;

    return {
      lines,
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal,
      shipping,
      tax,
      total: Math.round((subtotal + shipping + tax) * 100) / 100,
      add: (slug, qty) => {
        dispatch({ type: 'add', slug, qty });
        const id = products.find((p) => p.slug === slug)?.id;
        if (id) api.cart.addItem(id, qty ?? 1).catch(() => undefined);
      },
      setQty: (slug, qty) => {
        dispatch({ type: 'setQty', slug, qty });
        const id = products.find((p) => p.slug === slug)?.id;
        if (id) api.cart.setQty(id, Math.max(qty, 0)).catch(() => undefined);
      },
      remove: (slug) => {
        dispatch({ type: 'remove', slug });
        const id = products.find((p) => p.slug === slug)?.id;
        if (id) api.cart.removeItem(id).catch(() => undefined);
      },
      clear: () => {
        dispatch({ type: 'clear' });
        api.cart.clear().catch(() => undefined);
      },
    };
  }, [lines, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export const FREE_SHIPPING_THRESHOLD = FREE_SHIPPING_OVER;
