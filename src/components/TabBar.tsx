'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartBadge from './CartBadge';
import { TabHome, TabShop, TabAmc, TabRepair, TabAccount } from './Icons';
import { useAuth } from '@/lib/auth-context';

const TABS = [
  { href: '/', label: 'Home', Icon: TabHome },
  { href: '/shop', label: 'Shop', Icon: TabShop },
  { href: '/amc', label: 'AMC', Icon: TabAmc },
  { href: '/repair', label: 'Repair', Icon: TabRepair },
  { href: '/account', label: 'Profile', Icon: TabAccount },
] as const;

/**
 * The five primary destinations. On a phone this is the bottom tab bar; from
 * 768px up the same element flips to the top of the page as the site header,
 * which is why the brand and cart live in here — above 768px `.appbar` is
 * hidden and this bar carries them instead.
 *
 * `wideOnly` is for screens that own their bottom bar on a phone (cart,
 * checkout, 404): they still need a header once the layout goes wide.
 */
export default function TabBar({ wideOnly = false }: { wideOnly?: boolean }) {
  const pathname = usePathname();
  const { user, status } = useAuth();
  const [hidden, setHidden] = useState(false);

  // Phone only: reading further down the page tucks the bar away, swiping
  // back brings it straight back. `.scroll` is the scroller on a phone —
  // above 768px the window scrolls and this bar is the top rail, so the
  // media query keeps it out of the way there.
  useEffect(() => {
    const scroller = document.querySelector('.scroll');
    if (!scroller) return;

    const phone = window.matchMedia('(max-width:767px)');
    let last = scroller.scrollTop;
    setHidden(false);

    const onScroll = () => {
      const y = scroller.scrollTop;
      const dy = y - last;
      if (Math.abs(dy) < 8) return; // ignore rubber-banding and jitter
      last = y;
      setHidden(phone.matches && dy > 0 && y > 48);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <nav
      className={`tabbar${wideOnly ? ' tabbar--wide' : ''}`}
      aria-label="Primary"
      data-hidden={hidden || undefined}
    >
      <div className="tabbar__inner">
        <Link className="tabbar__brand" href="/" aria-label="RTX Water Purifiers — home">
          <Image src="/img/logo.png" alt="RTX Water Purifiers" width={300} height={136} />
        </Link>

        <div className="tabbar__tabs">
          {TABS.map((tab) => {
            const { href, Icon } = tab;
            // /shop stays lit while browsing a product detail page.
            const active =
              pathname === href || (href === '/shop' && pathname.startsWith('/product'));
            // The profile tab says who you are — or that you are not signed in.
            const label =
              href === '/account' && status !== 'loading'
                ? (user?.firstName ?? 'Sign in')
                : tab.label;

            return (
              <Link
                key={href}
                href={href}
                className="tab"
                aria-current={active ? 'page' : undefined}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="tabbar__end">
          <CartBadge />
        </div>
      </div>
    </nav>
  );
}
