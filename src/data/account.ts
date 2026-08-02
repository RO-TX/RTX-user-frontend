/**
 * Placeholder account data, shaped exactly like the API returns it so the
 * screens can be swapped onto `GET /auth/me` and `GET /orders/mine` without
 * reworking the markup.
 *
 * Deliberately absent: a saved-address collection. The backend has no address
 * book — `shippingAddress` is embedded on each Order — so the addresses shown
 * on this screen are derived from past orders rather than invented.
 */

/** `GET /auth/me` → data */
export interface AccountUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  image: string;
  role: 'customer';
  emailVerified: boolean;
  createdAt: string;
}

export const user: AccountUser = {
  id: '665f1c9a4b1d2e3f4a5b6c7d',
  firstName: 'Rahul',
  lastName: 'Sharma',
  email: 'rahul.sharma@example.com',
  mobile: '9876543210',
  image: '',
  role: 'customer',
  emailVerified: true,
  createdAt: '2024-03-12T09:20:00.000Z',
};

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'cod' | 'razorpay';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface ShippingAddress {
  label?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mobile: string;
}

/** `GET /orders/mine` → data[] */
export interface AccountOrder {
  /** Mongo `_id` — the route param for `/order/[id]`. Absent on bundled placeholders. */
  id?: string;
  orderId: string;
  items: { slug: string; quantity: number; price: number }[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shipping?: {
    carrierName?: string;
    waybill?: string;
    estimatedDelivery?: string;
    trackingHistory?: { status?: string; location?: string; timestamp?: string; description?: string }[];
  };
  notes?: string;
  createdAt: string;
}

const HOME: ShippingAddress = {
  label: 'Home',
  address: 'Flat 402, Tower B, Green Acres, Sector 62',
  city: 'Noida',
  state: 'Uttar Pradesh',
  postalCode: '201301',
  country: 'India',
  mobile: '9876543210',
};

const OFFICE: ShippingAddress = {
  label: 'Office',
  address: '3rd Floor, Vipul Trade Centre, Sohna Road',
  city: 'Gurugram',
  state: 'Haryana',
  postalCode: '122018',
  country: 'India',
  mobile: '9811223344',
};

export const orders: AccountOrder[] = [
  {
    orderId: 'RTX48120934',
    items: [{ slug: 'pureflow-pro', quantity: 1, price: 24900 }],
    totalAmount: 29382,
    status: 'delivered',
    shippingAddress: HOME,
    paymentMethod: 'cod',
    paymentStatus: 'completed',
    shipping: { carrierName: 'Delhivery', waybill: '38291047221', estimatedDelivery: '18 Jul 2026' },
    createdAt: '2026-07-14T11:05:00.000Z',
  },
  {
    orderId: 'RTX48108771',
    items: [
      { slug: 'sediment-filter', quantity: 2, price: 1800 },
      { slug: 'carbon-filter', quantity: 1, price: 2200 },
    ],
    totalAmount: 6844,
    status: 'shipped',
    shippingAddress: OFFICE,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shipping: { carrierName: 'Delhivery', waybill: '38290117845', estimatedDelivery: '04 Aug 2026' },
    createdAt: '2026-07-02T16:40:00.000Z',
  },
  {
    orderId: 'RTX48099210',
    items: [{ slug: 'ro-membrane-80gpd', quantity: 1, price: 4200 }],
    totalAmount: 4956,
    status: 'delivered',
    shippingAddress: HOME,
    paymentMethod: 'cod',
    paymentStatus: 'completed',
    createdAt: '2026-06-21T08:15:00.000Z',
  },
];

/**
 * The address book, derived rather than stored: every distinct
 * `shippingAddress` the customer has actually shipped to, most recent first.
 */
export function addressBook(list: AccountOrder[] = orders) {
  const seen = new Map<string, { addr: ShippingAddress; lastUsed: string; count: number }>();
  for (const o of list) {
    const key = `${o.shippingAddress.address}|${o.shippingAddress.postalCode}`;
    const hit = seen.get(key);
    if (hit) {
      hit.count += 1;
      if (o.createdAt > hit.lastUsed) hit.lastUsed = o.createdAt;
    } else {
      seen.set(key, { addr: o.shippingAddress, lastUsed: o.createdAt, count: 1 });
    }
  }
  return [...seen.values()].sort((a, b) => (a.lastUsed < b.lastUsed ? 1 : -1));
}

export const amcPlan = {
  product: 'PureFlow Pro',
  plan: 'Complete',
  nextVisit: '12 Sep 2026',
  renews: '12 Mar 2027',
};
