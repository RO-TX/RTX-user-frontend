import {
  del,
  get,
  getCartSessionId,
  patch,
  post,
  postForm,
  qs,
  setAccessToken,
  type Result,
} from './client';
import type {
  ApiAddress,
  ApiCart,
  ApiCategory,
  ApiCertification,
  ApiOrder,
  ApiProduct,
  ApiReview,
  ApiUser,
  AuthPayload,
  CreateAddressBody,
  CreateAmcEnquiryBody,
  CreateOrderBody,
  CreateRepairBody,
  ProductQuery,
} from './types';

/**
 * Every customer-facing route in `docs/api-schema-reference.md`, one function
 * each. Staff/admin routes (§8) are deliberately absent — this app only ever
 * authenticates as `customer`.
 */

/* ── §2 auth ──────────────────────────────────────────────── */

export const auth = {
  /** Step 1 of signup: emails a 6-digit OTP (rate-limited). */
  requestOtp: (email: string) => post<null>('/auth/request-otp', { email }),

  /** Step 2: verifies the OTP, creates the account and logs in. */
  signup: async (body: {
    firstName: string;
    lastName: string;
    email: string;
    mobile?: string;
    password: string;
    code: string;
  }) => {
    const r = await post<AuthPayload>('/auth/signup', body);
    setAccessToken(r.data.accessToken);
    return r;
  },

  login: async (email: string, password: string) => {
    const r = await post<AuthPayload>('/auth/login', { email, password });
    setAccessToken(r.data.accessToken);
    return r;
  },

  /** Reads the httpOnly cookie, rotates it, returns a fresh access token. */
  refresh: async () => {
    const r = await post<{ accessToken: string }>('/auth/refresh', undefined, { noRetry: true });
    setAccessToken(r.data.accessToken);
    return r;
  },

  logout: async () => {
    const r = await post<null>('/auth/logout');
    setAccessToken(null);
    return r;
  },

  logoutAll: async () => {
    const r = await post<null>('/auth/logout-all');
    setAccessToken(null);
    return r;
  },

  me: () => get<ApiUser>('/auth/me'),

  updateProfile: (body: {
    firstName?: string;
    lastName?: string;
    mobile?: string;
    /** A URL — there is no customer upload endpoint (§7). */
    image?: string;
  }) => patch<ApiUser>('/auth/profile', body),

  /** Clears the refresh cookie server-side; the user must sign in again. */
  changePassword: async (currentPassword: string, newPassword: string) => {
    const r = await patch<null>('/auth/password', { currentPassword, newPassword });
    setAccessToken(null);
    return r;
  },

  forgotPassword: (email: string) => post<null>('/auth/forgot-password', { email }),

  resetPassword: (body: { email: string; token: string; password: string }) =>
    post<null>('/auth/reset-password', body),

  deleteAccount: async (password: string) => {
    const r = await del<null>('/auth/account', { password });
    setAccessToken(null);
    return r;
  },
};

/* ── §3 catalog ───────────────────────────────────────────── */

export const catalog = {
  products: (query: ProductQuery = {}, revalidate = 300): Promise<Result<ApiProduct[]>> =>
    get<ApiProduct[]>(`/catalog/products${qs({ ...query })}`, { revalidate }),

  product: (slug: string, revalidate = 300) =>
    get<ApiProduct>(`/catalog/products/${encodeURIComponent(slug)}`, { revalidate }),

  /** `withProducts=true` is the cheap way to get "from ₹X" / "N models". */
  categories: (withProducts = false, revalidate = 600) =>
    get<ApiCategory[]>(`/catalog/categories${qs({ withProducts })}`, { revalidate }),

  category: (slug: string, revalidate = 600) =>
    get<ApiCategory>(`/catalog/categories/${encodeURIComponent(slug)}`, { revalidate }),
};

/* ── §4 orders ────────────────────────────────────────────── */

export const ordersApi = {
  /** Atomic stock decrement server-side. COD is the only method that completes (§7). */
  create: (body: CreateOrderBody) => post<ApiOrder>('/orders', body),

  mine: (page = 1, limit = 10) => get<ApiOrder[]>(`/orders/mine${qs({ page, limit })}`),

  /** Own order only for a customer; staff can fetch any. */
  one: (id: string) => get<ApiOrder>(`/orders/${id}`),
};

/* ── cart ─────────────────────────────────────────────────── */

/** Guest-session cart today (no login flow yet); a bearer token, if present,
 * takes over automatically once auth exists — see `getCartSessionId()`. */
function cartHeaders(): Record<string, string> {
  const sessionId = getCartSessionId();
  return sessionId ? { 'x-cart-session': sessionId } : {};
}

export const cart = {
  get: () => get<ApiCart>('/cart', { headers: cartHeaders() }),

  addItem: (productId: string, quantity = 1) =>
    post<ApiCart>('/cart/items', { productId, quantity }, { headers: cartHeaders() }),

  setQty: (productId: string, quantity: number) =>
    patch<ApiCart>(`/cart/items/${productId}`, { quantity }, { headers: cartHeaders() }),

  removeItem: (productId: string) =>
    del<ApiCart>(`/cart/items/${productId}`, undefined, { headers: cartHeaders() }),

  clear: () => del<ApiCart>('/cart', undefined, { headers: cartHeaders() }),
};

/* ── addresses ────────────────────────────────────────────── */

export const addresses = {
  list: () => get<ApiAddress[]>('/addresses'),
  create: (body: CreateAddressBody) => post<ApiAddress>('/addresses', body),
  update: (id: string, body: Partial<CreateAddressBody>) =>
    patch<ApiAddress>(`/addresses/${id}`, body),
  remove: (id: string) => del<ApiAddress[]>(`/addresses/${id}`),
  setDefault: (id: string) => patch<ApiAddress[]>(`/addresses/${id}/default`),
};

/* ── §5 content ───────────────────────────────────────────── */

export const content = {
  /** Unfiltered — filter `featured` client-side for the testimonials rail. */
  reviews: (revalidate = 600) => get<ApiReview[]>('/content/reviews', { revalidate }),

  certifications: (activeOnly = true, revalidate = 600) =>
    get<ApiCertification[]>(`/content/certifications${qs({ activeOnly })}`, { revalidate }),
};

/* ── §6 support ───────────────────────────────────────────── */

export const support = {
  /** Fire-and-forget lead; nothing comes back to the customer afterwards. */
  repairRequest: (body: CreateRepairBody) =>
    post<{ requestId: string }>('/support/repair-requests', body),

  amcEnquiry: (body: CreateAmcEnquiryBody) => post<{ _id: string }>('/support/amc-enquiries', body),
};

/* ── uploads ──────────────────────────────────────────────── */

export const uploads = {
  /** Public — no auth, same as the repair-request submit itself. */
  repairAttachment: (file: File) => {
    const form = new FormData();
    form.set('file', file);
    return postForm<{ url: string; type: 'image' | 'video'; filename: string; size: number }>(
      '/uploads/repair-attachment',
      form,
    );
  },
};

export const api = { auth, catalog, orders: ordersApi, content, support, cart, addresses, uploads };
export default api;
