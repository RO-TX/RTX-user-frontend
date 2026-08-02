import type { Envelope, ErrorEnvelope, Pagination } from './types';

/**
 * Transport for RTX-main-backend (`docs/api-schema-reference.md` §1–2).
 *
 * Rules the doc sets that this file exists to enforce:
 *  - every response is an envelope; unwrap `data`, throw on `success:false`
 *  - the access token lives in memory, never localStorage
 *  - the refresh token is an httpOnly cookie the browser attaches itself,
 *    so every request needs `credentials: 'include'`
 *  - a 401 triggers exactly one `/auth/refresh` + retry, then gives up
 */

/**
 * The backend mounts every route under `/api` unconditionally
 * (`app.use('/api', apiLimiter, apiRoutes)`), so a base URL without that
 * segment can only ever 404 — "Route not found: POST /auth/request-otp" and
 * friends. Setting `NEXT_PUBLIC_API_URL` to a bare host is the easy mistake
 * to make on a deploy, so the suffix is enforced here rather than trusted.
 */
export const API_BASE = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!raw) return 'http://localhost:5000/api';
  return /\/api$/.test(raw) ? raw : `${raw}/api`;
})();

/** In-memory only, per §2 — a page reload re-acquires it via /auth/refresh. */
let accessToken: string | null = null;
const listeners = new Set<(token: string | null) => void>();

export function setAccessToken(token: string | null) {
  accessToken = token;
  listeners.forEach((fn) => fn(token));
}
export function getAccessToken() {
  return accessToken;
}
export function onAccessToken(fn: (token: string | null) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const CART_SESSION_KEY = 'rtx-cart-session';

/**
 * A device-local guest cart id — there's no login flow yet, so the cart backend
 * keys on this instead of a user id (see `POST /cart` in the API reference).
 * Once real auth exists, a logged-in cart is looked up by user id server-side.
 */
export function getCartSessionId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    let id = window.localStorage.getItem(CART_SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(CART_SESSION_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly details?: Record<string, unknown>;
  constructor(status: number, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
  /** True when the caller should show a login screen rather than an error. */
  get isAuth() {
    return this.status === 401 || this.status === 403;
  }
}

export interface Result<T> {
  data: T;
  message?: string;
  pagination?: Pagination;
}

interface Options extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Skip the refresh-and-retry dance (used by /auth/refresh itself). */
  noRetry?: boolean;
  /** Next.js fetch cache hints, for server-side catalog reads. */
  revalidate?: number;
}

let refreshing: Promise<boolean> | null = null;

async function refreshOnce(): Promise<boolean> {
  // Collapse parallel 401s into a single refresh, per the standard pattern.
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return false;
      const body = (await res.json()) as Envelope<{ accessToken: string }>;
      setAccessToken(body.data.accessToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

export async function request<T>(path: string, options: Options = {}): Promise<Result<T>> {
  const { body, noRetry, revalidate, headers, ...rest } = options;

  const send = async (): Promise<Response> =>
    fetch(`${API_BASE}${path}`, {
      ...rest,
      credentials: 'include',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      ...(revalidate !== undefined ? { next: { revalidate } } : {}),
    });

  let res: Response;
  try {
    res = await send();
  } catch (e) {
    // Network-level failure: no server, DNS, CORS preflight refused.
    throw new ApiError(0, e instanceof Error ? e.message : 'Network request failed');
  }

  if (res.status === 401 && !noRetry && typeof window !== 'undefined') {
    if (await refreshOnce()) {
      res = await send();
    } else {
      setAccessToken(null);
    }
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    throw new ApiError(res.status, `Unreadable response (${res.status})`);
  }

  if (!res.ok || (payload as ErrorEnvelope)?.success === false) {
    const err = payload as ErrorEnvelope;
    throw new ApiError(res.status, err?.message ?? `Request failed (${res.status})`, err?.details);
  }

  const ok = payload as Envelope<T>;
  return { data: ok.data, message: ok.message, pagination: ok.meta?.pagination };
}

/** Multipart upload — bypasses the JSON body path so the browser sets its own
 * `Content-Type: multipart/form-data; boundary=...`. */
export async function postForm<T>(path: string, form: FormData): Promise<Result<T>> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      body: form,
    });
  } catch (e) {
    throw new ApiError(0, e instanceof Error ? e.message : 'Network request failed');
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    throw new ApiError(res.status, `Unreadable response (${res.status})`);
  }

  if (!res.ok || (payload as ErrorEnvelope)?.success === false) {
    const err = payload as ErrorEnvelope;
    throw new ApiError(res.status, err?.message ?? `Request failed (${res.status})`, err?.details);
  }

  const ok = payload as Envelope<T>;
  return { data: ok.data, message: ok.message };
}

export const get = <T>(path: string, options?: Options) =>
  request<T>(path, { ...options, method: 'GET' });
export const post = <T>(path: string, body?: unknown, options?: Options) =>
  request<T>(path, { ...options, method: 'POST', body });
export const patch = <T>(path: string, body?: unknown, options?: Options) =>
  request<T>(path, { ...options, method: 'PATCH', body });
export const del = <T>(path: string, body?: unknown, options?: Options) =>
  request<T>(path, { ...options, method: 'DELETE', body });

/** Build a querystring, dropping undefined/empty values. */
export function qs(params: Record<string, string | number | boolean | undefined>) {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === '') continue;
    out.set(k, String(v));
  }
  const s = out.toString();
  return s ? `?${s}` : '';
}

/**
 * A user-facing sentence for any thrown error. A dead backend is not the
 * customer's problem to read a stack trace about.
 */
export function apiMessage(err: unknown, offline: string) {
  if (err instanceof ApiError) return err.status === 0 ? offline : err.message;
  return offline;
}
