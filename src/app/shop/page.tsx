import Image from 'next/image';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import CategoryRail from '@/components/CategoryRail';
import ShopBrowser from '@/components/ShopBrowser';
import { TrustStrip } from '@/components/sections';
import { ArrowRight } from '@/components/Icons';
import { getCategories, getProducts } from '@/lib/api/source';
import { trustShop } from '@/data/content';

export const metadata = { title: 'Shop' };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const [{ value: categories }, { value: products }] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  // Only real filter categories count — 'services' is a link out to /amc.
  const active = categories.find((cat) => cat.slug === c && !cat.href)?.slug;
  const elite = products.find((p) => p.slug === 'pureflow-elite');

  return (
    <AppShell tabBar>
      {/* No Suspense needed: the filter comes from searchParams on the
          server, so the client half only owns the text query. The rail is
          passed through so it lands between the search bar and the results. */}
      <ShopBrowser active={active} products={products} categories={categories}>
        <CategoryRail active={active} showAll categories={categories} />
      </ShopBrowser>

      {/* Merchandising sits below the results, and only on the unfiltered
          view — it would be noise on top of a four-item category. */}
      {!active && elite && (
        <section className="promo" aria-labelledby="launch">
          <Image className="promo__img" src={elite.images[0]} alt="" width={434} height={340} />
          <div className="promo__copy">
            <p className="promo__eyebrow">New Launch</p>
            <h3 id="launch">{elite.name}</h3>
            <p>
              Smarter Purification.
              <br />
              Better Living.
            </p>
            <Link className="btn btn--sm" href={`/product/${elite.slug}`}>
              Explore Now
              <ArrowRight className="icon icon--sm" />
            </Link>
          </div>
        </section>
      )}

      <TrustStrip items={trustShop} variant="card" />

      <div className="foot-space" />
    </AppShell>
  );
}









