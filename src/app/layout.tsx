import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { CartProvider } from '@/lib/cart';
import { CatalogProvider } from '@/lib/catalog-context';
import { AuthProvider } from '@/lib/auth-context';
import ClickSpark from '@/components/ClickSpark';
import { getProducts } from '@/lib/api/source';
import './globals.css';

const sans = localFont({
  src: [
    { path: '../fonts/Outfit-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Outfit-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Outfit-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Outfit-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

/** Display serif for the hero headline only — subset to latin. */
const serif = localFont({
  src: [
    { path: '../fonts/NSD-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/NSD-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RTX Water Purifiers — Pure Water. Pure Life.',
    template: '%s · RTX Water Purifiers',
  },
  description:
    'Advanced water purification solutions for your home and every need. RO, UV and UF purifiers, filters, membranes and service from RO Technical Xperts.',
};

export const viewport: Viewport = {
  themeColor: '#F3F3F5',
  viewportFit: 'cover',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched once here so client-side code — the cart above all — resolves
  // slugs against the live catalogue instead of the bundled placeholder.
  const { value: products } = await getProducts();

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <ClickSpark sparkColor="#2196F3" sparkSize={12} sparkRadius={20} sparkCount={8} duration={420}>
          <AuthProvider>
            <CatalogProvider products={products}>
              <CartProvider>{children}</CartProvider>
            </CatalogProvider>
          </AuthProvider>
        </ClickSpark>
      </body>
    </html>
  );
}
