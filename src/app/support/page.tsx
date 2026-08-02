import AppShell from '@/components/AppShell';
import Faq from '@/components/Faq';
import { ChevronRight, SpecIcon } from '@/components/Icons';
import type { SpecKey } from '@/data/catalog';

export const metadata = { title: 'Support' };

const CHANNELS: Array<{ icon: SpecKey; title: string; note: string }> = [
  { icon: 'smart', title: 'Call us', note: '+91 88102 94546 · 9am–7pm, Mon to Sat' },
  { icon: 'flow', title: 'WhatsApp', note: 'Send a photo of the unit and we will diagnose it' },
  { icon: 'filter', title: 'Email', note: 'rotechnicalxperts@gmail.com · replies within a day' },
];

const FAQS = [
  {
    q: 'How often should filters be replaced?',
    a: 'Sediment and carbon filters every 6 to 8 months, the RO membrane every 2 years. If your input TDS is above 500 ppm, bring both forward by roughly a third.',
  },
  {
    q: 'What does the TDS controller actually do?',
    a: 'It blends a measured amount of pre-RO water back into the purified stream, so essential minerals are retained instead of being stripped out entirely. You can set the output level during installation.',
  },
  {
    q: 'Do you deliver outside Delhi NCR?',
    a: 'Products ship nationwide. On-site installation, AMC and repair visits currently cover Delhi NCR, with more cities being added.',
  },
  {
    q: 'What is covered by the warranty?',
    a: 'One year on the unit covering manufacturing defects and electrical components. Consumables — filters, membranes and cartridges — are excluded, since they wear by design.',
  },
  {
    q: 'Can I cancel an order after paying?',
    a: 'Yes, any time before the shipment is handed to the courier. Refunds go back to the original payment method and usually settle within five to seven working days.',
  },
];

export default function SupportPage() {
  return (
    <AppShell tabBar>
      <div className="page-head">
        <h1>Support</h1>
        <p>Answers to the questions we get most, and three ways to reach a human.</p>
      </div>

      <div className="rows">
        {CHANNELS.map((c) => (
          <button className="icon-row" key={c.title}>
            <span className="icon-row__bubble">
              <SpecIcon name={c.icon} />
            </span>
            <span className="icon-row__body">
              <h3>{c.title}</h3>
              <p>{c.note}</p>
            </span>
            <span className="icon-row__chev">
              <ChevronRight />
            </span>
          </button>
        ))}
      </div>

      <section style={{ padding: '24px var(--pad) 0' }}>
        <h2
          style={{
            margin: '0 0 4px',
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-.015em',
            color: 'var(--ink)',
          }}
        >
          Common questions
        </h2>
        {FAQS.map((f) => (
          <Faq key={f.q} q={f.q} a={f.a} />
        ))}
      </section>

      <div className="foot-space" />
    </AppShell>
  );
}
