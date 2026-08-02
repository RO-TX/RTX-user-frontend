import Image from 'next/image';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { SectionHead } from '@/components/sections';
import Faq from '@/components/Faq';
import { ArrowRight, Check, Phone, Pin, SpecIcon, TabAmc, TabRepair, WhatsApp } from '@/components/Icons';
import PlanCards, { type Plan } from '@/components/PlanCards';
import { money } from '@/lib/money';
import type { SpecKey } from '@/data/catalog';

export const metadata = {
  title: 'AMC',
  description:
    'Annual maintenance contracts for RTX water purifiers. On-site service across Delhi NCR.',
};

/** The cities an engineer can actually reach. Nothing outside this list. */
const NCR = ['Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad', 'Greater Noida'];

const TEL = '+918810294546';

/** The whole idea in three tiles — read in about four seconds. */
const WHAT: Array<{ Icon: typeof TabAmc; big: string; small: string }> = [
  { Icon: TabAmc, big: 'We book the year', small: 'Visit dates fixed up front' },
  { Icon: TabRepair, big: 'We do the work', small: 'Clean, test, change filters' },
  { Icon: Check, big: 'You just drink', small: 'Nothing to remember' },
];

const PLANS: Plan[] = [
  {
    name: 'Essential',
    note: 'Servicing only',
    price: 1499,
    visits: '2 visits a year',
    includes: ['2 service visits', 'Clean and sanitise', 'TDS check'],
  },
  {
    name: 'Complete',
    note: 'Servicing + filters',
    price: 2499,
    visits: '4 visits a year',
    featured: true,
    includes: ['4 service visits', 'All filters included', '48h priority callout'],
  },
  {
    name: 'Total Care',
    note: 'Everything covered',
    price: 3999,
    visits: '4 visits + callouts',
    includes: ['Everything in Complete', 'RO membrane included', 'Unlimited callouts'],
  },
];

const COVERED: Array<{ icon: SpecKey; title: string; note: string }> = [
  { icon: 'install', title: 'Certified engineers', note: 'RTX-trained, verified' },
  { icon: 'genuine', title: 'Genuine parts', note: 'Sealed, never refills' },
  { icon: 'tds', title: 'Water report', note: 'TDS logged each visit' },
  { icon: 'payment', title: 'No hidden charges', note: 'Labour is in the plan' },
];

const FAQS = [
  {
    q: 'When does the plan start?',
    a: 'On the day of the first visit. If the unit is still under warranty, the AMC begins when the warranty ends — you never pay twice for the same cover.',
  },
  {
    q: 'Do you service outside Delhi NCR?',
    a: 'Not yet. Engineers are based across the NCR and every plan includes on-site visits, so we only sell AMCs where we can actually turn up. Spares and filters still ship all over India.',
  },
  {
    q: 'Can I upgrade mid-year?',
    a: 'Yes — pay the difference pro-rated against visits already used. The new cover applies the same day.',
  },
];

export default function AmcPage() {
  return (
    <AppShell tabBar>
      {/* Full-bleed photo under a navy scrim — the biggest asset there is,
          framed on the water rather than the product so it doesn't repeat
          the landing screen. */}
      <section className="phero">
        <Image
          className="phero__img"
          src="/img/hero.jpg"
          alt=""
          width={916}
          height={1320}
          priority
        />
        {/* Same pair as /repair — a plan question is a phone call away. */}
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
          <p className="phero__eyebrow">Annual Maintenance</p>
          <h1>
            Your purifier,
            <br />
            <em>looked after.</em>
          </h1>
          <p className="phero__sub">
            We visit on schedule, change what is due and log the water. From{' '}
            {money(PLANS[0].price)} a year.
          </p>
          <span className="area-pill">
            <Pin />
            Delhi NCR only
          </span>

          <div className="phero__meta">
            <div>
              <b>48h</b>
              <span>Callout window</span>
            </div>
            <div>
              <b>12k+</b>
              <span>Visits done</span>
            </div>
            <div>
              <b>4.8</b>
              <span>Service rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* The people, as far as the asset folder allows: monograms, not stock
          faces. Drop a real engineer portrait in here when there is one. */}
      <div className="crew">
        <div className="crew__faces" aria-hidden="true">
          <span>RK</span>
          <span>AS</span>
          <span>MV</span>
          <span className="crew__more">+40</span>
        </div>
        <div className="crew__body">
          <b>RTX-trained engineers</b>
          <span>Background verified · same engineer where we can</span>
        </div>
      </div>

      {/* What an AMC actually is, before any pricing. */}
      <div className="whatgrid">
        {WHAT.map(({ Icon, big, small }) => (
          <div className="what" key={big}>
            <span className="what__bubble">
              <Icon />
            </span>
            <span className="what__text">
              <b>{big}</b>
              <span>{small}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="panel panel--active">
        <span className="pill-note pill-note--live">Active</span>
        <div style={{ minWidth: 0 }}>
          <p className="panel__title">PureFlow Pro · Complete</p>
          <p className="panel__sub">Next visit 12 Sep 2026 · renews 12 Mar 2027</p>
        </div>
      </div>

      <section style={{ marginTop: 24 }} aria-labelledby="plans">
        <SectionHead title="Choose a Plan" id="plans" />
        <PlanCards plans={PLANS} />
      </section>

      {/* Said once in the hero, said properly here. */}
      <section className="area" aria-labelledby="area">
        <span className="area__bubble">
          <Pin />
        </span>
        <h2 id="area">We service Delhi NCR</h2>
        <p>On-site AMC visits are available in these cities only.</p>
        <div className="area__cities">
          {NCR.map((city) => (
            <span className="chip" key={city}>
              {city}
            </span>
          ))}
        </div>
        <p className="area__foot">Filters and spares still ship across India.</p>
      </section>

      <section className="band" aria-labelledby="covered">
        <SectionHead title="Every Plan Includes" id="covered" />
        <div className="benefits">
          {COVERED.map((c) => (
            <div className="benefit" key={c.title}>
              <span className="benefit__bubble">
                <SpecIcon name={c.icon} />
              </span>
              <span className="benefit__body">
                <b>{c.title}</b>
                <span>{c.note}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="band" aria-labelledby="amc-faq">
        <SectionHead title="Questions" id="amc-faq" />
        <div style={{ padding: '4px var(--pad) 0' }}>
          {FAQS.map((f) => (
            <Faq key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <div className="amc-cta">
        <Link className="btn btn--block" href="/repair">
          Talk to a service advisor
          <ArrowRight className="icon icon--sm" />
        </Link>
        <p>
          <Pin className="icon icon--sm" />
          Service available in Delhi NCR only
        </p>
      </div>

      <div className="foot-space" />
    </AppShell>
  );
}
