import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { Search } from '@/components/Icons';

export default function NotFound() {
  return (
    <AppShell>
      <div className="empty">
        <span className="empty__bubble">
          <Search />
        </span>
        <h2>Page not found</h2>
        <p>That link has moved or never existed. Everything else is still where you left it.</p>
        <Link className="btn" href="/">
          Go to home
        </Link>
      </div>
    </AppShell>
  );
}
