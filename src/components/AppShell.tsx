import type { ReactNode } from 'react';
import TabBar from './TabBar';
import SiteFooter from './SiteFooter';

interface Props {
  /** Pinned above the scroll area (e.g. the product-detail nav bar). */
  header?: ReactNode;
  /** Pinned below it (e.g. the buy bar). Ignored when `tabBar` is set. */
  footer?: ReactNode;
  /** Render the five-tab primary navigation. */
  tabBar?: boolean;
  children: ReactNode;
}

/**
 * The phone-shaped app shell: a fixed-height column where only the middle
 * band scrolls, so headers and bottom bars stay put exactly as they do in
 * the reference screens.
 *
 * From 768px up the latch comes off — the column grows with its content, the
 * page itself scrolls, and CSS `order` lifts the tab bar to the top as the
 * site header. Screens that supply their own `footer` still get the tab bar
 * up there, because a wide layout has no bottom navigation to fall back on.
 */
export default function AppShell({ header, footer, tabBar, children }: Props) {
  return (
    <div className="screen">
      {header}
      <div className="scroll">{children}</div>
      {!tabBar && footer}
      <TabBar wideOnly={!tabBar} />
      <SiteFooter />
    </div>
  );
}
