import Image from 'next/image';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import CartBadge from '@/components/CartBadge';
import ProductCard from '@/components/ProductCard';
import DeliveryMap from '@/components/DeliveryMap';
import ReviewCarousel from '@/components/ReviewCarousel';
import CertificationStrip from '@/components/CertificationStrip';
import {
  SectionHead,
  StatsCard,
  StoryBlock,
  VideoSection,
  YouTubeCard,
  TrustStrip,
} from '@/components/sections';
import { ArrowRight } from '@/components/Icons';
import { trustLanding } from '@/data/content';
import { getCertifications, getFeatured, getReviews } from '@/lib/api/source';

export const metadata = {
  description: 'RO water purifiers, filters, membranes and service for every Indian home.',
};

export default async function HomePage() {
  const [{ value: reviews }, { value: certifications }, { value: featured }] = await Promise.all([
    getReviews(),
    getCertifications(),
    getFeatured(4),
  ]);
  return (
    <AppShell tabBar>
      <header className="appbar">
        <Image
          className="brand"
          src="/img/logo.png"
          alt="RTX Water Purifiers"
          width={300}
          height={136}
          priority
        />

        <CartBadge />
      </header>

      <section className="hero">
        <div className="hero__copy">
          <h1>
            Pure Water.
            <br />
            Pure <em>Life.</em>
          </h1>
          <p className="hero__sub">
            Trusted by 80K+ families for 25+ years. Delivering pure, safe and healthy water to
            every Indian home.
          </p>
          <Link className="btn" href="/shop">
            Shop Now
            <ArrowRight className="icon icon--sm" />
          </Link>
        </div>

        <Image
          className="hero__img"
          src="/img/hero.jpg"
          alt="RTX water purifier, replacement filter cartridge and a glass of filtered water"
          width={916}
          height={1320}
          priority
        />
      </section>

      <StatsCard />

      {/* The channel is how the brand actually introduces itself — the units
          opened up, the tests run on camera — so it comes straight after the
          hero, before anything is put up for sale. */}
      <div className="band">
        <YouTubeCard />
      </div>

      <div className="band">
        <VideoSection />
      </div>

      {/* Then the sell: the top sellers, and only those. A shortlist of four
          is a recommendation; the whole catalogue is homework. */}
      {featured.length > 0 && (
        <div className="band">
          <SectionHead title="Featured Products" href="/shop" cta="Shop All" />
          <div className="grid">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="band">
        <DeliveryMap />
      </div>

      <div className="band">
        <StoryBlock />
      </div>

      {/* Heading and all: "What Our Customers Say" over an empty space is
          worse than the section simply not being there. */}
      {reviews.length > 0 && (
        <div className="band">
          <SectionHead title="What Our Customers Say" href="/support" />
          <ReviewCarousel reviews={reviews} />
        </div>
      )}

      <TrustStrip items={trustLanding} variant="bare" />

      <CertificationStrip certifications={certifications} />

      <div className="landing-foot" />
    </AppShell>
  );
}
