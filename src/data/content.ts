/**
 * Editorial content for the extended landing and product pages
 * (reference mockups in ../content_2/).
 *
 * Video posters and reviewer photos reuse product/lifestyle crops — the
 * source mockups are 141px wide, so no usable stills could be lifted from
 * them. Swap `poster` / `avatar` when real assets exist.
 */

import type { SpecKey } from './catalog';

export interface Stat {
  icon: SpecKey;
  value: string;
  label: [string, string];
}

export const stats: Stat[] = [
  { icon: 'warranty', value: '25+', label: ['Years of', 'Experience'] },
  { icon: 'families', value: '80K+', label: ['Happy', 'Families'] },
  { icon: 'droplet', value: '100%', label: ['Pure & Safe', 'Water'] },
  { icon: 'delivery', value: 'All India', label: ['Fast & Reliable', 'Delivery'] },
];

export const story = {
  heading: 'Our Story',
  body: 'A trusted name in 80,000+ homes.',
  cta: 'Know Our Story',
  poster: '/img/cat1.jpg',
};

export interface Video {
  duration: string;
  title: [string, string];
  poster: string;
}

export const featureVideo = {
  heading: 'RTX in Action',
  body: 'Purity, in practice.',
  poster: '/img/pdp_main.jpg',
};

export const videos: Video[] = [
  { duration: '01:02', title: ['Pure Water', 'Everyday'], poster: '/img/cat1.jpg' },
  { duration: '00:45', title: ['7-Stage', 'Purification'], poster: '/img/pdp_th2.jpg' },
  { duration: '01:36', title: ['Installation', 'Made Easy'], poster: '/img/promo_prod.jpg' },
];

export interface Review {
  rating: number;
  body: string;
  name: string;
  role: string;
}

export const reviews: Review[] = [
  {
    rating: 5,
    body: 'Two years in. Reliable, low maintenance, and the water tastes pure.',
    name: 'Rohit Verma',
    role: 'Verified Buyer',
  },
  {
    rating: 5,
    body: 'Great build, great taste, easy to install.',
    name: 'Ajay Mehta',
    role: 'Verified Buyer',
  },
  {
    rating: 5,
    body: 'The TDS controller makes a real difference. Service was on time.',
    name: 'Sneha Iyer',
    role: 'Verified Buyer',
  },
  {
    rating: 4,
    body: 'Solid build, and the filter reminders are genuinely useful.',
    name: 'Imran Qureshi',
    role: 'Verified Buyer',
  },
];

export const youtube = {
  heading: 'From Our YouTube Channel',
  title: ['Pure Water', 'Better Life'],
};

export interface TrustItem {
  icon: SpecKey;
  title: string;
  note: string;
}

/** Four-up strip at the foot of the landing page. */
export const trustLanding: TrustItem[] = [
  { icon: 'payment', title: 'Secure', note: 'Payments' },
  { icon: 'genuine', title: 'Genuine', note: 'Parts' },
  { icon: 'warranty', title: '1 Year', note: 'Warranty' },
  { icon: 'returns', title: 'Easy', note: 'Returns' },
];

/** Three-up card on the shop screens. */
export const trustShop: TrustItem[] = [
  // One line each. Wrapping to two set the height of the whole row, which
  // left the other two columns trailing dead space under their notes.
  { icon: 'delivery', title: 'Free Shipping', note: 'Above ₹5,000' },
  { icon: 'warranty', title: '1 Year Warranty', note: 'On All Products' },
  { icon: 'families', title: 'Expert Support', note: 'Seven days a week' },
];

/** Stacked rows on the product page. */
export const benefits: TrustItem[] = [
  { icon: 'delivery', title: 'Free Delivery', note: 'On orders above ₹5,000' },
  { icon: 'warranty', title: '1 Year Warranty', note: 'On all products' },
  { icon: 'returns', title: 'Easy Returns', note: 'Within 7 days' },
  { icon: 'payment', title: 'Secure Payments', note: 'Encrypted checkout' },
];

/**
 * Service testimonials for /repair — the job, not the product. Separate from
 * `reviews` (which are product/homepage testimonials) because the thing being
 * judged is the visit: who turned up, how fast, what it cost.
 */
export interface ServiceReview {
  rating: number;
  body: string;
  name: string;
  city: string;
  job: string;
  when: string;
}

export const serviceReviews: ServiceReview[] = [
  {
    rating: 5,
    body: 'Booked at 9pm, engineer here by 4 the next day. Showed me the TDS before and after.',
    name: 'Rohit Verma',
    city: 'Noida',
    job: 'Membrane replaced',
    when: '2 weeks ago',
  },
  {
    rating: 5,
    body: 'Slowed to a trickle — sediment filter. Fixed in one visit.',
    name: 'Sneha Iyer',
    city: 'Gurugram',
    job: 'Filter change',
    when: '1 month ago',
  },
  {
    rating: 5,
    body: 'Visit fee came off the bill as quoted. No surprises.',
    name: 'Ajay Mehta',
    city: 'Delhi',
    job: 'Pump repair',
    when: '1 month ago',
  },
  {
    rating: 4,
    body: 'Same engineer as last year. Slot slipped an hour, but they called ahead.',
    name: 'Priya Nair',
    city: 'Ghaziabad',
    job: 'Annual service',
    when: '2 months ago',
  },
];
