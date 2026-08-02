import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import NavBar from '@/components/NavBar';
import ProductGallery from '@/components/ProductGallery';
import ReadMore from '@/components/ReadMore';
import BuyRow from '@/components/BuyRow';
import MiniProductRow from '@/components/MiniProductRow';
import ProductCard from '@/components/ProductCard';
import ReviewCarousel from '@/components/ReviewCarousel';
import Stars from '@/components/Stars';
import { SectionHead, BenefitList } from '@/components/sections';
import { Heart, Share, SpecIcon } from '@/components/Icons';
import { money } from '@/lib/money';
import { accessoriesFor, relatedTo } from '@/data/catalog';
import { getProduct, getProducts } from '@/lib/api/source';
import { benefits } from '@/data/content';

/** Pre-renders whatever the catalogue holds at build time — the live one when
 *  the backend is up, the bundled copy when it is not. Anything added after a
 *  build is still served on demand. */
export async function generateStaticParams() {
  const { value: products } = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { value: product } = await getProduct(slug);
  if (!product) return { title: 'Product not found' };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { value: product } = await getProduct(slug);
  if (!product) notFound();

  const alsoBought = accessoriesFor(product.slug);
  const related = relatedTo(product.slug);

  return (
    <AppShell
      tabBar
      header={
        <NavBar
          title="Product Details"
          back="/shop"
          actions={
            <>
              <button className="tap" aria-label="Save to wishlist">
                <Heart className="icon" />
              </button>
              <button className="tap" aria-label="Share">
                <Share className="icon" />
              </button>
            </>
          }
        />
      }
    >
      {/* Both wrappers are `display:contents` on a phone, so the sections
          below stay direct children of the scroller and the mobile stack is
          unchanged. Above 1080px they become the two columns of the page. */}
      <div className="pdp-top">
        <div className="pdp-top__media">
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        <div className="pdp-top__info">
          <section className="pinfo">
            <div className="pinfo__top">
              <h2>{product.name}</h2>
              <span className="pinfo__price">{money(product.price)}</span>
            </div>
            <p className="pinfo__sub">{product.subtitle}</p>
            <div className="rating">
              <Stars rating={product.rating} />
              <span>
                <b>{product.rating}</b> ({product.reviews} reviews)
              </span>
            </div>
            {!product.inStock && (
              <p style={{ marginTop: 10 }}>
                <span className="pill-note" style={{ background: '#F7EEDC', color: 'var(--warn)' }}>
                  Out of stock — back soon
                </span>
              </p>
            )}
          </section>

          <section className="specs" aria-label="Key specifications">
            {product.specs.map((s) => (
              <div className="spec" key={s.label.join(' ')}>
                <span className="spec__bubble">
                  <SpecIcon name={s.icon} />
                </span>
                <span>
                  {s.label[0]}
                  <br />
                  {s.label[1]}
                </span>
              </div>
            ))}
          </section>

          <ReadMore text={product.description} />

          <BuyRow product={product} />
        </div>
      </div>

      <BenefitList items={benefits} />

      {alsoBought.length > 0 && (
        <section className="band" aria-labelledby="fbt">
          <SectionHead title="Frequently Bought Together" id="fbt" />
          <MiniProductRow products={alsoBought} />
        </section>
      )}

      <section className="band" aria-labelledby="says">
        <SectionHead title="What Our Customers Say" href="/support" id="says" />
        <ReviewCarousel />
      </section>

      {related.length > 0 && (
        <section className="band" aria-labelledby="alike">
          <SectionHead title="You May Also Like" href="/shop" id="alike" />
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="foot-space" />
    </AppShell>
  );
}
