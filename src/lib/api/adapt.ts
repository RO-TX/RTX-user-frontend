import type { Product, Spec } from '@/data/catalog';
import type { Review } from '@/data/content';
import type { AccountOrder, AccountUser, ShippingAddress } from '@/data/account';
import type { ApiOrder, ApiProduct, ApiReview, ApiUser } from './types';

/**
 * API shape → the view models the screens already use.
 *
 * The point is that no component changes when the backend arrives: the
 * catalogue page keeps consuming `Product`, the account page keeps consuming
 * `AccountOrder`. Everything the API does not carry is derived here, and
 * every derivation is called out — those are the fields to ask backend for.
 */

/** `subtitle` has no API field; the doc's Product has only `description`. */
function firstLine(text: string, max = 46) {
  const line = text.split(/[.\n]/)[0]?.trim() ?? '';
  return line.length > max ? `${line.slice(0, max - 1).trimEnd()}…` : line;
}

export function toProduct(p: ApiProduct): Product {
  const categorySlug = typeof p.category === 'string' ? p.category : p.category.slug;

  return {
    id: p._id,
    slug: p.slug,
    name: p.name,
    // Falls back to a derived line for any product the admin hasn't filled
    // `subtitle` in for yet.
    subtitle: p.subtitle || firstLine(p.description),
    price: p.price,
    // The doc says `mrp: 0` means "no discount shown", not "free".
    mrp: p.mrp > p.price ? p.mrp : undefined,
    rating: p.rating,
    reviews: p.reviewCount,
    categorySlug,
    images: p.images.length ? p.images : ['/img/prod_pro.jpg'],
    specs: (p.specs ?? []) as Spec[],
    description: p.description,
    badge: p.isTopSeller ? 'Bestseller' : undefined,
    // `quantity` is the stock count; there is no separate boolean.
    inStock: p.quantity > 0,
  };
}

export function toReview(r: ApiReview): Review {
  return {
    rating: r.rating,
    body: r.description,
    name: r.name,
    // `position` and `location` are separate fields; the card shows one line.
    role: [r.position, r.location].filter(Boolean).join(' · ') || 'Verified Buyer',
  };
}

export function toAccountUser(u: ApiUser): AccountUser {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    mobile: u.mobile,
    image: u.image === '/images/avatar.png' ? '' : u.image,
    role: 'customer',
    emailVerified: u.emailVerified,
    // Neither /auth/me nor /auth/login actually serialise `createdAt` today,
    // even though the schema reference lists it — so "member since" has to
    // survive its absence rather than print "Invalid Date".
    createdAt: u.createdAt ?? '',
  };
}

function toAddress(a: ApiOrder['shippingAddress']): ShippingAddress {
  return {
    address: a.address,
    city: a.city,
    state: a.state,
    postalCode: a.postalCode,
    country: a.country,
    mobile: a.mobile,
  };
}

/** Statuses the UI does not render get folded onto the nearest one it does. */
function toStatus(s: ApiOrder['status']): AccountOrder['status'] {
  switch (s) {
    case 'orderplaced':
      return 'confirmed';
    case 'custom_build':
      return 'processing';
    default:
      return s;
  }
}

export function toAccountOrder(o: ApiOrder): AccountOrder {
  return {
    id: o._id,
    orderId: o.orderId,
    items: o.items.map((it) => ({
      // `product` is an id unless the route populates it.
      // `/orders/*` populates the product but trims it — no `slug` comes
      // back — so this can be an id either way. Callers match on both.
      slug:
        typeof it.product === 'string' ? it.product : (it.product.slug ?? it.product._id),
      quantity: it.quantity,
      price: it.price,
    })),
    totalAmount: o.totalAmount,
    status: toStatus(o.status),
    shippingAddress: toAddress(o.shippingAddress),
    paymentMethod: o.paymentMethod === 'cod' ? 'cod' : 'razorpay',
    paymentStatus:
      o.paymentStatus === 'cancelled'
        ? 'failed'
        : (o.paymentStatus as AccountOrder['paymentStatus']),
    shipping: o.shipping
      ? {
          carrierName: o.shipping.carrierName,
          waybill: o.shipping.waybill,
          estimatedDelivery: o.shipping.estimatedDelivery,
          trackingHistory: o.shipping.trackingHistory,
        }
      : undefined,
    notes: o.notes,
    createdAt: o.createdAt,
  };
}

/**
 * Run a live call, fall back to the bundled placeholder when the API is not
 * reachable. The prototype has to keep rendering with no backend running —
 * and a failed catalogue fetch should never blank the shop.
 */
export async function withFallback<T>(
  live: () => Promise<T>,
  fallback: T,
  label: string,
): Promise<{ value: T; live: boolean }> {
  try {
    return { value: await live(), live: true };
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[api] ${label} unavailable, using placeholder data:`, (e as Error).message);
    }
    return { value: fallback, live: false };
  }
}
