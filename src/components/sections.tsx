import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, Play, SpecIcon, Star } from './Icons';
import { stats, story, featureVideo, videos, youtube, type TrustItem } from '@/data/content';

/* ── section heading with an optional "View All" ─────────── */
export function SectionHead({
  title,
  href,
  cta = 'View All',
  id,
}: {
  title: string;
  href?: string;
  cta?: string;
  id?: string;
}) {
  return (
    <div className="section-head">
      <h2 id={id}>{title}</h2>
      {href && (
        <Link className="link-more" href={href}>
          {cta}
          <ArrowRight className="icon icon--sm" />
        </Link>
      )}
    </div>
  );
}

/* ── 25+ / 80K+ / 100% / All India ───────────────────────── */
export function StatsCard() {
  return (
    <section className="statcard" aria-label="RTX by the numbers">
      {stats.map((s) => (
        <div className="statcard__item" key={s.value}>
          <span className="statcard__bubble">
            <SpecIcon name={s.icon} />
          </span>
          <b>{s.value}</b>
          <span className="statcard__label">
            {s.label[0]}
            <br />
            {s.label[1]}
          </span>
        </div>
      ))}
    </section>
  );
}

/* ── video poster with a play affordance ─────────────────── */
export function VideoPoster({
  src,
  alt = '',
  size = 'lg',
  duration,
}: {
  src: string;
  alt?: string;
  size?: 'sm' | 'lg';
  duration?: string;
}) {
  return (
    <span className={`poster poster--${size}`}>
      <Image src={src} alt={alt} width={640} height={420} />
      <span className="poster__play" aria-hidden="true">
        <Play />
      </span>
      {duration && <span className="poster__time">{duration}</span>}
    </span>
  );
}

/* ── Our Story ───────────────────────────────────────────── */
export function StoryBlock() {
  return (
    <section className="story" aria-labelledby="story-h">
      <div className="story__copy">
        <h2 id="story-h">{story.heading}</h2>
        <p>{story.body}</p>
        <Link className="link-blue" href="/support">
          {story.cta}
          <ArrowRight className="icon icon--sm" />
        </Link>
      </div>
      <button className="story__media" aria-label={`Play: ${story.heading}`}>
        <VideoPoster src={story.poster} size="sm" />
      </button>
    </section>
  );
}

/* ── RTX in Action ───────────────────────────────────────── */
export function VideoSection() {
  return (
    <section className="videos" aria-labelledby="videos-h">
      <div className="videos__intro">
        <h2 id="videos-h">{featureVideo.heading}</h2>
        <p>{featureVideo.body}</p>
      </div>

      <button className="videos__hero" aria-label={`Play: ${featureVideo.heading}`}>
        <VideoPoster src={featureVideo.poster} />
      </button>

      <div className="videos__rail">
        {videos.map((v) => (
          <button className="videos__item" key={v.duration} aria-label={`Play: ${v.title.join(' ')}`}>
            <VideoPoster src={v.poster} size="sm" duration={v.duration} />
            <span className="videos__meta">
              <b>{v.duration}</b>
              {v.title[0]}
              <br />
              {v.title[1]}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ── From Our YouTube Channel ────────────────────────────── */
export function YouTubeCard() {
  return (
    <section aria-labelledby="yt-h">
      <SectionHead title={youtube.heading} href="/support" id="yt-h" />
      {/* An <a>, not a <button>: Chrome shrink-wraps button content, which
          collapsed the 16/9 frame to zero height. */}
      <Link className="ytcard" href="/support" aria-label={`Play: ${youtube.title.join(' ')}`}>
        <span className="ytcard__frame">
          <Image className="ytcard__img" src="/img/pdp_th2.jpg" alt="" width={640} height={420} />
          <span className="ytcard__wash" aria-hidden="true" />
          <span className="ytcard__copy">
            <span className="ytcard__brand">RTX</span>
            <span className="ytcard__title">
              {youtube.title[0]}
              <br />
              {youtube.title[1]}
            </span>
          </span>
          <span className="ytcard__play" aria-hidden="true">
            <Play />
          </span>
        </span>
      </Link>
      <p className="ytcard__note">
        <Play aria-hidden="true" />
        Teardowns, installs and honest water tests — the whole RTX range, on camera.
      </p>
    </section>
  );
}

/* ── trust strips ────────────────────────────────────────── */
export function TrustStrip({ items, variant }: { items: TrustItem[]; variant: 'bare' | 'card' }) {
  return (
    <section className={`trust trust--${variant}`} aria-label="Why buy from RTX">
      {items.map((t) => (
        <div className="trust__item" key={t.title + t.note}>
          <span className="trust__bubble">
            <SpecIcon name={t.icon} />
          </span>
          <b>{t.title}</b>
          <span>{t.note}</span>
        </div>
      ))}
    </section>
  );
}

/* ── stacked benefit rows (product page) ─────────────────── */
export function BenefitList({ items }: { items: TrustItem[] }) {
  return (
    <section className="benefits" aria-label="What is included">
      {items.map((b) => (
        <div className="benefit" key={b.title}>
          <span className="benefit__bubble">
            <SpecIcon name={b.icon} />
          </span>
          <span className="benefit__body">
            <b>{b.title}</b>
            <span>{b.note}</span>
          </span>
        </div>
      ))}
    </section>
  );
}

/** Amber stars, used only inside customer reviews. */
export function ReviewStars({ rating, label }: { rating: number; label?: ReactNode }) {
  return (
    <div className="rating">
      <span className="stars stars--review" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} style={rating >= i + 0.75 ? undefined : { opacity: 0.25 }} />
        ))}
      </span>
      {label}
    </div>
  );
}
