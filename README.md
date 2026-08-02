# RTX Water Purifiers — Next.js app

A mobile-first storefront for RO Technical Xperts, built to match the reference
mockups in `../content/`. Same visual system as the static prototype one level
up (`../index.html`, `../home.html`, `../product.html`), rebuilt as a real app.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm typecheck
```

## Routes

| Route | What it is |
|---|---|
| `/` | Home — hero, stats, Our Story, RTX in Action, reviews, YouTube, trust strip |
| `/shop` | The catalogue: image category rail as the filter (`?c=purifiers`), live text search, product grid, promo, trust card |
| `/product/[slug]` | Product detail — gallery, specs, description, buy row, benefits, frequently bought together, reviews, related |
| `/cart` | Line items, quantity control, order summary |
| `/checkout` | Address, payment method, order confirmation |
| `/amc` | AMC plans, what every plan covers, how it works, FAQ |
| `/repair` | Symptom picker, booking form, how it works, contact channels |
| `/support` | Contact channels + FAQ accordion |
| `/account` | Profile, recent orders, settings rows |

All eleven products are prerendered via `generateStaticParams`.

## Layout model

Each route renders inside `AppShell` — a `100dvh` flex column where only the
middle band scrolls, so headers and bottom bars stay pinned. Above 760px the
shell becomes a centred 412×880 phone frame; below that it fills the viewport.

To ship a full-width desktop layout later, change the `@media (min-width:760px)`
block in `src/app/globals.css`. Nothing else assumes the phone frame.

## Design system

`src/app/globals.css` holds the whole thing: CSS custom properties for the
palette (sampled from the mockup PNGs, not guessed) and component classes under
`@layer components`.

Two accents, flat fills, no gradients: **teal `#0B808C`** (the RTX brand primary
from `RTX-PLATFORM-STANDARDS` §3) owns everything interactive — buttons, active
nav, links, icon bubbles, focus rings — and **navy `#083261`** owns emphasis
surfaces: service hero bands, the featured plan card, the Bestseller badge.
Amber appears only in review stars, red only in the YouTube play button.
Nothing else introduces a hue.

Primary navigation is five tabs — Home, Shop, AMC, Repair and a Profile avatar
chip. `/support` and `/about` are routable and linked (from section heads, the
home footer link and the account menu) but have no tab.

`/` is the home screen and it is the brand screen — hero, story, videos,
reviews, YouTube. It carries no product cards at all. Everything transactional
lives on `/shop`, which is the only catalogue: the image category rail is its
filter and the old text chip row is gone. `/home` and `/about` both 307 to `/`
via `next.config.ts`. Tailwind v4 is present and its `@theme` exposes the palette
for utilities, but the components are hand-written CSS so the port stays
pixel-faithful to the approved prototype.

Fonts are self-hosted via `next/font/local` — Outfit for UI, a latin subset of
Noto Serif Display for the hero headline only.

## State

`src/lib/cart.tsx` is a reducer + context, persisted to `localStorage` under
`rtx-cart`. It starts empty on both server and client and hydrates in an effect,
so the first paint can never mismatch.

## Data

`src/data/catalog.ts` is static, with shapes deliberately mirroring the Mongo
models in `RTX-main-backend` (name / slug / price / rating / images / category).
Swapping it for `GET /api/catalog/products` is a drop-in change.

## Known gaps

- **Product photography repeats.** Every image is cropped from the reference
  mockups (485×1012 source), so it is soft at 2x and reused across the longer
  tail of the catalogue. Real shots are needed before production.
- **Video posters and reviewer photos are stand-ins.** The extended mockups are
  141px wide, so no usable stills could be lifted from them — video cards reuse
  product shots and reviewers get an initial bubble instead of a portrait. Swap
  them in `src/data/content.ts` when real assets exist.
- **Videos do not play.** The posters link out; no player is wired up.
- **Prices are INR.** The extended mockups price the purifiers at ₹24,900 / ₹19,900
  and the copy reads "every Indian home". The consumables there still carried the
  earlier USD figures (18.00 / 22.00 / 42.00), which would put a filter at ₹18
  beside a ₹24,900 purifier — those were scaled to realistic rupees
  (₹1,800 / ₹2,200 / ₹4,200). All in `src/data/catalog.ts`.
- **Checkout takes no payment.** It validates, clears the cart and shows a
  reference. Razorpay and Delhivery are not wired in.
- **Auth is cosmetic.** "Hello, Rahul" and the account page are static.
