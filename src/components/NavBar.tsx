import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from './Icons';

export default function NavBar({
  title,
  back = '/shop',
  actions,
}: {
  title: string;
  back?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="navbar">
      <Link href={back} className="tap" aria-label="Back">
        <ArrowLeft className="icon" />
      </Link>
      <h1>{title}</h1>
      <div className="navbar__actions">{actions}</div>
    </header>
  );
}
