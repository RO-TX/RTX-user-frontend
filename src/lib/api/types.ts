/**
 * Wire types for RTX-main-backend, transcribed from
 * `api-schema-reference.md` (derived from backend source on 2026-07-31).
 *
 * These are the shapes the server sends. The UI keeps its own view models —
 * see `adapt.ts` for the mapping — so a backend rename never reaches a
 * component.
 */

export interface Envelope<T> {
  success: true;
  data: T;
  message?: string;
  meta?: { pagination?: Pagination };
}

export interface ErrorEnvelope {
  success: false;
  message: string;
  details?: Record<string, unknown>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/* ── auth ─────────────────────────────────────────────────── */

export type Role = 'customer' | 'call_center' | 'microadmin' | 'admin';

export interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  image: string;
  role: Role;
  emailVerified: boolean;
  /** Listed in the schema reference, but the serialiser omits both — treat
   *  them as optional until the backend actually sends them. */
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthPayload {
  user: ApiUser;
  accessToken: string;
}

/* ── catalog ──────────────────────────────────────────────── */

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  catImage: string;
  description: string;
  products: string[] | ApiProduct[];
  categoryType: 'homecategory' | 'customcategory' | 'customplushome';
  createdAt: string;
  updatedAt: string;
}

export interface ApiPriceBreakup {
  mrp: number;
  price: number;
  discount: number;
  discountPercent: number;
  basePrice: number;
  gstRate: number;
  gstAmount: number;
  installationCharge: number;
  total: number;
}

export interface ApiProduct {
  _id: string;
  skuid: string;
  slug: string;
  name: string;
  subtitle?: string;
  specs?: { icon: string; label: [string, string] }[];
  images: string[];
  description: string;
  flipkartLink: string;
  amazonLink: string;
  mrp: number;
  price: number;
  gstRate: number;
  installationCharge: number;
  quantity: number;
  category: { _id: string; name: string; slug: string } | string;
  isTopSeller: boolean;
  productType: 'homeproduct' | 'customproduct' | 'customplushome';
  colors: string[];
  sizes: string[];
  warrantyMonths: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  priceBreakup: ApiPriceBreakup;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  productType?: ApiProduct['productType'];
  isTopSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'sequence' | 'price_asc' | 'price_desc' | 'newest';
}

/* ── orders ───────────────────────────────────────────────── */

export type ApiOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'custom_build'
  | 'orderplaced';

export type ApiPaymentMethod = 'cod' | 'razorpay' | 'bank_transfer' | 'upi' | 'card' | 'wallet';

export type ApiPaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface ApiShippingAddress {
  address: string;
  state: string;
  city: string;
  postalCode: string;
  country: string;
  mobile: string;
}

export interface ApiOrder {
  _id: string;
  orderId: string;
  user: string;
  items: { product: string | ApiProduct; quantity: number; price: number }[];
  totalAmount: number;
  status: ApiOrderStatus;
  shippingAddress: ApiShippingAddress;
  paymentMethod: ApiPaymentMethod;
  paymentStatus: ApiPaymentStatus;
  shipping?: {
    waybill?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    carrierName?: string;
    trackingHistory?: Array<{
      status?: string;
      location?: string;
      timestamp?: string;
      description?: string;
    }>;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderBody {
  items: { product: string; quantity: number }[];
  shippingAddress: ApiShippingAddress;
  /** Only 'cod' completes end to end today — there is no /payments module. */
  paymentMethod: 'cod' | 'razorpay';
  notes?: string;
}

/* ── content ──────────────────────────────────────────────── */

export interface ApiReview {
  _id: string;
  image: string;
  name: string;
  position: string;
  description: string;
  rating: number;
  location: string;
  featured: boolean;
  source: 'admin' | 'customer';
  createdAt: string;
}

export interface ApiCertification {
  _id: string;
  title: string;
  description: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  image: string;
  verificationId: string;
  isActive: boolean;
}

/* ── support ──────────────────────────────────────────────── */

export interface CreateRepairBody {
  name: string;
  email: string;
  /** 10 digits */
  mobile: string;
  /** 6 digits */
  pincode: string;
  district: string;
  city: string;
  address: string;
  description: string;
  /** Max 8. Unusable from the customer app — the upload route is staff-only. */
  attachments?: { url: string; type: 'image' | 'video'; filename?: string; size?: number }[];
}

/* ── cart ─────────────────────────────────────────────────── */

export interface ApiCartItem {
  productId: string;
  skuid: string;
  title: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
}

export interface ApiCart {
  _id: string;
  items: ApiCartItem[];
  totalQuantity: number;
  totalValue: number;
}

/* ── addresses ────────────────────────────────────────────── */

export interface ApiAddress {
  _id: string;
  label?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mobile: string;
  isDefault: boolean;
}

export type CreateAddressBody = Omit<ApiAddress, '_id' | 'isDefault'> & { isDefault?: boolean };

export interface CreateAmcEnquiryBody {
  name: string;
  email: string;
  address: string;
  /** 10 digits */
  mobile: string;
  message?: string;
}
