import Image from 'next/image';
import Link from 'next/link';
import { categories } from '@/data/catalog';

const SERVICE = [
  { href: '/amc', label: 'AMC plans' },
  { href: '/repair', label: 'Book a repair' },
  { href: '/support', label: 'Support & FAQ' },
  { href: '/account', label: 'My account' },
];

/**
 * Wide-viewport only. A phone ends on the tab bar and needs nothing below it;
 * once the tab bar moves to the top there is an empty bottom edge to close,
 * and room for the links the phone reaches through the tab bar instead.
 */
export default function SiteFooter() {
  return (
    <footer className="sitefoot">
      <div className="sitefoot__inner">
        <div className="sitefoot__brand">
          <Image src="/img/logo.png" alt="RTX Water Purifiers" width={300} height={136} />
          <p>
            Pure, safe water for every Indian home. RO, UV and UF purifiers, genuine consumables,
            and engineers who turn up when they said they would.
          </p>
        </div>

        <nav className="sitefoot__col" aria-label="Shop">
          <h2>Shop</h2>
          <Link href="/shop">Everything</Link>
          {categories
            .filter((c) => !c.href)
            .map((c) => (
              <Link key={c.slug} href={`/shop?c=${c.slug}`}>
                {c.name}
              </Link>
            ))}
        </nav>

        <nav className="sitefoot__col" aria-label="Service">
          <h2>Service</h2>
          {SERVICE.map((s) => (
            <Link key={s.href} href={s.href}>
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="sitefoot__col">
          <h2>Talk to us</h2>
          <a href="tel:+918810294546">+91 88102 94546</a>
          <a href="mailto:rotechnicalxperts@gmail.com">rotechnicalxperts@gmail.com</a>
          <p className="sitefoot__note">
            9am–7pm, Monday to Saturday. On-site service across Delhi NCR, shipping all over India.
          </p>
        </div>
      </div>

      <div className="sitefoot__base">
        <span>© {new Date().getFullYear()} RO Technical Xperts</span>
        <span>25+ years · 80K+ families served</span>
      </div>
    </footer>
  );
}
