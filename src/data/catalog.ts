/**
 * Static catalogue for the prototype.
 *
 * Shapes deliberately mirror the Mongo models in RTX-main-backend
 * (name / slug / price / rating / images / category) so swapping these
 * arrays for `GET /api/catalog/products` is a drop-in change later.
 *
 * Every photograph is cropped from the reference mockups in ../content/,
 * so images repeat across the longer tail of the catalogue.
 */

export type SpecKey =
  | 'shield'
  | 'tds'
  | 'droplet'
  | 'smart'
  | 'filter'
  | 'flow'
  | 'warranty'
  | 'install'
  | 'families'
  | 'delivery'
  | 'payment'
  | 'genuine'
  | 'returns';

export interface Spec {
  icon: SpecKey;
  /** Rendered on two lines, exactly as the reference screen does. */
  label: [string, string];
}

export interface Product {
  /** Mongo `_id` — absent on the bundled static catalogue, present once live. */
  id?: string;
  slug: string;
  name: string;
  subtitle: string;
  /** Shorter line used on the product card, where space is tight. */
  cardSubtitle?: string;
  price: number;
  mrp?: number;
  rating: number;
  reviews: number;
  categorySlug: string;
  /** Gallery: [0] is the opening main shot, [1..3] fill the thumbnail rail. */
  images: string[];
  /** Card/list thumbnail. Falls back to images[0] when omitted. */
  cardImage?: string;
  specs: Spec[];
  description: string;
  badge?: 'Bestseller' | 'New';
  inStock: boolean;
}

export interface Category {
  slug: string;
  name: string;
  image: string;
  /** Service is a destination, not a filter — it routes to /amc. */
  href?: string;
}

export const categories: Category[] = [
  { slug: 'purifiers', name: 'Purifiers', image: '/img/cat1.jpg' },
  { slug: 'filters', name: 'RO Filters', image: '/img/cat2.jpg' },
  { slug: 'membranes', name: 'Membranes', image: '/img/cat3.jpg' },
  { slug: 'accessories', name: 'Parts', image: '/img/cat4.jpg' },
  { slug: 'services', name: 'Service', image: '/img/cat5.jpg', href: '/amc' },
];

export const products: Product[] = [
  {
    slug: 'pureflow-pro',
    name: 'RTX PureFlow Pro',
    subtitle: 'RO + UV + UF + TDS Controller',
    cardSubtitle: 'RO + UV + UF + TDS',
    price: 24900,
    mrp: 29900,
    rating: 4.8,
    reviews: 320,
    categorySlug: 'purifiers',
    images: ['/img/pdp_main.jpg', '/img/pdp_th1.jpg', '/img/pdp_th2.jpg', '/img/pdp_th3.jpg'],
    cardImage: '/img/prod_pro.jpg',
    specs: [
      { icon: 'shield', label: ['7 Stage', 'Purification'] },
      { icon: 'tds', label: ['TDS', 'Control'] },
      { icon: 'droplet', label: ['10L', 'Storage'] },
      { icon: 'smart', label: ['Smart', 'Indicator'] },
    ],
    description:
      'Advanced 7 stage purification with RO, UV, UF and TDS controller. Removes impurities, retains essential minerals and ensures 100% pure and safe drinking water.',
    badge: 'Bestseller',
    inStock: true,
  },
  {
    slug: 'ro-membrane-80gpd',
    name: 'RTX RO Membrane',
    subtitle: '80 GPD Membrane',
    price: 4200,
    mrp: 5500,
    rating: 4.7,
    reviews: 180,
    categorySlug: 'membranes',
    images: ['/img/prod_mem.jpg', '/img/cat2.jpg'],
    specs: [
      { icon: 'filter', label: ['80 GPD', 'Output'] },
      { icon: 'flow', label: ['0.0001µ', 'Pore Size'] },
      { icon: 'shield', label: ['2 Year', 'Life'] },
      { icon: 'install', label: ['Universal', 'Fit'] },
    ],
    description:
      'High rejection 80 GPD thin film composite membrane. Removes dissolved salts, heavy metals and bacteria while maintaining a steady flow rate across varying input pressures.',
    badge: 'Bestseller',
    inStock: true,
  },
  {
    slug: 'pureflow-elite',
    name: 'RTX PureFlow Elite',
    subtitle: 'Smart Purification. Smarter Living.',
    cardSubtitle: '8 Stage · App connected',
    price: 19900,
    mrp: 23900,
    rating: 4.9,
    reviews: 96,
    categorySlug: 'purifiers',
    images: ['/img/promo_prod.jpg', '/img/cat1.jpg'],
    specs: [
      { icon: 'smart', label: ['App', 'Connected'] },
      { icon: 'shield', label: ['8 Stage', 'Purification'] },
      { icon: 'droplet', label: ['12L', 'Storage'] },
      { icon: 'tds', label: ['Auto TDS', 'Balance'] },
    ],
    description:
      'Our flagship purifier. Eight stages of purification, app-connected filter tracking and automatic TDS balancing that adapts to your local water supply without any manual adjustment.',
    badge: 'New',
    inStock: true,
  },
  {
    slug: 'compact-purifier',
    name: 'RTX Compact',
    subtitle: 'RO + UF for small kitchens',
    price: 12900,
    mrp: 15900,
    rating: 4.6,
    reviews: 214,
    categorySlug: 'purifiers',
    images: ['/img/cat1.jpg', '/img/pdp_th1.jpg'],
    specs: [
      { icon: 'shield', label: ['5 Stage', 'Purification'] },
      { icon: 'droplet', label: ['7L', 'Storage'] },
      { icon: 'install', label: ['Wall', 'Mount'] },
      { icon: 'warranty', label: ['1 Year', 'Warranty'] },
    ],
    description:
      'A slim wall-mounted purifier built for compact kitchens. Five stage RO and UF purification in a cabinet under half the width of a standard unit.',
    inStock: true,
  },
  {
    slug: 'sediment-filter',
    name: 'RTX Sediment Filter',
    subtitle: '5 micron spun polypropylene',
    price: 1800,
    rating: 4.5,
    reviews: 402,
    categorySlug: 'filters',
    images: ['/img/cat2.jpg'],
    specs: [
      { icon: 'filter', label: ['5 Micron', 'Rating'] },
      { icon: 'flow', label: ['6 Month', 'Life'] },
      { icon: 'install', label: ['Universal', 'Fit'] },
      { icon: 'droplet', label: ['Food', 'Grade'] },
    ],
    description:
      'First stage sediment filtration. Captures silt, rust and suspended particles before they reach the membrane, extending the life of every stage downstream.',
    inStock: true,
  },
  {
    slug: 'uv-chamber',
    name: 'RTX UV Chamber',
    subtitle: '11W stainless steel barrel',
    price: 6400,
    mrp: 7800,
    rating: 4.7,
    reviews: 128,
    categorySlug: 'accessories',
    images: ['/img/cat3.jpg'],
    specs: [
      { icon: 'shield', label: ['99.9%', 'Sterilised'] },
      { icon: 'smart', label: ['11W', 'UV Lamp'] },
      { icon: 'flow', label: ['2 LPM', 'Flow Rate'] },
      { icon: 'warranty', label: ['1 Year', 'Warranty'] },
    ],
    description:
      'Stainless steel UV sterilisation chamber with an 11W lamp. Inactivates bacteria and viruses at the final stage, immediately before storage.',
    inStock: true,
  },
  {
    slug: 'mineral-cartridge',
    name: 'RTX Mineral Cartridge',
    subtitle: 'Alkaline remineraliser',
    price: 2800,
    rating: 4.6,
    reviews: 173,
    categorySlug: 'accessories',
    images: ['/img/cat4.jpg'],
    specs: [
      { icon: 'droplet', label: ['pH 7.5', 'Balanced'] },
      { icon: 'filter', label: ['8 Month', 'Life'] },
      { icon: 'shield', label: ['Adds Ca', '& Mg'] },
      { icon: 'install', label: ['Inline', 'Fit'] },
    ],
    description:
      'Puts back what reverse osmosis takes out. Adds calcium and magnesium at a controlled rate and lifts the final pH to a naturally balanced 7.5.',
    inStock: true,
  },
  {
    slug: 'annual-service-kit',
    name: 'RTX Annual Service Kit',
    subtitle: 'All consumables, one box',
    price: 7900,
    mrp: 9600,
    rating: 4.8,
    reviews: 88,
    categorySlug: 'filters',
    images: ['/img/cat5.jpg'],
    specs: [
      { icon: 'filter', label: ['4 Filters', 'Included'] },
      { icon: 'warranty', label: ['12 Month', 'Coverage'] },
      { icon: 'install', label: ['Fitting', 'Included'] },
      { icon: 'shield', label: ['Genuine', 'Parts'] },
    ],
    description:
      'Every consumable your purifier needs for a year — sediment, carbon, post-carbon and mineral cartridge — with a scheduled fitting visit included.',
    inStock: false,
  },
  {
    slug: 'carbon-filter',
    name: 'RTX Carbon Filter',
    subtitle: 'Pre-Carbon Filter',
    price: 2200,
    rating: 4.4,
    reviews: 210,
    categorySlug: 'filters',
    images: ['/img/cat3.jpg'],
    specs: [
      { icon: 'filter', label: ['Chlorine', 'Removal'] },
      { icon: 'flow', label: ['6 Month', 'Life'] },
      { icon: 'droplet', label: ['Taste &', 'Odour'] },
      { icon: 'install', label: ['Universal', 'Fit'] },
    ],
    description:
      'Activated carbon pre-filter. Strips chlorine, pesticides and the organic compounds that carry taste and odour, protecting the RO membrane behind it.',
    inStock: true,
  },
  {
    slug: 'post-carbon-filter',
    name: 'RTX Post Carbon',
    subtitle: 'Post-Carbon Filter',
    price: 1800,
    rating: 4.5,
    reviews: 90,
    categorySlug: 'filters',
    images: ['/img/cat2.jpg'],
    specs: [
      { icon: 'droplet', label: ['Final', 'Polish'] },
      { icon: 'filter', label: ['8 Month', 'Life'] },
      { icon: 'flow', label: ['Sweetens', 'Taste'] },
      { icon: 'install', label: ['Inline', 'Fit'] },
    ],
    description:
      'The last stage before the tap. Polishes the finished water, removing any residual taste picked up in storage.',
    inStock: true,
  },
  {
    slug: 'pureflow-classic',
    name: 'RTX PureFlow Classic',
    subtitle: 'RO + UV + UF',
    price: 15900,
    mrp: 18900,
    rating: 4.5,
    reviews: 342,
    categorySlug: 'purifiers',
    images: ['/img/pdp_th1.jpg', '/img/cat1.jpg'],
    specs: [
      { icon: 'shield', label: ['6 Stage', 'Purification'] },
      { icon: 'droplet', label: ['8L', 'Storage'] },
      { icon: 'warranty', label: ['1 Year', 'Warranty'] },
      { icon: 'install', label: ['Wall', 'Mount'] },
    ],
    description:
      'The workhorse of the range. Six stage RO, UV and UF purification with an eight litre tank — everything most homes need, nothing they do not.',
    inStock: true,
  },
];

/** The shot used on cards and list rows — not always the gallery hero. */
export const cardImage = (p: Product) => p.cardImage ?? p.images[0];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const productsByCategory = (categorySlug: string | null) =>
  !categorySlug || categorySlug === 'all'
    ? products
    : products.filter((p) => p.categorySlug === categorySlug);

/** Small parts commonly bought alongside a purifier. */
export const accessoriesFor = (slug: string) =>
  products
    .filter((p) => p.slug !== slug && p.categorySlug === 'filters' && p.inStock)
    .slice(0, 3);

/** Other purifiers to suggest under a product. */
export const relatedTo = (slug: string) =>
  products.filter((p) => p.slug !== slug && p.categorySlug === 'purifiers').slice(0, 2);

/** Curated, matching the extended home screen — the two flagship purifiers. */
export const bestSellers = () =>
  ['pureflow-pro', 'pureflow-elite'].flatMap((s) => products.filter((p) => p.slug === s));

export const searchProducts = (q: string) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return products;
  return products.filter((p) =>
    `${p.name} ${p.subtitle} ${p.categorySlug}`.toLowerCase().includes(needle),
  );
};
