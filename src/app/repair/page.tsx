import Image from 'next/image';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import RepairBooking from '@/components/RepairBooking';
import { SectionHead, ReviewStars } from '@/components/sections';
import { Phone, Pin, WhatsApp } from '@/components/Icons';
import { serviceReviews } from '@/data/content';

export const metadata = {
  title: 'Repair',
  description: 'Book a repair visit for your RTX water purifier across Delhi NCR.',
};

const TEL = '+918810294546';

const STEPS = [
  { t: 'You tell us', d: 'Symptom, address, number' },
  { t: 'We call', d: 'Within one working day' },
  { t: 'We fix it', d: 'Same visit, 9 times in 10' },
];

/** Illustrative of the work, captioned as such — not photographs of jobs. */
const COVERS = [
  { img: '/img/svc_unit.jpg', t: 'Strip & sanitise', d: 'Housing, tank, taps' },
  { img: '/img/svc_filter.jpg', t: 'Filters & membrane', d: 'Sealed RTX parts' },
  { img: '/img/svc_tap.jpg', t: 'Flow & TDS test', d: 'Logged before & after' },
];

export default function RepairPage() {
  const avg =
    Math.round((serviceReviews.reduce((s, r) => s + r.rating, 0) / serviceReviews.length) * 10) /
    10;

  return (
    <AppShell tabBar>
      <section className="phero phero--repair">
        <Image
          className="phero__img"
          src="/img/svc_splash.jpg"
          alt=""
          width={266}
          height={304}
          priority
        />

        {/* Talking to a human is the fastest route out of a broken purifier,
            so it sits at the top of the screen, not the bottom. */}
        <div className="phero__actions">
          <a className="rbtn" href={`tel:${TEL}`} aria-label="Call the service desk">
            <Phone />
          </a>
          <a
            className="rbtn rbtn--wa"
            href={`https://wa.me/${TEL.replace('+', '')}`}
            aria-label="WhatsApp the service desk"
          >
            <WhatsApp />
          </a>
        </div>

        <div className="phero__inner">
          <p className="phero__eyebrow">Service Request</p>
          <h1>
            Something wrong?
            <br />
            <em>We come to you.</em>
          </h1>
          <p className="phero__sub">
            Book in under a minute. An engineer calls you back the next working day.
          </p>
          <span className="area-pill">
            <Pin />
            Delhi NCR only
          </span>

          <div className="phero__meta">
            <div>
              <b>48h</b>
              <span>Average callout</span>
            </div>
            <div>
              <b>92%</b>
              <span>Fixed first visit</span>
            </div>
            <div>
              <b>4.8</b>
              <span>Engineer rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* The one thing everybody wants to know before filling a form in. */}
      <div className="fee">
        <div className="fee__amt">
          <b>₹299</b>
          <span>visit fee</span>
        </div>
        <div className="fee__body">
          <b>Comes off the repair</b>
          <span>
            Nothing to pay now · free under an active <Link href="/amc">AMC</Link>
          </span>
        </div>
      </div>

      <div className="whatgrid whatgrid--num">
        {STEPS.map((s, i) => (
          <div className="what" key={s.t}>
            <span className="what__bubble what__bubble--n">{i + 1}</span>
            <span className="what__text">
              <b>{s.t}</b>
              <span>{s.d}</span>
            </span>
          </div>
        ))}
      </div>

      <section className="band" aria-labelledby="covers">
        <SectionHead title="What a Visit Covers" id="covers" />
        <div className="covers">
          {COVERS.map((c) => (
            <figure className="cover" key={c.t}>
              <Image src={c.img} alt="" width={207} height={283} sizes="(max-width:760px) 33vw, 200px" />
              <figcaption>
                <b>{c.t}</b>
                <span>{c.d}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 22 }} aria-labelledby="book">
        <SectionHead title="Book a Visit" id="book" />
        <RepairBooking />
      </section>

      <section className="band" aria-labelledby="rp-rev">
        <SectionHead title="After the Visit" id="rp-rev" />
        <div className="revsum">
          <b>{avg}</b>
          <div>
            <ReviewStars rating={avg} />
            <span>12,400+ visits across Delhi NCR</span>
          </div>
        </div>
        <div className="srevs">
          {serviceReviews.map((r) => (
            <article className="srev" key={r.name}>
              <div className="srev__top">
                <ReviewStars rating={r.rating} />
                <span className="srev__job">{r.job}</span>
              </div>
              <p>{r.body}</p>
              <div className="srev__by">
                <span className="srev__av" aria-hidden="true">
                  {r.name.charAt(0)}
                </span>
                <span>
                  <b>{r.name}</b>
                  <span>
                    {r.city} · {r.when}
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="amc-cta">
        <Link className="btn btn--ghost btn--block btn--sm" href="/amc">
          Tired of paying per visit? See AMC plans
        </Link>
      </div>

      <div className="foot-space" />
    </AppShell>
  );
}
