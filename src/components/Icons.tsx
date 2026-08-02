import type { SVGProps } from 'react';
import type { SpecKey } from '@/data/catalog';

type P = SVGProps<SVGSVGElement>;

/** Stroked 24x24 outline icons. Stroke/size come from CSS so callers stay tidy. */
const S = (props: P) => <svg viewBox="0 0 24 24" aria-hidden="true" {...props} />;

export const Menu = (p: P) => (
  <S {...p}><path d="M4 7h16M4 12h16M4 17h16" /></S>
);
export const Phone = (p: P) => (
  <S {...p}>
    <path d="M6.4 3.6h3l1.5 3.7-1.9 1.4a11.4 11.4 0 0 0 5.3 5.3l1.4-1.9 3.7 1.5v3a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.4 5.8a2 2 0 0 1 2-2.2Z" />
  </S>
);
export const WhatsApp = (p: P) => (
  <S {...p}>
    <path d="M20.2 12a8.2 8.2 0 0 1-12.1 7.2L3.8 20.3l1.1-4.2A8.2 8.2 0 1 1 20.2 12Z" />
    <path d="M9.3 8.6c.3-.1.7 0 .9.3l.7 1.2c.1.3.1.6-.1.8l-.5.5a5.4 5.4 0 0 0 2.4 2.4l.5-.5c.2-.2.5-.2.8-.1l1.2.7c.3.2.4.6.3.9-.3.8-1.2 1.2-2 1a7 7 0 0 1-4.6-4.6c-.2-.8.2-1.7 1-2Z" />
  </S>
);
export const Pin = (p: P) => (
  <S {...p}>
    <path d="M12 21.2s7-5.6 7-11.2a7 7 0 1 0-14 0c0 5.6 7 11.2 7 11.2Z" />
    <circle cx="12" cy="9.7" r="2.6" />
  </S>
);
export const Cart = (p: P) => (
  <S {...p}>
    <path d="M3 4.2h1.6a1.2 1.2 0 0 1 1.17.94L8 16.1a1.6 1.6 0 0 0 1.57 1.26h8.2a1.6 1.6 0 0 0 1.56-1.23l1.4-6.06a.9.9 0 0 0-.88-1.1H6.5" />
    <circle cx="10.3" cy="20" r="1.35" /><circle cx="17.7" cy="20" r="1.35" />
  </S>
);
export const ArrowRight = (p: P) => (
  <S {...p}><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></S>
);
export const ArrowLeft = (p: P) => (
  <S {...p}><path d="M20 12H5" /><path d="m11 6-6 6 6 6" /></S>
);
export const ChevronRight = (p: P) => (
  <S {...p}><path d="m9 5 7 7-7 7" /></S>
);
export const Bell = (p: P) => (
  <S {...p}>
    <path d="M18 8.6a6 6 0 1 0-12 0c0 6-2.3 7.7-2.3 7.7h16.6S18 14.6 18 8.6Z" />
    <path d="M13.7 19.8a2 2 0 0 1-3.4 0" />
  </S>
);
export const Search = (p: P) => (
  <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.7-3.7" /></S>
);
export const Sliders = (p: P) => (
  <S {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" />
  </S>
);
export const Plus = (p: P) => (<S {...p}><path d="M12 5v14M5 12h14" /></S>);
export const Minus = (p: P) => (<S {...p}><path d="M5 12h14" /></S>);
export const Heart = (p: P) => (
  <S {...p}><path d="M12 20.3s-7.6-4.6-7.6-9.6a4.3 4.3 0 0 1 7.6-2.7 4.3 4.3 0 0 1 7.6 2.7c0 5-7.6 9.6-7.6 9.6Z" /></S>
);
export const Share = (p: P) => (
  <S {...p}>
    <path d="M12 15.5V3.4" /><path d="m7.8 7.6 4.2-4.2 4.2 4.2" />
    <path d="M5.2 13.4v5.9a1.6 1.6 0 0 0 1.6 1.6h10.4a1.6 1.6 0 0 0 1.6-1.6v-5.9" />
  </S>
);
export const Trash = (p: P) => (
  <S {...p}>
    <path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
    <path d="M6.6 6.5 7.5 19a1.6 1.6 0 0 0 1.6 1.5h5.8a1.6 1.6 0 0 0 1.6-1.5l.9-12.5" />
  </S>
);
export const Check = (p: P) => (<S {...p}><path d="m5 12.5 4.5 4.5L19 7" /></S>);
export const Eye = (p: P) => (
  <S {...p}>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </S>
);
export const EyeOff = (p: P) => (
  <S {...p}>
    <path d="M10.6 6.7A9.9 9.9 0 0 1 12 6.6c6.4 0 10 5.4 10 5.4a18 18 0 0 1-3.2 3.7M6.5 8.3A17.6 17.6 0 0 0 2 12s3.6 5.4 10 5.4a10 10 0 0 0 3.4-.55" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M3 3l18 18" />
  </S>
);

/** Solid star — filled via CSS `fill:currentColor`. */
export const Star = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9L12 2.6Z" />
  </svg>
);

/** Bestseller pill glyph — solid, drawn white on the gradient. */
export const BadgeGlyph = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M5 3.5h14a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5Z" opacity=".35" />
    <path d="M12 6.4a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 0 1 0-6.2Zm-3.4 8.2h6.8l.9 4-4.3-2-4.3 2 .9-4Z" />
  </svg>
);

/* ── landing feature icons ─────────────────────────────── */
export const Droplet = (p: P) => (
  <S {...p}><path d="M12 2.6S5.4 9.3 5.4 14a6.6 6.6 0 0 0 13.2 0C18.6 9.3 12 2.6 12 2.6Z" /></S>
);
export const ShieldCheck = (p: P) => (
  <S {...p}>
    <path d="M12 2.8 4.9 6v5.4c0 4.4 3 8.4 7.1 9.6 4.1-1.2 7.1-5.2 7.1-9.6V6L12 2.8Z" />
    <path d="m8.9 11.9 2.2 2.2 4-4.2" />
  </S>
);
export const Tools = (p: P) => (
  <S {...p}>
    <g transform="translate(-2 2.4) scale(.7)">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8Z" />
    </g>
    <g transform="translate(12.4 -1.6) scale(.7) rotate(90 12 12)">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8Z" />
    </g>
  </S>
);
export const Award = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="9.1" r="6.1" />
    <path d="m8.4 14.4-1.3 6.4 4.9-2.5 4.9 2.5-1.3-6.4" />
    <path d="m12 6.1 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3 1-2Z" />
  </S>
);

/* ── repair symptoms ───────────────────────────────────── */
export const Bolt = (p: P) => (
  <S {...p}><path d="M13.4 2.6 5.2 13.4h5.6l-.6 8 8.4-11h-5.8l.6-7.8Z" /></S>
);
export const Sound = (p: P) => (
  <S {...p}>
    <path d="M4 9.4h3.4L12 5.2v13.6l-4.6-4.2H4V9.4Z" />
    <path d="M15.6 9.2a4 4 0 0 1 0 5.6M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />
  </S>
);
export const Cup = (p: P) => (
  <S {...p}>
    <path d="M6.6 4.4h10.8l-1.2 14.4a2 2 0 0 1-2 1.8h-4.4a2 2 0 0 1-2-1.8L6.6 4.4Z" />
    <path d="M7.2 10.6h9.6" />
  </S>
);
export const Leak = (p: P) => (
  <S {...p}>
    <path d="M3.4 5.4h7.2v3.8H3.4z" />
    <path d="M10.6 7.3h4.2a2 2 0 0 1 2 2v2.4h-3.4" />
    <path d="M13.4 15.4s-1.7 1.9-1.7 3a1.7 1.7 0 1 0 3.4 0c0-1.1-1.7-3-1.7-3Z" />
  </S>
);

/* ── tab bar ───────────────────────────────────────────── */
export const TabHome = (p: P) => (
  <S {...p}><path d="M3.6 10.4 12 3.8l8.4 6.6V19a1.6 1.6 0 0 1-1.6 1.6h-3.9v-5.8H9.1v5.8H5.2A1.6 1.6 0 0 1 3.6 19v-8.6Z" /></S>
);
export const TabShop = (p: P) => (
  <S {...p}>
    <path d="M5.4 7.4h13.2l.9 12.1a1.2 1.2 0 0 1-1.2 1.3H5.7a1.2 1.2 0 0 1-1.2-1.3l.9-12.1Z" />
    <path d="M9.1 7.4V5.9a2.9 2.9 0 0 1 5.8 0v1.5" />
  </S>
);
export const TabServices = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1" />
  </S>
);
export const TabSupport = (p: P) => (
  <S {...p}>
    <path d="M8.2 4.4H6.6a1.8 1.8 0 0 0-1.8 1.8v13a1.8 1.8 0 0 0 1.8 1.8h10.8a1.8 1.8 0 0 0 1.8-1.8v-13a1.8 1.8 0 0 0-1.8-1.8h-1.6" />
    <path d="M9.4 2.8h5.2v3.2H9.4z" />
    <path d="m9.6 13.4 1.7 1.7 3.3-3.4" />
  </S>
);
export const TabAccount = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="8.3" r="3.5" />
    <path d="M5.2 19.8c.5-3.4 3.4-5.4 6.8-5.4s6.3 2 6.8 5.4" />
  </S>
);
/** AMC — a service calendar with a tick. */
export const TabAmc = (p: P) => (
  <S {...p}>
    <path d="M4.4 5.6h15.2a1 1 0 0 1 1 1v12.2a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1V6.6a1 1 0 0 1 1-1Z" />
    <path d="M3.4 10.2h17.2M8 3.4v4.2M16 3.4v4.2" />
    <path d="m9.2 15.2 2 2 3.6-3.8" />
  </S>
);
/** Repair — a spanner. */
export const TabRepair = (p: P) => (
  <S {...p}>
    <path d="M20.2 5.2 17 8.4a1.4 1.4 0 0 1-2 0l-1.4-1.4a1.4 1.4 0 0 1 0-2l3.2-3.2a5.6 5.6 0 0 0-7.1 7.1l-6.1 6.1a2.4 2.4 0 0 0 3.4 3.4l6.1-6.1a5.6 5.6 0 0 0 7.1-7.1Z" />
  </S>
);

/* ── product spec icons ────────────────────────────────── */
const SpecShield = (p: P) => (
  <S {...p}>
    <path d="M12 3 5.6 5.9v4.8c0 3.9 2.7 7.5 6.4 8.6 3.7-1.1 6.4-4.7 6.4-8.6V5.9L12 3Z" />
    <path d="M12 8.4s-2.2 2.4-2.2 3.9a2.2 2.2 0 0 0 4.4 0c0-1.5-2.2-3.9-2.2-3.9Z" />
  </S>
);
const SpecTds = (p: P) => (
  <S {...p}><path d="M7.5 4.4v9.2a3 3 0 0 0 3 3h5.4" /><path d="m13.1 13.6 3.2 3.2-3.2 3.2" /></S>
);
const SpecDroplet = (p: P) => (
  <S {...p}><path d="M12 3.2S6.1 9.3 6.1 13.6a5.9 5.9 0 0 0 11.8 0C17.9 9.3 12 3.2 12 3.2Z" /></S>
);
const SpecSmart = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
  </S>
);
const SpecFilter = (p: P) => (
  <S {...p}>
    <path d="M4.4 5.2h15.2l-5.9 7v6.4l-3.4 1.8v-8.2l-5.9-7Z" />
  </S>
);
const SpecFlow = (p: P) => (
  <S {...p}>
    <path d="M3.6 8.4h11.2a3 3 0 1 1-3 3" /><path d="m12.4 5.4 3 3-3 3" />
    <path d="M3.6 16.2h7" />
  </S>
);
const SpecWarranty = (p: P) => (
  <S {...p}>
    <path d="M12 3 5.4 5.8v4.9c0 4 2.8 7.7 6.6 8.8 3.8-1.1 6.6-4.8 6.6-8.8V5.8L12 3Z" />
    <path d="m9.2 11.8 2 2 3.6-3.9" />
  </S>
);
const SpecInstall = (p: P) => (
  <S {...p}>
    <path d="M14.4 4.2a4 4 0 0 0-4.8 5.2l-5.2 5.2a1.9 1.9 0 1 0 2.7 2.7l5.2-5.2a4 4 0 0 0 5.2-4.8l-2.3 2.3-2.2-.6-.6-2.2 2-2.6Z" />
  </S>
);

/* Two whole people rather than one person and two loose arcs. The old glyph
   drew the second figure as a bare crescent and a floating shoulder, which
   at 17px knocked out of navy read as debris rather than a person. */
const SpecFamilies = (p: P) => (
  <S {...p}>
    <circle cx="7.9" cy="8.6" r="2.9" />
    <path d="M2.9 19.2a5 5 0 0 1 10 0" />
    <circle cx="16.5" cy="8.6" r="2.9" />
    <path d="M11.5 19.2a5 5 0 0 1 10 0" />
  </S>
);
/* Squared off and re-centred; the wheels used to sit adrift below a box that
   was itself pushed off the middle of the 24 grid. */
const SpecDelivery = (p: P) => (
  <S {...p}>
    <rect x="2.8" y="6" width="9.4" height="8.4" rx="1.3" />
    <path d="M12.2 8.8h3.7l3.3 3.3v2.3h-7z" />
    <circle cx="7.2" cy="17.4" r="1.8" /><circle cx="16.2" cy="17.4" r="1.8" />
  </S>
);
const SpecPayment = (p: P) => (
  <S {...p}>
    <path d="M3.4 5.8h17.2a1 1 0 0 1 1 1v10.4a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1V6.8a1 1 0 0 1 1-1Z" />
    <path d="M2.4 9.8h19.2M5.6 14.4h3.2" />
  </S>
);
const SpecGenuine = (p: P) => (
  <S {...p}>
    <path d="m12 2.8 2.6 1.5 3 .1 1.5 2.6 1.5 2.6-1.5 2.6-1.5 2.6-3 .1L12 16.4l-2.6-1.5-3-.1-1.5-2.6L3.4 9.6l1.5-2.6 1.5-2.6 3-.1L12 2.8Z" transform="translate(0 1.4) scale(1 .92)" />
    <path d="m9.4 11.6 1.9 1.9 3.4-3.7" />
  </S>
);
const SpecReturns = (p: P) => (
  <S {...p}>
    <path d="M3.4 8.6 12 4.2l8.6 4.4-8.6 4.4-8.6-4.4Z" />
    <path d="M3.4 8.6v6.8L12 19.8l8.6-4.4V8.6" />
    <path d="M9.2 15.2h4.4" /><path d="m11.6 13.4-1.9 1.8 1.9 1.8" />
  </S>
);

const SPEC_ICONS: Record<SpecKey, (p: P) => React.ReactElement> = {
  shield: SpecShield,
  tds: SpecTds,
  droplet: SpecDroplet,
  smart: SpecSmart,
  filter: SpecFilter,
  flow: SpecFlow,
  warranty: SpecWarranty,
  install: SpecInstall,
  families: SpecFamilies,
  delivery: SpecDelivery,
  payment: SpecPayment,
  genuine: SpecGenuine,
  returns: SpecReturns,
};

/** Solid play triangle for video posters. */
export const Play = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M8.6 5.4v13.2l10.4-6.6L8.6 5.4Z" />
  </svg>
);

export function SpecIcon({ name, ...rest }: { name: SpecKey } & P) {
  const Cmp = SPEC_ICONS[name] ?? SpecShield;
  return <Cmp {...rest} />;
}
