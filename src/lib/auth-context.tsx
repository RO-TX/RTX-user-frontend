'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from './api';
import { toAccountUser } from './api/adapt';
import type { AccountUser } from '@/data/account';

/**
 * Who is signed in.
 *
 * The access token lives in memory inside the transport (§2 of the API
 * reference), so a page reload starts with nothing. What survives is the
 * httpOnly refresh cookie the backend set — so the very first thing this does
 * on mount is spend that cookie on `/auth/refresh`, then read `/auth/me`.
 * No token is ever written to localStorage.
 */

export type AuthStatus = 'loading' | 'authed' | 'guest';

export interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  code: string;
}

interface AuthValue {
  user: AccountUser | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (body: SignUpBody) => Promise<void>;
  signOut: (everywhere?: boolean) => Promise<void>;
  /** Drops the session locally without calling the API — for the flows the
   *  backend has already invalidated server-side (password change, delete). */
  forgetSession: () => void;
  /** Patch the cached user after a successful profile save. */
  patchUser: (next: Partial<AccountUser>) => void;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/**
 * A note-to-self that this device has signed in before.
 *
 * The refresh token is httpOnly, so the browser cannot see whether a session
 * exists — which meant every guest page load fired a `POST /auth/refresh`
 * that 401'd and filled the console with red. This flag is not a credential
 * and grants nothing; it only says "worth asking". Wrong either way, the
 * worst case is one redundant request or one missed silent re-login.
 */
const HINT_KEY = 'rtx-session';
const hadSession = () => {
  try {
    return window.localStorage.getItem(HINT_KEY) === '1';
  } catch {
    return true; // storage blocked — fall back to always asking
  }
};
const setHint = (on: boolean) => {
  try {
    if (on) window.localStorage.setItem(HINT_KEY, '1');
    else window.localStorage.removeItem(HINT_KEY);
  } catch {
    /* private mode — the hint just doesn't persist */
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const load = useCallback(async () => {
    const me = await api.auth.me();
    setUser(toAccountUser(me.data));
    setStatus('authed');
  }, []);

  useEffect(() => {
    let alive = true;

    // Never signed in on this device? Then there is no cookie to spend, and
    // asking anyway just costs a guaranteed 401 on every single page load.
    if (!hadSession()) {
      setStatus('guest');
      return;
    }

    (async () => {
      try {
        // Spend the refresh cookie for an access token, then identify.
        await api.auth.refresh();
        const me = await api.auth.me();
        if (!alive) return;
        setUser(toAccountUser(me.data));
        setStatus('authed');
      } catch {
        // Expired cookie, revoked session, or no backend — all mean "browsing
        // as a guest", a normal state rather than an error to show.
        if (!alive) return;
        setHint(false);
        setUser(null);
        setStatus('guest');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      status,
      signIn: async (email, password) => {
        const r = await api.auth.login(email, password);
        setHint(true);
        setUser(toAccountUser(r.data.user));
        setStatus('authed');
      },
      signUp: async (body) => {
        const r = await api.auth.signup(body);
        setHint(true);
        setUser(toAccountUser(r.data.user));
        setStatus('authed');
      },
      signOut: async (everywhere = false) => {
        try {
          await (everywhere ? api.auth.logoutAll() : api.auth.logout());
        } catch {
          /* the cookie is gone locally either way — never trap someone in */
        }
        setHint(false);
        setUser(null);
        setStatus('guest');
      },
      forgetSession: () => {
        setHint(false);
        setUser(null);
        setStatus('guest');
      },
      patchUser: (next) => setUser((u) => (u ? { ...u, ...next } : u)),
      reload: load,
    }),
    [user, status, load],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
