import Image from 'next/image';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import CartBadge from '@/components/CartBadge';
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
import { getCertifications, getReviews } from '@/lib/api/source';

export const metadata = {
  description: 'RO water purifiers, filters, membranes and service for every Indian home.',
};

export default async function HomePage() {
  const [{ value: reviews }, { value: certifications }] = await Promise.all([
    getReviews(),
    getCertifications(),
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
        <Image
          className="hero__img"
          src="/img/hero.jpg"
          alt="RTX water purifier, replacement filter cartridge and a glass of filtered water"
          width={916}
          height={1320}
          priority
        />
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
      </section>

      <StatsCard />

      <div className="band">
        <StoryBlock />
      </div>

      <div className="band">
        <VideoSection />
      </div>

      <div className="band">
        <SectionHead title="What Our Customers Say" href="/support" />
        <ReviewCarousel reviews={reviews} />
      </div>

      <div className="band">
        <YouTubeCard />
      </div>

      <TrustStrip items={trustLanding} variant="bare" />

      <CertificationStrip certifications={certifications} />

      <div className="landing-foot" />
    </AppShell>
  );
}
